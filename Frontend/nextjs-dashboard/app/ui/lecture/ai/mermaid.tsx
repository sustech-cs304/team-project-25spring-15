'use client';

import { useEffect, useId, useRef } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      mermaid.initialize({ startOnLoad: false });
      // 新写法：render 返回 Promise<{svg, bindFunctions}>
      mermaid.render(id, code).then(({ svg }) => {
        ref.current!.innerHTML = svg;
      });
    }
  }, [code, id]);

  return <div ref={ref} />;
}
