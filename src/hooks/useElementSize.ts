import { useState, useEffect, useRef } from "react";
export function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    setSize({
      width: element.clientWidth || element.offsetWidth || 0,
      height: element.clientHeight || element.offsetHeight || 0
    });
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return [ref, size] as const;
}
