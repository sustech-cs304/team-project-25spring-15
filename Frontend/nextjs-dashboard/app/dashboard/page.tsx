import TiptapWrapper from "@/app/ui/collab/tiptap-wrapper";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <TiptapWrapper user={session?.user}/>
    </main>
  );
}
