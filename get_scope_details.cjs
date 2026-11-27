const WebSocket = require('ws');

const wsUrl = "ws://127.0.0.1:9229/5dff8a2b-b4a5-4f08-9ab5-7d1dfa9aaf13";
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('Connected to debugger');
  
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

let step = 1;
let scopesObjectId = null;

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
    scopesObjectId = scopesProp.value.objectId;
    console.log('Scopes objectId:', scopesObjectId);
    
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
    // For each scope in the scopes array (0, 1, 2)
    const props = response.result.result;
    console.log('Scopes properties keys:', props.map(p => p.name));
    
    // Let's get scope 0 (Closure) properties
    const scope0 = props.find(p => p.name === '0');
    const scope0ObjectId = scope0.value.objectId;
    console.log('Scope 0 (Closure) objectId:', scope0ObjectId);
    
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
    // Look at variables inside the Closure scope!
    const vars = response.result.result;
    console.log('Closure variables:');
    for (const v of vars) {
      console.log(`- ${v.name}: type=${v.value.type}, className=${v.value.className || 'none'}, objectId=${v.value.objectId || 'none'}`);
      
      // If we find 'server', we will dump its properties
      if (v.name === 'server') {
        const serverObjectId = v.value.objectId;
        console.log('Found server objectId!', serverObjectId);
        
        // 5. Evaluate an expression inside this scope or on this server object!
        // Wait, CDP allows us to evaluate an expression using callFunctionOn!
        // We can run a function with 'this' set to the server object!
        ws.send(JSON.stringify({
          id: 5,
          method: "Runtime.callFunctionOn",
          params: {
            objectId: serverObjectId,
            functionDeclaration: `function() {
              try {
                // 'this' is the ViteDevServer instance!
                const keys = Object.keys(this);
                const ids = [];
                for (const key of this.moduleGraph.idToModuleMap.keys()) {
                  ids.push(key);
                }
                return { keys, idsCount: ids.length, ids: ids.slice(0, 50) };
              } catch (err) {
                return { error: err.message, stack: err.stack };
              }
            }`,
            returnByValue: true
          }
        }));
      }
    }
  } else if (response.id === 5) {
    console.log('Server modules dump:', JSON.stringify(response.result.result.value, null, 2));
    ws.close();
  }
});

ws.on('error', (err) => {
  console.error('WebSocket Error:', err);
});
