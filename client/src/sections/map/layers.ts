import L from "leaflet";

export function map_layers(): L.Layer[] {
  return [
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }),
  ];
}
