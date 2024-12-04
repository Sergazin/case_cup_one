// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const ContractRawSchemaObj = {
    uuid: { type: String, required: true },
organization_uuid: { type: String, required: true },
name: { type: String, required: true },
description: { type: String, required: false },
start_date: { type: Number, required: true },
end_date: { type: Number, required: true },
imported: { type: Boolean, required: true, default: false },
archived: { type: Boolean, required: true, default: false },

};

export const ContractRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const ContractRawSchema = new mongoose.Schema(ContractRawSchemaObj, ContractRawSchemaOptions);

//=========================== MISCS_xxx ===========================

export type ContractRawDoc = mongoose.Document<unknown, any, T.ContractRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const ContractRawModel = mongoose.model<T.ContractRaw>("contract_raw", ContractRawSchema);

