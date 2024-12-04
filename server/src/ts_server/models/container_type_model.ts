// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ======================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Mongoose
// ======================================================================================
// ===============================================================
import mongoose from "mongoose";
//=========================== SCHEMA ===========================

export const ContainerTypeSchemaObj = { type: mongoose.Schema.Types.Mixed, required: true, default: { "name": "EURO_1_1"}, enum: ["EURO_1_1", "NAVAL", "BUNKER_8", "CONTAINER_1_0", "SEPTIK_4", "SEPTIK_10", "CLEANING", ] };
