// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// =============================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Client API File
// =============================================================================================
import * as T from "./types";
export * from "./types";
import type { AxiosInstance } from "axios";

export class API {
  axios_client: AxiosInstance;
  sub_path: string;

  constructor(axios_client: AxiosInstance, sub_path = "") {
    this.sub_path = sub_path;
    this.axios_client = axios_client;
  }

async auth_check():Promise<T.AuthClaims>{ let resp = await this.axios_client.get<T.AuthClaims>(`${this.sub_path}/auth-check`);
return resp.data; }
async add_contract(body: T.ContractPublic):Promise<T.ContractResolved>{ let resp = await this.axios_client.post<T.ContractResolved>(`${this.sub_path}/contract`, body);
return resp.data; }
async archive_site(contract_uuid: string,):Promise<void>{ let resp = await this.axios_client.delete<void>(`${this.sub_path}/site/${contract_uuid}`);
return resp.data; }
async archive_contract(contract_uuid: string,):Promise<void>{ let resp = await this.axios_client.delete<void>(`${this.sub_path}/contract/${contract_uuid}`);
return resp.data; }
async add_site(body: T.SitePublic):Promise<T.SiteResolved>{ let resp = await this.axios_client.post<T.SiteResolved>(`${this.sub_path}/site`, body);
return resp.data; }
async update_site(site_uuid: string,body: T.SitePublic):Promise<T.SiteResolved>{ let resp = await this.axios_client.post<T.SiteResolved>(`${this.sub_path}/site/${site_uuid}`, body);
return resp.data; }
async login(body: T.LoginForm):Promise<T.LoginResult>{ let resp = await this.axios_client.post<T.LoginResult>(`${this.sub_path}/login`, body);
return resp.data; }
async get_all_data():Promise<T.AllData>{ let resp = await this.axios_client.get<T.AllData>(`${this.sub_path}/all-data`);
return resp.data; }
async upload(body: T.UploadRequest):Promise<void>{ let resp = await this.axios_client.post<void>(`${this.sub_path}/upload`, body);
return resp.data; }
}