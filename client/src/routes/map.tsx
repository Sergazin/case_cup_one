import { MainMap } from "@/sections/map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/map")({
  component: MainMap,
});
