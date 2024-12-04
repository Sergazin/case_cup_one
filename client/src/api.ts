
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import axios from "axios";
import { API } from "./ts_client";

axios.defaults.baseURL = "/api";
export const api = new API(axios);
