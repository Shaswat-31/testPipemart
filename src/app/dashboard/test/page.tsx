// "use client";

// import React, { useState, useEffect, ReactNode } from "react";
// import { cn } from "@/lib/utils"; // ShadCN's utility function for conditional class names

// type ResizableDrawerProps = {
//   children: ReactNode; // Main content to display next to the drawer
//   drawerContent: ReactNode; // Content to display inside the drawer
// };

// export default function ResizableDrawer({
//   children,
//   drawerContent,
// }: ResizableDrawerProps) {
//   const [drawerWidth, setDrawerWidth] = useState(300); // Initial width of the drawer
//   const [isResizing, setIsResizing] = useState(false);

//   // Handle mouse down on the resize handle
//   const handleMouseDown = () => {
//     setIsResizing(true);
//     document.body.classList.add("no-select"); // Prevent text selection while resizing
//   };

//   // Handle mouse move for resizing
//   const handleMouseMove = (e: globalThis.MouseEvent) => {
//     if (isResizing) {
//       setDrawerWidth((prev) => Math.max(200, prev + e.movementX)); // Minimum width of 200px
//     }
//   };

//   // Handle mouse up to stop resizing
//   const handleMouseUp = () => {
//     setIsResizing(false);
//     document.body.classList.remove("no-select");
//   };

//   // Attach and detach mouse events
//   useEffect(() => {
//     if (isResizing) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     } else {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizing]);

//   return (
//     <div className="flex h-screen relative">
//     {/* Drawer */}
//     <div
//       className={cn("h-full relative shadow-lg border-r border-gray-200")}
//       style={{ width: `${drawerWidth}px`, zIndex: 20 }} // Increased z-index for drawer
//     >
//       <div className="p-4">{children}</div>
//       {/* Resize Handle */}
//       <div
//         role="separator"
//         aria-label="Resize Drawer"
//         className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-900 hover:bg-gray-800 z-30 mt-14"
//         onMouseDown={handleMouseDown}
//       ></div>
//     </div>
  
//     {/* Main Content */}
//     <div className="flex-1 relative z-10 mt-12 p-8">{drawerContent}</div>
//   </div>
  
  
//   );
// }
import React from 'react'

function page() {
  return (
    <div>
      
    </div>
  )
}

export default page
