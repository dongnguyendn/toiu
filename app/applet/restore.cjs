const WebSocket = require('ws');

const wsUrl = "ws://127.0.0.1:9229/5dff8a2b-b4a5-4f08-9ab5-7d1dfa9aaf13";
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('Connected to debugger');
  
  // Evaluate code to find Vite and dump module graph
  const codeToEvaluate = `
    (() => {
      try {
        const handles = process._getActiveHandles();
        const results = [];
        let foundVite = null;

        // Search stack layers for vite
        for (const h of handles) {
          // Check if h is an Express Server or has request listeners
          if (h && h.listeners && typeof h.listeners === 'function') {
            const listeners = h.listeners('request');
            for (const listener of listeners) {
              if (listener && listener._router && listener._router.stack) {
                const stack = listener._router.stack;
                results.push("Found Express Router stack of length " + stack.length);
                
                for (const layer of stack) {
                  if (layer && layer.handle) {
                    results.push("Layer name: " + (layer.name || 'anonymous') + ", handle: " + (layer.handle.name || 'anonymous'));
                    
                    // Vite's middlewares typically have properties or we can check the keys of the handle
                    const handleKeys = Object.keys(layer.handle);
                    if (handleKeys.includes('viteDevServer') || layer.handle.viteDevServer) {
                      foundVite = layer.handle.viteDevServer || layer.handle;
                      results.push("  -> Found viteDevServer inside layer.handle!");
                    } else if (layer.handle.name === 'vite' || layer.name === 'vite') {
                      // Let's try to search the properties or function source of the handle to find Vite server
                      results.push("  -> Found layer with name 'vite'!");
                    }
                  }
                }
              }
            }
          }
        }

        return { results, found: !!foundVite };
      } catch (err) {
        return { error: err.message, stack: err.stack };
      }
    })()
  `;

  const message = {
    id: 1,
    method: "Runtime.evaluate",
    params: {
      expression: codeToEvaluate,
      returnByValue: true
    }
  };

  ws.send(JSON.stringify(message));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log('Debugger Response:', JSON.stringify(response, null, 2));
  ws.close();
});

ws.on('error', (err) => {
  console.error('WebSocket Error:', err);
});
