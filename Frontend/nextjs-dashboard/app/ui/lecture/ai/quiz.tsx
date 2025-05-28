import { useState } from "react";

type QuizItem = {
  question: string;
  options: string[];
  answer: number;
};

export default function Quiz({ quiz }: { quiz: QuizItem[] }) {
  const [selected, setSelected] = useState<(number | null)[]>(Array(quiz.length).fill(null));
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="space-y-6">
      {quiz.map((item, idx) => (
        <div key={idx} className="p-4 border rounded-lg bg-white dark:bg-zinc-900">
          <div className="font-semibold mb-2">{idx + 1}. {item.question}</div>
          <div className="space-y-2">
            {item.options.map((opt, i) => (
              <button
                key={i}
                className={`block w-full text-left px-3 py-2 rounded border
                  ${selected[idx] === i ? "bg-blue-100 border-blue-500" : "border-zinc-200"}
                  hover:bg-blue-50`}
                onClick={() => {
                  const copy = [...selected];
                  copy[idx] = i;
                  setSelected(copy);
                }}
                disabled={showAnswer}
              >
                {opt}
                {showAnswer && i === item.answer && (
                  <span className="ml-2 text-green-600 font-bold">✔</span>
                )}
                {showAnswer && selected[idx] === i && i !== item.answer && (
                  <span className="ml-2 text-red-600 font-bold">✘</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowAnswer(true)}
      >
        查看答案
      </button>
    </div>
  );
}
