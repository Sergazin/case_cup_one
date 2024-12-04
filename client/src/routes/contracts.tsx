// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import ContractsMain from "@/sections/contracts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts")({
  component: ContractsMain,
});
