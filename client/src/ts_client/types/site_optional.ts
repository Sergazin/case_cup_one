// ⚠️ WARNING: CODEGENERATION! DON'T CHANGE THIS FILE
// ==================================================================================
// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved. TS Type
// ==================================================================================
import type { Schedule } from '../types/schedule';
import type { ContainerOnSite } from '../types/container_on_site';
// ===============================================================
export type SiteOptional = { uuid?: string;
organization_uuid?: string;
contract_uuid?: string;
truck_uuid?: string;
schedule?: Schedule;
name?: string;
description?: string;
latitude?: number;
longitude?: number;
container_on_site?: ContainerOnSite[];
imported?: boolean;
archived?: boolean;
 };
