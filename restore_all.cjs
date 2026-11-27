const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const wsUrl = "ws://127.0.0.1:9229/5dff8a2b-b4a5-4f08-9ab5-7d1dfa9aaf13";
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('Connected to debugger for full restore...');
  
  // 1. Evaluate to get function objectId
  const getFuncMsg = {
    id: 1,
    method: "Runtime.evaluate",
    params: {
      expression: `(() => {
        const app = process._getActiveHandles().filter(h => h.constructor.name === "Server").map(s => s.listeners("request")[0]).find(l => l && l._router && l._router.stack);
        const last = app._router.stack[app._router.stack.length - 1];
        return last.handle.stack[13].handle; // viteErrorMiddleware
      })()`,
      returnByValue: false
    }
  };
  ws.send(JSON.stringify(getFuncMsg));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  
  if (response.id === 1) {
    const objectId = response.result.result.objectId;
    
    // 2. Get properties of the function (to find internal properties)
    ws.send(JSON.stringify({
      id: 2,
      method: "Runtime.getProperties",
      params: {
        objectId: objectId,
        ownProperties: true,
        accessorPropertiesOnly: false,
        generatePreview: false
      }
    }));
  } else if (response.id === 2) {
    // Find [[Scopes]]
    const internalProps = response.result.internalProperties;
    const scopesProp = internalProps.find(p => p.name === '[[Scopes]]');
    const scopesObjectId = scopesProp.value.objectId;
    
    // 3. Get properties of [[Scopes]] array
    ws.send(JSON.stringify({
      id: 3,
      method: "Runtime.getProperties",
      params: {
        objectId: scopesObjectId,
        ownProperties: true,
        accessorPropertiesOnly: false,
        generatePreview: false
      }
    }));
  } else if (response.id === 3) {
    // Get scope 0 (Closure) properties
    const props = response.result.result;
    const scope0 = props.find(p => p.name === '0');
    const scope0ObjectId = scope0.value.objectId;
    
    // 4. Get properties of Scope 0
    ws.send(JSON.stringify({
      id: 4,
      method: "Runtime.getProperties",
      params: {
        objectId: scope0ObjectId,
        ownProperties: true,
        accessorPropertiesOnly: false,
        generatePreview: false
      }
    }));
  } else if (response.id === 4) {
    const vars = response.result.result;
    const serverVar = vars.find(v => v.name === 'server');
    if (!serverVar) {
      console.error('Failed to find server variable in Closure');
      ws.close();
      return;
    }
    
    const serverObjectId = serverVar.value.objectId;
    
    // 5. Call function on server to dump all module codes!
    ws.send(JSON.stringify({
      id: 5,
      method: "Runtime.callFunctionOn",
      params: {
        objectId: serverObjectId,
        functionDeclaration: `function() {
          try {
            const modules = [];
            for (const [id, mod] of this.moduleGraph.idToModuleMap.entries()) {
              if (id.startsWith("/app/applet/src/") || id.startsWith("/app/applet/locales/")) {
                modules.push({
                  id,
                  code: mod.transformResult ? mod.transformResult.code : null
                });
              }
            }
            return modules;
          } catch (err) {
            return { error: err.message, stack: err.stack };
          }
        }`,
        returnByValue: true
      }
    }));
  } else if (response.id === 5) {
    const value = response.result.result.value;
    if (value.error) {
      console.error('Error on server dump:', value.error);
      ws.close();
      return;
    }
    
    console.log(`Successfully dumped ${value.length} modules from memory!`);
    
    let restoredCount = 0;
    for (const mod of value) {
      if (!mod.code) continue;
      
      // Map back to relative path
      // ID starts with '/app/applet/'
      const relativePath = mod.id.replace(/^\/app\/applet\//, '');
      const absolutePath = path.join(__dirname, relativePath);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      
      // Write to file!
      fs.writeFileSync(absolutePath, mod.code, 'utf8');
      console.log(`Restored: ${relativePath} (${mod.code.length} bytes)`);
      restoredCount++;
    }
    
    console.log(`\nFull restore completed! Total restored files: ${restoredCount}`);
    ws.close();
  }
});

ws.on('error', (err) => {
  console.error('WebSocket Error:', err);
});
