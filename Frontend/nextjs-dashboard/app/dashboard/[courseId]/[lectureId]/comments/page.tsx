import { Room } from "@/app/ui/collab/room";
import CollabEditor from "@/app/ui/collab/collab-editor";
import CommentView from "@/app/ui/lecture/comment-view";

export default function Page() {
  return (
    <main>
      <Room>
        <CollabEditor/>
      </Room>
    </main>
  );
}
