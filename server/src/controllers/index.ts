import * as T from "../ts_server";

import { auth_check, login } from "./auth";
import { add_contract, add_site, archive_contract, archive_site, get_all_data, update_site } from "./data";
import {upload} from "./upload";

export class Controller implements T.API {
  upload = upload;
  archive_site = archive_site;
  add_contract = add_contract;
  add_site = add_site;
  login = login;
  auth_check = auth_check;
  get_all_data = get_all_data;
  update_site = update_site;
  archive_contract = archive_contract;
}
