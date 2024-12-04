import { BookingMain } from "@/sections/booking";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking")({
  component: BookingMain,
});
