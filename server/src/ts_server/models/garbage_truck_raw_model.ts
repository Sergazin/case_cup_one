// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import * as T from "../types";
import * as M from ".";

import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const GarbageTruckRawSchemaObj = {
    uuid: { type: String, required: true },
name: { type: String, required: false },
description: { type: String, required: false },
plate_no: { type: String, required: true },
max_load_per_trip: { type: Number, required: true },
max_trip_per_day: { type: Number, required: true },
imported: { type: Boolean, required: true, default: false },

};

export const GarbageTruckRawSchemaOptions = {
  versionKey: false,
  minimize: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

export const GarbageTruckRawSchema = new mongoose.Schema(GarbageTruckRawSchemaObj, GarbageTruckRawSchemaOptions);

//=========================== MISCS_xxx ===========================

export type GarbageTruckRawDoc = mongoose.Document<unknown, any, T.GarbageTruckRaw> &
  Required<{ _id: mongoose.Types.ObjectId | string }>;

export const GarbageTruckRawModel = mongoose.model<T.GarbageTruckRaw>("garbage_truck_raw", GarbageTruckRawSchema);

