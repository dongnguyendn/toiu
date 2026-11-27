const WebSocket = require('ws');

const wsUrl = "ws://127.0.0.1:9229/5dff8a2b-b4a5-4f08-9ab5-7d1dfa9aaf13";
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  ws.send(JSON.stringify({
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
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  if (response.id === 1) {
    const objectId = response.result.result.objectId;
    ws.send(JSON.stringify({
      id: 2,
      method: "Runtime.getProperties",
      params: { objectId, ownProperties: true, accessorPropertiesOnly: false }
    }));
  } else if (response.id === 2) {
    const scopesObjectId = response.result.internalProperties.find(p => p.name === '[[Scopes]]').value.objectId;
    ws.send(JSON.stringify({
      id: 3,
      method: "Runtime.getProperties",
      params: { objectId: scopesObjectId, ownProperties: true, accessorPropertiesOnly: false }
    }));
  } else if (response.id === 3) {
    const scope0ObjectId = response.result.result.find(p => p.name === '0').value.objectId;
    ws.send(JSON.stringify({
      id: 4,
      method: "Runtime.getProperties",
      params: { objectId: scope0ObjectId, ownProperties: true, accessorPropertiesOnly: false }
    }));
  } else if (response.id === 4) {
    const serverObjectId = response.result.result.find(v => v.name === 'server').value.objectId;
    
    // Call function on server to inspect `/app/applet/src/api.ts` module
    ws.send(JSON.stringify({
      id: 5,
      method: "Runtime.callFunctionOn",
      params: {
        objectId: serverObjectId,
        functionDeclaration: `function() {
          try {
            const mod = this.moduleGraph.idToModuleMap.get("/app/applet/src/api.ts");
            if (!mod) return "Module not found";
            const keys = Object.keys(mod);
            const transformResultKeys = mod.transformResult ? Object.keys(mod.transformResult) : null;
            return {
              keys,
              transformResultKeys,
              codeSample: mod.transformResult ? mod.transformResult.code.slice(0, 1000) : "no transformResult code",
              originalCodeSample: mod.ssrTransformResult ? mod.ssrTransformResult.code.slice(0, 500) : "no ssrTransformResult code"
            };
          } catch (err) {
            return { error: err.message, stack: err.stack };
          }
        }`,
        returnByValue: true
      }
    }));
  } else if (response.id === 5) {
    console.log('API module inspect result:', JSON.stringify(response.result.result.value, null, 2));
    ws.close();
  }
});
