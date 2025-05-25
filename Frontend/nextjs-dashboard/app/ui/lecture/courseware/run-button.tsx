import React from "react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { CodeAPI } from "@/app/lib/client-api";

const RunButton = ({ targetId, onRun, language }: { targetId: string; onRun: (output: string) => void; language: string}) => {
  const handleRun = async (lang: string) => {
    try {
      const code = document.getElementById(targetId)?.innerText || "";
      if (lang === 'js' || lang === 'javascript') {
        let output = "";
        const originalLog = console.log;  // 临时重写 console.log
        console.log = (...args) => {
          output += args.map(String).join(" ") + "\n";
          originalLog(...args);
        };
        // eslint-disable-next-line no-eval
        const result = eval(code);
        console.log = originalLog;
        onRun(output ? output.trim() : String(result));
      } else if (lang === 'C' || lang === 'c' || lang === 'python') {
        const result = await CodeAPI.runCode(code, lang);
        onRun(result);
      } else {
        onRun(`Language ${lang} is not supported`);
      }
    } catch (e: any) {
      onRun(e?.toString() ?? "Error");
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleRun(language)}
      className="relative inline-flex rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      aria-label="复制代码"
    >
      <RocketLaunchIcon fontSize="small" />
    </button>
  );
};

export default RunButton;
