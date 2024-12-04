
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import password_hash from "password-hash";
import JWT from "jsonwebtoken";
import { v4 } from "uuid";
import * as T from "../ts_server";
import * as M from "../ts_server/models";
import { AppError } from "../errors";

export function jwt_sign(claims: T.AuthClaims): string {
  const secret = process.env.JWT_SECRET || "secret";
  return JWT.sign(claims, secret, { expiresIn: "30d" });
}
export async function login(body: T.LoginForm): Promise<T.LoginResult> {
  const found = await M.UserRawModel.findOne({ login: body.login, deleted: false });

  if (body.login == "admin" && !found) {
    // FIRST ADMIN SIGNIN! CREATE IT
    const uuid = v4();
    const admin: T.UserRaw = {
      uuid,
      name: "Super Admin",
      login: "admin",
      password_hash: password_hash.generate("1"),
      create_date: Date.now(),
    };

    await M.UserRawModel.create(admin);
    return {
      token: jwt_sign({ user_uuid: admin.uuid, groups: [] }),
      claims: { user_uuid: admin.uuid, groups: [] },
    };
  }

  if (!found) throw AppError.USER_NOT_FOUND;
  if (!password_hash.verify(body.password, found.password_hash)) throw AppError.PASSWORD_MISMATCH;
  const claims = { user_uuid: found.uuid, groups: [] };
  return { token: jwt_sign(claims), claims };
}
export async function auth_check(auth_claims: T.AuthClaims): Promise<T.AuthClaims> {
  console.log("Auth check from: ", auth_claims.user_uuid);
  return auth_claims;
}
