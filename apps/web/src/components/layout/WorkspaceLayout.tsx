import React from "react";
import { Outlet } from "react-router-dom";
import WorkspaceSidebar from "./WorkspaceSidebar";

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen bg-[#0F0F11] text-white overflow-hidden">
      <WorkspaceSidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
