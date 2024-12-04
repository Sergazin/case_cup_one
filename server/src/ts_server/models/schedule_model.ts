// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const ScheduleSchemaObj = { type: mongoose.Schema.Types.Mixed, required: true, default: { "name": "WEEKLY"}, enum: ["WEEKLY", ] };
