// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// =============================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Server API File
// =============================================================================================

import * as T from "./types";
export * from "./types";
export interface API {
    auth_check(auth_claims: AuthClaims,):Promise<T.AuthClaims>;
    add_contract(auth_claims: AuthClaims,body: T.ContractPublic):Promise<T.ContractResolved>;
    archive_site(auth_claims: AuthClaims,contract_uuid: string,):Promise<void>;
    archive_contract(auth_claims: AuthClaims,contract_uuid: string,):Promise<void>;
    add_site(auth_claims: AuthClaims,body: T.SitePublic):Promise<T.SiteResolved>;
    update_site(auth_claims: AuthClaims,site_uuid: string,body: T.SitePublic):Promise<T.SiteResolved>;
    login(body: T.LoginForm):Promise<T.LoginResult>;
    get_all_data(auth_claims: AuthClaims,):Promise<T.AllData>;
    upload(auth_claims: AuthClaims,body: T.UploadRequest):Promise<void>;
}
import JWT from "jsonwebtoken";
export type AuthClaims = { user_uuid: string; groups: string[] };

export function jwt_validate(access_token?: string): AuthClaims {
  if (!access_token) throw "JWT_INVALID";
  if (access_token.includes("Bearer ")) {
    access_token = access_token.split("Bearer ")[1];
  }
  const secret = process.env.JWT_SECRET || "secret";
  try {
    const decoded = JWT.verify(access_token, secret) as AuthClaims;
    return decoded;
  } catch (e) {
    if (e instanceof JWT.TokenExpiredError) {
      console.log({ expiredAt: e.expiredAt, now: new Date() });
      throw "JWT_EXPIRED";
    }
    throw "JWT_INVALID";
  }
}


import express from "express";
export function apply_routes(router: express.Router, api: API) {
     router.get("/auth-check", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      
      res.json(await api.auth_check(auth_header,));
    } catch (e) {
      next(e);
    }
  });

   router.post("/contract", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      
      res.json(await api.add_contract(auth_header,req.body,));
    } catch (e) {
      next(e);
    }
  });

   router.delete("/site/:contract_uuid", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      const {contract_uuid,} = req.params;
      res.json(await api.archive_site(auth_header,contract_uuid,));
    } catch (e) {
      next(e);
    }
  });

   router.delete("/contract/:contract_uuid", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      const {contract_uuid,} = req.params;
      res.json(await api.archive_contract(auth_header,contract_uuid,));
    } catch (e) {
      next(e);
    }
  });

   router.post("/site", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      
      res.json(await api.add_site(auth_header,req.body,));
    } catch (e) {
      next(e);
    }
  });

   router.post("/site/:site_uuid", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      const {site_uuid,} = req.params;
      res.json(await api.update_site(auth_header,site_uuid,req.body,));
    } catch (e) {
      next(e);
    }
  });

   router.post("/login", async (req, res, next) => {
    try {
      
      
      res.json(await api.login(req.body,));
    } catch (e) {
      next(e);
    }
  });

   router.get("/all-data", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      
      res.json(await api.get_all_data(auth_header,));
    } catch (e) {
      next(e);
    }
  });

   router.post("/upload", async (req, res, next) => {
    try {
      
        let auth_header: AuthClaims | undefined;
        try {
          auth_header = jwt_validate(req.headers.authorization);
        } catch (e: any) {
          return next(Error(e));
        }

      
      res.json(await api.upload(auth_header,req.body,));
    } catch (e) {
      next(e);
    }
  });

}
