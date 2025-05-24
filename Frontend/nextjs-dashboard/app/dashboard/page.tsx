import TiptapWrapper from "@/app/ui/collab/tiptap-wrapper";
import { auth } from "@/auth";
import MarkdownWithRunner from "@/app/ui/lecture/courseware/markdown-with-runner";

const codestring = `
### Here is some JavaScript code:

~~~js test.ts
console.log('It works!')
~~~
`

export default async function Page() {
  return (
    <div>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard
        {/* TODO: make this prettier */}
      </h1>
      <div>
        <MarkdownWithRunner content={codestring} />
      </div>
    </div>
  );
}
