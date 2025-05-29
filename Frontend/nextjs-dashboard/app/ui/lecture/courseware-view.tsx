'use client';

import { useState } from "react";
import PdfView from "./courseware/pdf-view";
import Markdunner from "./courseware/markdunner-view";

type CoursewareViewProps = {
  courseId: string;
  lectureId: string;
};

export default function CoursewareView({ courseId, lectureId }: CoursewareViewProps) {
  const [showPdf, setShowPdf] = useState(true);

  return (
    <main>
      <nav className="top-0 left-0 w-full bg-white dark:bg-zinc-900 z-50 flex justify-center py-2 gap-4">
        <a
          href="#pdf"
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            showPdf ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200"
          }`}
          onClick={e => {
            e.preventDefault();
            setShowPdf(true);
          }}
        >
          PDF
        </a>
        <a
          href="#markdown"
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            !showPdf ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200"
          }`}
          onClick={e => {
            e.preventDefault();
            setShowPdf(false);
          }}
        >
          Notes
        </a>
      </nav>
      <div className="pt-4">
          {showPdf ? (
            <PdfView courseId={courseId} lectureId={lectureId} />
          ) : (
            <Markdunner courseId={courseId} lectureId={lectureId} />
          )}
      </div>
    </main>
  );
}
