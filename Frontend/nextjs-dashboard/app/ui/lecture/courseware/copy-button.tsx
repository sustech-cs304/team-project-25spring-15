import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";

const CopyButton = ({ targetId }: { targetId: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      const text = document.getElementById(targetId)?.innerText || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="relative inline-flex rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      aria-label="复制代码"
    >
      <ContentCopyIcon
        fontSize="small"
        className={`transition-all ${copied ? "scale-0" : "scale-100"}`}
      />
      <CheckIcon
        fontSize="small"
        className={`absolute transition-all ${copied ? "scale-100" : "scale-0"}`}
      />
    </button>
  );
};

export default CopyButton;
