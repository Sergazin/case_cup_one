// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import SideBarWrapper from "@/sections/sidebar_wrapper";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useStore } from "@nanostores/react";
import { AuthCubit, AuthStatus } from "@/sections/auth/auth_cubit";
import AuthPage from "@/sections/auth";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createRootRoute({
  component: () => {
    const auth_state = useStore(AuthCubit.state);

    switch (auth_state.status) {
      case AuthStatus.INITED:
        return <div>.</div>;
      case AuthStatus.LOADING:
        return (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2">
            <img src="/assets/logo.svg" alt="logo" className="w-32 h-32" />
            <div className="text-center flex  items-center gap-2 top-8">
              <i className="bx bx-loader bx-spin text-2xl text-gray-500"></i>
              Загрузка...
            </div>
          </div>
        );
      case AuthStatus.NOT_AUTHORIZED:
        return <AuthPage />;
      case AuthStatus.AUTHORIZED:
        return (
          <>
            <SidebarProvider>
              <SideBarWrapper>
                <Outlet />
              </SideBarWrapper>
            </SidebarProvider>
          </>
        );
    }
  },
});
