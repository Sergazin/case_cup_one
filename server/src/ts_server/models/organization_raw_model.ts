// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const OrganizationRawSchemaObj = {
    uuid: { type: String, required: true },
name: { type: String, required: true },
iin: { type: String, required: true },
imported: { type: Boolean, required: true, default: false },

};

export const OrganizationRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const OrganizationRawSchema = new mongoose.Schema(OrganizationRawSchemaObj, OrganizationRawSchemaOptions);

//=========================== MISCS_xxx ===========================

export type OrganizationRawDoc = mongoose.Document<unknown, any, T.OrganizationRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const OrganizationRawModel = mongoose.model<T.OrganizationRaw>("organization_raw", OrganizationRawSchema);

