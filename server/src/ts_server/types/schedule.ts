// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
// ===============================================================
export enum ScheduleEnum { Weekly = "WEEKLY", }

export type ScheduleWeekly = { monday: boolean;
tuesday: boolean;
wednesday: boolean;
thursday: boolean;
friday: boolean;
saturday: boolean;
sunday: boolean;
name: ScheduleEnum.Weekly;
 };

export type Schedule = | ScheduleWeekly
