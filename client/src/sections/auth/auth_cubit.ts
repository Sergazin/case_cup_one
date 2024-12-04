// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import { api } from "@/api";
import { AuthClaims } from "@/ts_client";
import axios from "axios";
import * as nanostores from "nanostores";

type AuthState = {
  login: string;
  password: string;
  status: AuthStatus;
  errors: string[];
  loading: boolean;
  user_uuid: string;
};

export enum AuthStatus {
  INITED,
  LOADING,
  AUTHORIZED,
  NOT_AUTHORIZED,
  ERROR,
}

const state = nanostores.map<AuthState>({
  user_uuid: "",
  login: "admin",
  password: "1",
  status: AuthStatus.INITED,
  errors: [],
  loading: false,
});

const on_auth_callbacks: Function[] = [];

export class AuthCubit {
  static get state() {
    return state;
  }

  static async init() {
    let auth_token = localStorage.getItem("auth_token");
    if (auth_token) axios.defaults.headers.common["Authorization"] = `Bearer ${auth_token}`;

    state.setKey("status", AuthStatus.LOADING);

    try {
      const claims = await api.auth_check();
      this.auth_success(claims);
    } catch (e: any) {
      state.setKey("errors", [e.response.data.message]);
      state.setKey("status", AuthStatus.NOT_AUTHORIZED);
    }
  }

  static is_authorized() {
    return state.get().status === AuthStatus.AUTHORIZED;
  }

  static on_auth(callback: Function) {
    on_auth_callbacks.push(callback);
  }

  static set_login(login: string) {
    state.setKey("login", login);
  }

  static set_password(password: string) {
    state.setKey("password", password);
  }

  static reset() {
    state.setKey("login", "");
    state.setKey("password", "");
  }

  static async login() {
    const { login, password } = state.get();
    state.setKey("loading", true);
    try {
      let { token, claims } = await api.login({ login, password });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("auth_token", token);
      this.auth_success(claims);
    } catch (e: any) {
      console.log(e);
      state.setKey("errors", [e.response.data.message]);
    } finally {
      state.setKey("loading", false);
    }
  }

  static async logout() {
    localStorage.removeItem("auth_token");
    delete axios.defaults.headers.common["Authorization"];
    state.setKey("status", AuthStatus.NOT_AUTHORIZED);
  }

  static auth_success(claims: AuthClaims) {
    state.setKey("user_uuid", claims.user_uuid);
    state.setKey("status", AuthStatus.AUTHORIZED);
    on_auth_callbacks.forEach((cb) => cb());
  }
}
