"use client";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ResizableDrawer from "./test/page";
import Publish from "./test/publish";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <> 
      <Header />
      {/* <ResizableDrawer
    drawerContent={
      <Publish/>
    }
  > */}
      <div className="flex h-screen overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 flex overflow-hidden relative">
         
            <main className="flex-1 pt-16">{children}</main>
          
        </div>
      </div>
      {/* </ResizableDrawer> */}
    </>
  );
}
