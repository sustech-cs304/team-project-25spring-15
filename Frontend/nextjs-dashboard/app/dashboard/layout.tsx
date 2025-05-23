import { Suspense } from "react";
import Topbar from "../ui/dashboard/topbar";
import SideNav from "@/app/ui/dashboard/sidenav";
import NoteSidebar from "@/app/ui/note/NoteSideBar";
import { auth } from "@/auth";
import ClientSessionSync from "@/app/ui/ClientSessionSync";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("用户身份信息：", session);

  return (
    <div className="flex flex-col h-screen">
      <ClientSessionSync user={session?.user ?? null} />
      <Topbar user={session?.user} />
      <div className="flex flex-1 pt-16 md:pt-16">
        <div className="w-full flex-none md:w-64 border-r-4 border-gray-300">
          <SideNav />
        </div>
        <div className="flex-grow p-4 md:overflow-y-auto border-r-2 md:p-6 bg-gray-100">
          <Suspense fallback={<div>加载中...</div>}>
            {children}
          </Suspense>
          <NoteSidebar />
        </div>
      </div>
    </div>
  );
}
