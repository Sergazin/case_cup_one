"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ContainerType,
  ContainerTypeEnum,
  ContractResolved,
  GeoCoords,
  SitePublic,
  SiteResolved,
} from "@/ts_client";
import { useStore } from "@nanostores/react";
import { RepoCubit } from "@/repo";
import { useNavigate } from "@tanstack/react-router";

const container_types: ContainerType[] = [
  { name: ContainerTypeEnum.Bunker8 },
  { name: ContainerTypeEnum.Cleaning },
  { name: ContainerTypeEnum.Container10 },
  { name: ContainerTypeEnum.Euro11 },
  { name: ContainerTypeEnum.Naval },
  { name: ContainerTypeEnum.Septik10 },
  { name: ContainerTypeEnum.Septik4 },
];

export default function SiteForm({ init_data }: { init_data: SitePublic & { uuid?: string } }) {
  const repo = useStore(RepoCubit.state);
  const nav = useNavigate();

  const [site, setSite] = useState<SitePublic & { uuid?: string }>(init_data);

  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSite((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (day: keyof typeof site.schedule) => {
    setSite((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [day]: !prev.schedule[day] },
    }));
  };

  const [containers, setContainers] = useState(
    container_types.map((container_type) => ({
      container_type,
      quantity: site.container_on_site.find((c) => c.container_type.name === container_type.name)?.quantity || 0,
    })),
  );

  const handleQuantityChange = (index: number, change: number) => {
    const newContainers = [...containers];
    newContainers[index].quantity = Math.max(0, newContainers[index].quantity + change);
    setContainers(newContainers);
    setSite({ ...site, container_on_site: newContainers.filter((c) => c.quantity > 0) });
  };

  const save = async () => {
    if (site.uuid) {
      await RepoCubit.update_site(site.uuid, site);
    } else {
      await RepoCubit.create_site(site);
    }
    Swal.fire("Успешно", "Площадка успешно сохранена", "success");
    nav({ to: "/bookings/$contract_uuid", params: { contract_uuid: site.contract_uuid } });
  };

  const contract = repo.contracts.find((c) => c.uuid === site.contract_uuid);

  if (!contract) return <div>Договор не найден</div>;
  const truck = repo.garbage_trucks.find((v) => v.uuid === site.truck_uuid) || {
    max_trip_per_day: 0,
    max_load_per_trip: 0,
  };
  const max_truck_load_per_day = truck.max_trip_per_day * truck.max_load_per_trip;
  const truck_week_load: number[] = get_truck_week_load(site.truck_uuid, contract, repo.sites);

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex gap-4 items-center mb-4">
          <Button
            className="bg-red-500 text-white"
            onClick={() => nav({ to: "/bookings/$contract_uuid", params: { contract_uuid: contract.uuid } })}
          >
            <i className="bx bx-x"></i>
          </Button>
          {contract.name}
        </div>
        <div className="text-2xl font-bold">{init_data ? "Редактировать площадку" : "Создать новую площадку"}</div>
        <p className="text-sm text-muted-foreground">Шаг {currentStep} из 3</p>
      </div>
      <div>
        <div className="space-y-4">
          {currentStep === 1 && (
            <div className="flex gap-8">
              <div className="space-y-4 w-1/3 rounded-xl border p-6">
                <div className="gap-4 flex flex-col">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Название (обязательно)
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={site.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Название площадки"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Описание
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={site.description || ""}
                    onChange={handleInputChange}
                    placeholder="Описание площадки"
                    rows={6}
                  />
                </div>
                {(site.latitude === 0 && site.longitude === 0 && (
                  <p className="text-red-500">Укажите координаты на карте</p>
                )) || <p className="text-green-500">Координаты указаны</p>}

                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full"
                  disabled={site.name.length === 0 || site.latitude === 0 || site.longitude === 0}
                >
                  Далее
                </Button>
              </div>
              <div className="w-2/3">
                <MapPicker
                  className="h-96"
                  default_center={{ lat: 47.05, lng: 51.9 }}
                  coords={{ lat: site.latitude, lng: site.longitude }}
                  onChange={(v) => setSite((prev) => ({ ...prev, latitude: v.lat, longitude: v.lng }))}
                />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <>
              <div className="border rounded-xl p-4 max-w-md mx-auto">
                <label className="block text-xl font-medium mb-2 border-b pb-4">Контейнеры на площадке</label>
                {containers.map((container, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2 border-b pb-2">
                    <span className="w-[200px]">{container_type_to_string(container.container_type.name)}</span>
                    <Button
                      type="button"
                      onClick={() => handleQuantityChange(index, -1)}
                      disabled={container.quantity === 0}
                    >
                      <i className="bx bx-minus"></i>
                    </Button>
                    <Input
                      value={container.quantity}
                      onChange={(e) => {
                        const newContainers = [...containers];
                        newContainers[index].quantity = Math.max(0, parseInt(e.target.value) || 0);
                        setContainers(newContainers);
                        setSite({ ...site, container_on_site: newContainers.filter((c) => c.quantity > 0) });
                      }}
                      className="w-20 text-center flex items-center justify-center"
                      readOnly
                      min="0"
                    />
                    <Button type="button" onClick={() => handleQuantityChange(index, 1)}>
                      <i className="bx bx-plus"></i>
                    </Button>
                  </div>
                ))}
                <div className="flex gap-4 pt-2">
                  <Button type="button" onClick={() => setCurrentStep(1)} variant="outline">
                    Назад
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-full"
                    disabled={containers.filter((c) => c.quantity > 0).length === 0}
                  >
                    Далее
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex gap-8">
                <div className=" border rounded-xl p-6 w-2/3 h-96">
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Расписание</label>
                    <div className="flex flex-wrap">
                      {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                        <div
                          onClick={() => handleScheduleChange(day as keyof typeof site.schedule)}
                          key={day}
                          className="flex items-center cursor-pointer rounded hover:bg-blue-200 w-16 justify-center select-none"
                        >
                          <Checkbox id={day} checked={site.schedule[day as keyof typeof site.schedule] as any} />
                          <label className="ml-2 cursor-pointer">
                            {day === "monday" && "Пн"}
                            {day === "tuesday" && "Вт"}
                            {day === "wednesday" && "Ср"}
                            {day === "thursday" && "Чт"}
                            {day === "friday" && "Пт"}
                            {day === "saturday" && "Сб"}
                            {day === "sunday" && "Вс"}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {!site.truck_uuid ? (
                    <div className="text-red-500">Выберите мусоровоз</div>
                  ) : (
                    <div>
                      <TruckScheduler
                        max_truck_load={truck_week_load}
                        max_truck_load_per_day={max_truck_load_per_day}
                      />
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button type="button" onClick={() => setCurrentStep(2)} variant="outline">
                      Назад
                    </Button>
                    <Button
                      onClick={save}
                      disabled={
                        site.truck_uuid === "" ||
                        site.name === "" ||
                        site.latitude === 0 ||
                        site.longitude === 0 ||
                        containers.filter((c) => c.quantity > 0).length === 0 ||
                        !Object.values(site.schedule)
                          .filter((v) => typeof v === "boolean")
                          .some((v) => v === true)
                      }
                    >
                      {init_data ? "Сохранить изменения" : "Создать площадку"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 w-1/3">
                  <div className="text-xl">Выберите мусоровоз</div>
                  <div className="overflow-y-auto h-1/4 border rounded-xl p-2">
                    <GarbageTruckList
                      current_uuid={site.truck_uuid}
                      trucks={repo.garbage_trucks}
                      onSelect={(truck) => {
                        setSite((prev) => ({ ...prev, truck_uuid: truck.uuid }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { container_type_to_string, derive_truck_loading } from "../trucks_calendar/utils";
import { GarbageTruckList } from "./truck_selector";
import { addDays, startOfDay } from "date-fns";
import Swal from "sweetalert2";

export const MapPicker: React.FC<{
  className?: string;
  default_center: GeoCoords;
  coords: GeoCoords | null;
  onChange: (v: GeoCoords) => void;
}> = ($) => {
  const tile_url = "https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}";
  //const tile_url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className={"rounded-xl overflow-hidden relative " + $.className}>
      <MapContainer className={"h-full w-full z-10"} center={$.default_center} zoom={11}>
        <TileLayer url={tile_url} />
        <MapController onChange={$.onChange} />
        {$.coords && (
          <Marker
            position={$.coords}
            draggable={true}
            icon={L.icon({
              iconUrl: "/assets/location_marker.png",
              iconSize: [40, 40], // size of the icon
              iconAnchor: [20, 38], // point of the icon which will correspond to marker's location
            })}
            eventHandlers={{ dragend: (e) => $.onChange(e.target.getLatLng()) }}
          ></Marker>
        )}
      </MapContainer>
    </div>
  );
};

const MapController: React.FC<{
  onChange: (v: GeoCoords) => void;
}> = ($) => {
  useMapEvents({ click: (e) => $.onChange(e.latlng) });
  return null;
};

export const TruckScheduler: React.FC<{ max_truck_load: number[]; max_truck_load_per_day: number }> = ($) => {
  return (
    <div className="flex w-full">
      {$.max_truck_load.map((v, idx) => (
        <div
          key={idx}
          className={
            " cursor-pointer hover:opacity-50 w-16 py-2 day border-r text-center " +
            (v > $.max_truck_load_per_day
              ? "bg-red-500 text-white"
              : v > 0
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-black")
          }
        >
          {v}
        </div>
      ))}
    </div>
  );
};

/*
 * **/
export function get_truck_week_load(truck_uuid: string, contract: ContractResolved, sites: SiteResolved[]) {
  if (!contract || !truck_uuid) return [0, 0, 0, 0, 0, 0, 0];
  const start_date = startOfDay(new Date(contract.start_date));
  const end_date = new Date(contract.end_date);
  const all_dates: Date[] = [];
  const days = Math.min(365, Math.ceil((end_date.valueOf() - start_date.valueOf()) / (1000 * 60 * 60 * 24)));
  console.log(days);
  for (let i = 0; i < days; i++) all_dates.push(addDays(start_date, i));

  const truck_loading = derive_truck_loading(
    sites.filter((v) => v.truck_uuid === truck_uuid),
    all_dates,
  )[truck_uuid];

  const max_load_by_weekdays = [0, 0, 0, 0, 0, 0, 0];

  const truck_load_days = Object.keys(truck_loading || {}).map((v) => parseInt(v));

  for (let i of truck_load_days) {
    const day = new Date(i);
    const weekday = day.getDay();
    const loading = truck_loading?.[i.valueOf()] || 0;
    if (loading?.total_containers)
      max_load_by_weekdays[weekday] = Math.max(max_load_by_weekdays[weekday], loading.total_containers);
  }
  return max_load_by_weekdays;
}
