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

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log('Received response:', response.id);
  
  if (response.id === 1) {
    const objectId = response.result.result.objectId;
    console.log('Function objectId:', objectId);
    
    // 2. Call Runtime.getProperties
    const getPropsMsg = {
      id: 2,
      method: "Runtime.getProperties",
      params: {
        objectId: objectId,
        ownProperties: true,
        accessorPropertiesOnly: false,
        generatePreview: false
      }
    };
    ws.send(JSON.stringify(getPropsMsg));
  } else if (response.id === 2) {
    console.log('Properties:', JSON.stringify(response.result, null, 2));
    ws.close();
  }
});

ws.on('error', (err) => {
  console.error('WebSocket Error:', err);
});
