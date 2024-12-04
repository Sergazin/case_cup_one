// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const SiteRawSchemaObj = {
    uuid: { type: String, required: true },
organization_uuid: { type: String, required: true },
contract_uuid: { type: String, required: true },
truck_uuid: { type: String, required: true },
schedule: M.ScheduleSchemaObj,
name: { type: String, required: true },
description: { type: String, required: false },
latitude: { type: Number, required: true },
longitude: { type: Number, required: true },
container_on_site: { type: [mongoose.Schema.Types.Mixed], required: true },
imported: { type: Boolean, required: true, default: false },
archived: { type: Boolean, required: true, default: false },

};

export const SiteRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const SiteRawSchema = new mongoose.Schema(SiteRawSchemaObj, SiteRawSchemaOptions);

//=========================== MISCS_xxx ===========================

export type SiteRawDoc = mongoose.Document<unknown, any, T.SiteRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const SiteRawModel = mongoose.model<T.SiteRaw>("site_raw", SiteRawSchema);

