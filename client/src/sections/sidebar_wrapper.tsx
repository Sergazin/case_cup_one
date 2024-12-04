// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import * as React from "react";
import Swal from "sweetalert2";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AuthCubit } from "./auth/auth_cubit";

const menuItems: {
  title: string;
  icon: string;
  url: string | Function;
}[] = [
  { title: "Загруженнось", icon: "bx bx-line-chart", url: "/" },
  { title: "Бронь", icon: "bx bx-calendar", url: "/booking" },
  { title: "Карта", icon: "bx bx-map", url: "/map" },
  { title: "Договора", icon: "bx bx-file", url: "/contracts" },
  { title: "Импорт", icon: "bx bx-import", url: "/import" },
  {
    title: "Выход",
    icon: "bx bx-log-out",
    url: async () => {
      Swal.fire({
        title: "Выход",
        text: "Вы уверены, что хотите выйти?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Да, выйти",
      }).then((result) => {
        if (result.isConfirmed) {
          AuthCubit.logout();
        }
      });
    },
  },
];

export default function SideBarWrapper($: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const nav = useNavigate();
  const route = useRouterState();

  return (
    <div className="flex h-screen w-full">
      <div className="fixed bottom-2 left-2 z-50">
        <SidebarTrigger />
      </div>
      <Sidebar className="w-64 bg-white">
        <SidebarHeader>
          <div className="text-center flex items-center gap-4 justify-center px-4 pt-6">
            <img src="/assets/logo.svg" alt="CaseCapOne" className="w-12 h-12" />
            <div className="flex flex-col items-start leading-none">
              <h2 className="text-2xl font-semibold">CaseCup1</h2>
              <p className="text-gray-500">
                by{" "}
                <a href="https://neodev.kz" target="_blank" className="text-blue-500">
                  NeoDev
                </a>
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-4">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={route.location.pathname === item.url}
                  onClick={() => {
                    if (typeof item.url === "string") {
                      nav({ to: item.url });
                    } else {
                      item.url();
                    }
                    sidebar.setOpenMobile(false);
                  }}
                  className="py-6 text-base px-4 cursor-pointer"
                >
                  <span className="flex items-center gap-4">
                    <i className={item.icon}></i>
                    <span>{item.title}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <main className="flex-1 p-6">
        {/*
                  <SidebarTrigger />
        <div className="h-4"></div>
        */}
        {$.children}
        <div className="h-8"></div>
      </main>
    </div>
  );
}
