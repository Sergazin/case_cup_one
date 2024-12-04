import { useStore } from "@nanostores/react";
import React, { useMemo } from "react";
import { useMap } from "react-leaflet";
import { calculate_center_and_zoom } from "./center_of_coords";
import { RepoCubit } from "@/repo";

const DetermineCurrentUserGeolocation: React.FC = () => {
  const repo = useStore(RepoCubit.state);
  const map = useMap();
  useMemo(() => {
    // Default coords (Dubai)
    const default_coords = { lat: 25.276987, lng: 55.296249 };
    map.setView(default_coords, 13);

    // At first calculate center and zoom for all objects
    const all_objects_coords = repo.sites.map((a) => [a.latitude, a.longitude] as [number, number]);
    if (all_objects_coords.length > 0) {
      const { center, zoom } = calculate_center_and_zoom(all_objects_coords, 800, 600);
      map.setView(center, Math.min(zoom, 13), { duration: 0, animate: false });
      /*
      setTimeout(() => {
      }, 500);
        * **/
    } else {
      // Web API for get current user location
      navigator.geolocation.getCurrentPosition((position) => {
        map.setView([position.coords.latitude, position.coords.longitude], 13);
      });
    }
  }, [repo]);

  return null;
};

export default DetermineCurrentUserGeolocation;
