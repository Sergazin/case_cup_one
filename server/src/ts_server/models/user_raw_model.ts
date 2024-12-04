// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const UserRawSchemaObj = {
    uuid: { type: String, required: true },
name: { type: String, required: true },
login: { type: String, required: true },
password_hash: { type: String, required: true },
create_date: { type: Number, required: true },

};

export const UserRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const UserRawSchema = new mongoose.Schema(UserRawSchemaObj, UserRawSchemaOptions);

//=========================== MISCS_xxx ===========================

export type UserRawDoc = mongoose.Document<unknown, any, T.UserRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const UserRawModel = mongoose.model<T.UserRaw>("user_raw", UserRawSchema);

