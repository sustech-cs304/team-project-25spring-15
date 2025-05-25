import TiptapWrapper from "@/app/ui/collab/tiptap-wrapper";
import { auth } from "@/auth";
import MarkdownWithRunner from "@/app/ui/lecture/courseware/markdown-with-runner";
import { mocked_markdown_example } from "../lib/mocked-data";

const codestring = `
### Example

Here is a piece of JavaScript code:

~~~js test.ts
console.log('It works!');
const name = 'hello';
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
        <MarkdownWithRunner content={mocked_markdown_example} />
      </div>
    </div>
  );
}
