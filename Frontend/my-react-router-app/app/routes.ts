import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

// 管理页面布局以及路由
export default [
  layout("layouts/sidebar.tsx", [
    index("routes/home.tsx"),
    // route("courses/:courseId", "routes/courses.tsx")
  ]),
  // route("routes/contacts/[id].tsx", ),
] satisfies RouteConfig;
