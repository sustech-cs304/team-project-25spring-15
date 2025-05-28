import CodeIDE from "../ui/note/CodeIDE";

export default async function Page() {
  return (
    <div>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard
        {/* TODO: make this prettier */}
      </h1>
      <CodeIDE />
    </div>
  );
}
