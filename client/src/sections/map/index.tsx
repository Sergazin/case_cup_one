import React, { useMemo } from "react";
import { MapContainer, useMap, ZoomControl } from "react-leaflet";
import { useStore } from "@nanostores/react";
import L from "leaflet";
import { RepoCubit } from "@/repo";
import { map_layers } from "./layers";
import DetermineCurrentUserGeolocation from "./determine";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import HelpCard from "@/components/help_card";

const MapController: React.FC = () => {
  const repo = useStore(RepoCubit.state);
  const map = useMap();

  const icon_size = 40;
  const icon_props: L.IconOptions = {
    iconUrl: "",
    iconSize: [icon_size, icon_size], // size of the icon
    iconAnchor: [icon_size / 2, icon_size], // point of the icon which will correspond to marker's location
  };

  useMemo(() => {
    const group = L.markerClusterGroup();
    repo.sites.map((site) => {
      group.addLayer(
        L.marker([site.latitude, site.longitude], {
          icon: L.icon({
            ...icon_props,
            iconUrl: "/assets/location_marker.png",
          }),
          zIndexOffset: 1,
        }).on("click", () => {
          console.log("site", site);
        }),
      );
    });
    map.addLayer(group);
  }, [repo]);

  return <> </>;
};

export const MainMap: React.FC<{
  className?: string;
}> = ($) => {
  //const repo = useStore(RepoCubit.state);
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="h-5/6">
        <MapContainer
          className={"rounded-xl h-full w-full z-10 " + $.className}
          zoomControl={false}
          layers={map_layers()}
          minZoom={12}
        >
          <ZoomControl position="bottomleft" />
          <MapController />
          <DetermineCurrentUserGeolocation />
          <div className="w-full h-full" id="map-controls-container"></div>
        </MapContainer>
      </div>
      <div className="h-1/6">
        <div className="helpers flex gap-4 pb-6">
          <HelpCard
            title="Неточность местоположения"
            text="Данные которые вы выгружаете из ИС не точны, координаты округляются до 2 знаков после запятой, что приводит к тому что на карте они отображаются не точно. Исправить это можно только в ИС."
          />
        </div>
      </div>
    </div>
  );
};
