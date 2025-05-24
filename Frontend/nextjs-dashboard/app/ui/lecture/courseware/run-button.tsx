import React from "react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const RunButton = ({ targetId, onRun }: { targetId: string; onRun: (output: string) => void }) => {
  const handleRun = () => {
    try {
    const code = document.getElementById(targetId)?.innerText || "";
    let output = "";
    const originalLog = console.log;  // 临时重写 console.log
    console.log = (...args) => {
      output += args.map(String).join(" ") + "\n";
      originalLog(...args);
    };
    // eslint-disable-next-line no-eval
    const result = eval(code);
    console.log = originalLog;
    onRun(output ? output.trim() : String(result)); //// 如果有 console.log 输出，优先显示，否则显示返回值
  } catch (e: any) {
    onRun(e?.toString() ?? "Error");
  }
  };

  return (
    <button
      type="button"
      onClick={handleRun}
      className="relative inline-flex rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      aria-label="复制代码"
    >
      <RocketLaunchIcon fontSize="small" />
    </button>
  );
};

export default RunButton;
