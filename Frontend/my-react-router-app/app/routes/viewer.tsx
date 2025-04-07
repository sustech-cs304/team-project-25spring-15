import type { Route } from "./+types/viewer";
import { Box, Typography } from "@mui/material";

export async function loader({ params }: Route.LoaderArgs) {
  const courseId = params.courseId;
  const lectureId = params.lectureId;
  
  return { courseId, lectureId };
}

export default function Viewer({
  loaderData
}: Route.ComponentProps){

  return (
    <Box sx={{ flexGrow: 1, p: 3, height: 'calc(100vh - 64px)' }}>
      <Typography variant="h6" gutterBottom>
        文档预览
      </Typography>
      {(
        <Box
          sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              color: 'text.secondary',
          }}
        >
          文档加载成功！
        </Box>
      )}
    </Box>
);
}
