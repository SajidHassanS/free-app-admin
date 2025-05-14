"use client";
import React, { useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumbs } from "../breadcrumbs";
import { UserNav } from "./user-nav";

export default function Header() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-gray-100">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
          {/* {pathname === "/dashboard/overiew" && (
            <Button
              className="text-gray-700 text-sm md:ml-6 border border-gray-400 bg-transparent shadow-md hover:text-white hover:bg-primary/80"
              type="button"
              id="add_project"
              size="sm"
              // onClick={handleAddProject}
            >
              Add Project
            </Button>
          )} */}
        </div>
        <div className="flex items-center gap-3 px-4">
          <UserNav />
        </div>
      </header>
    </>
  );
}
