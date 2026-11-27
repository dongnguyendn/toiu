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

        // Traverse handles
        for (const h of handles) {
          if (h.listeners && h.listeners('request').length > 0) {
            const listeners = h.listeners('request');
            for (const listener of listeners) {
              if (listener && listener._router && listener._router.stack) {
                const stack = listener._router.stack;
                results.push("Found Express Router stack of length " + stack.length);
                
                // Search stack layers for vite
                for (const layer of stack) {
                  if (layer && layer.handle) {
                    results.push("Layer name: " + layer.name + ", handle: " + layer.handle.name);
                    
                    // Try to find viteDevServer or vite in closure/properties
                    // Let's inspect the keys of layer or layer.handle
                    const keys = Object.keys(layer.handle);
                    if (keys.length > 0) {
                      results.push("  Keys: " + keys.join(", "));
                    }
                    
                    // In some implementations, the middleware might have viteDevServer property
                    if (layer.handle.viteDevServer) {
                      foundVite = layer.handle.viteDevServer;
                      results.push("  -> Found viteDevServer directly!");
                    }
                  }
                }
              }
            }
          }
        }
        
        // If not found, let's check require.cache for any module that has a vite instance
        if (!foundVite) {
          for (const key of Object.keys(require.cache)) {
            const mod = require.cache[key];
            if (mod && mod.exports) {
              // check if exports has any property
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
