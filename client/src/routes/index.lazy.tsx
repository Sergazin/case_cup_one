// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import {TrucksCalendar} from "@/sections/trucks_calendar";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: TrucksCalendar,
});
