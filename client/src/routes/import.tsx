import { ImportScreen } from "@/sections/import";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/import")({
  component: ImportScreen,
});
