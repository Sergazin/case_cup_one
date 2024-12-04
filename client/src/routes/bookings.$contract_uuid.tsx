import BookingList from "@/sections/booking/booking";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings/$contract_uuid")({
  component: BookingList,
});
