// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCubit } from "./auth_cubit";
import { useStore } from "@nanostores/react";

export default function AuthPage() {
  const state = useStore(AuthCubit.state);

  return (
    <div className="flex h-screen bg-white">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <img src="/assets/logo.svg" alt="CaseCapOne" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl  mb-6 text-center text-gray-500">
            Добро пожаловать в <div className="text-blue-700 font-bold">CaseCapOne</div>
          </h1>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-blue-700">
                Логин
              </Label>
              <Input
                id="login"
                type="login"
                placeholder="Введите ваш логин"
                defaultValue={state.login}
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                onInput={(e) => AuthCubit.set_login(e.currentTarget.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-700">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите ваш пароль"
                defaultValue={state.password}
                onInput={(e) => AuthCubit.set_password(e.currentTarget.value)}
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                AuthCubit.login();
              }}
            >
              {state.loading ? (
                <>
                  <i className="bx bx-spin bx-loader-circle"></i>&nbsp;Подождите...
                </>
              ) : (
                <>
                  <i className="bx bx-log-in"></i>&nbsp;Войти
                </>
              )}
            </Button>
            {state.errors.map((e, i) => (
              <div key={i} className="text-red-500">
                {e}
              </div>
            ))}
            <div className="flex gap-1">
              {false &&
                [
                  "admin",
                  //"agent"
                ].map((role) => (
                  <Button
                    key={role}
                    onClick={() => {
                      AuthCubit.set_login(role);
                      AuthCubit.set_password("1");
                      AuthCubit.login();
                    }}
                  >
                    Как {role}
                  </Button>
                ))}
            </div>
          </form>
        </div>
      </div>
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img src="/assets/backgrounds/auth.png" alt="Login visual" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}
