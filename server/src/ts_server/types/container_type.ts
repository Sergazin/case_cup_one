// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
// ===============================================================
export enum ContainerTypeEnum { Euro11 = "EURO_1_1",Naval = "NAVAL",Bunker8 = "BUNKER_8",Container10 = "CONTAINER_1_0",Septik4 = "SEPTIK_4",Septik10 = "SEPTIK_10",Cleaning = "CLEANING", }

export type ContainerTypeEuro11 = { name: ContainerTypeEnum.Euro11;
 };
export type ContainerTypeNaval = { name: ContainerTypeEnum.Naval;
 };
export type ContainerTypeBunker8 = { name: ContainerTypeEnum.Bunker8;
 };
export type ContainerTypeContainer10 = { name: ContainerTypeEnum.Container10;
 };
export type ContainerTypeSeptik4 = { name: ContainerTypeEnum.Septik4;
 };
export type ContainerTypeSeptik10 = { name: ContainerTypeEnum.Septik10;
 };
export type ContainerTypeCleaning = { name: ContainerTypeEnum.Cleaning;
 };

export type ContainerType = | ContainerTypeEuro11| ContainerTypeNaval| ContainerTypeBunker8| ContainerTypeContainer10| ContainerTypeSeptik4| ContainerTypeSeptik10| ContainerTypeCleaning
