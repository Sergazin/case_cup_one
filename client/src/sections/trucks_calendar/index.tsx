import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { RepoCubit } from "@/repo";
import { useStore } from "@nanostores/react";
import { addDays, startOfDay, startOfMonth } from "date-fns";
import React, { useMemo } from "react";
import { OnDaySiteLoading, container_type_to_string, derive_truck_loading } from "./utils";
import { TableHeader } from "./header";
import HelpCard from "@/components/help_card";
import { GarbageTruckResolved } from "@/ts_client";
import { Package } from "lucide-react";

export const TrucksCalendar: React.FC = () => {
  const [current, set_current] = React.useState<{
    truck: GarbageTruckResolved;
    loading: OnDaySiteLoading;
  } | null>(null);
  const repo = useStore(RepoCubit.state);
  const now = new Date();
  const today = startOfDay(now).valueOf();
  const start = startOfMonth(now);
  const days = 365;
  const all_dates: Date[] = [];
  const [loaded, set_loaded] = React.useState(false);

  const [truck_loading, set_truck_loading] = React.useState<{
    [key: string]: {
      [key: number]: OnDaySiteLoading;
    };
  }>({});
  for (let i = 0; i < days; i++) all_dates.push(addDays(start, i));

  useMemo(() => {
    setTimeout(() => {
      set_truck_loading(derive_truck_loading(repo.sites, all_dates));
      if (!loaded) set_loaded(true);
    }, 0);
  }, [loaded, repo]);
  if (!loaded)
    return (
      <div className="flex justify-center items-center h-96 gap-4">
        <i className="bx bx-loader bx-spin text-4xl"></i>
        <div className="text-2xl">Формируем график загрузки...</div>
      </div>
    );

  //const truck_loading = derive_truck_loading(repo.sites, all_dates);
  console.log(truck_loading);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="border rounded">
        <TableHeader all_dates={all_dates} />
        {repo.garbage_trucks.map((truck) => {
          const truck_max_load_per_day = truck.max_trip_per_day * truck.max_load_per_trip;
          return (
            <div className="truck border-b flex" key={truck.uuid}>
              <div className="w-36 border-r px-1">{truck.plate_no}</div>
              <div className="days flex text-center">
                {all_dates.map((date) => {
                  const truck_schedule = truck_loading[truck.uuid];
                  const truck_load = truck_schedule
                    ? truck_schedule[date.valueOf()]
                    : { site_uuid_list: [], total_containers: 0 };

                  let key = `${date.getTime()}-${truck.uuid}`;
                  if (truck_load.total_containers === 0)
                    return (
                      <div key={key} className="iday border-r bg-gray-100">
                        -
                      </div>
                    );
                  return (
                    <div
                      key={key}
                      onClick={() => set_current({ truck, loading: truck_load })}
                      className={
                        "iday cursor-pointer hover:opacity-50 day border-r " +
                        (date.valueOf() === today ? "today" : "") +
                        " " +
                        (truck_load.total_containers > truck_max_load_per_day
                          ? "bg-red-500 text-white"
                          : truck_load.total_containers > 0
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-black")
                      }
                    >
                      {truck_load.total_containers}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="helpers flex gap-4">
        <HelpCard
          title="Содержимое ячеек"
          text="Количество контейнеров, которые должен загрузить водитель в этот день отображается в ячейке. Если количество контейнеров превышает максимально возможное количество контейнеров, которое может взять водитель в день, ячейка окрасится в красный цвет."
        />
        <HelpCard
          title="Адреса для загрузки"
          text="Кликните на ячейку, чтобы увидеть адреса, где нужно загрузить контейнеры в этот день для данного автомобиля."
        />
        <HelpCard
          title="Учет дат договоров"
          text="Система учитывает даты договоров, поэтому если договор заканчивается, загружаемость контейнеров изменится."
        />
      </div>
      <Dialog open={current != null} onOpenChange={(o) => !o && set_current(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Маршрутный лист для {current?.truck.plate_no}</DialogTitle>
            <DialogDescription>{current?.loading.site_uuid_list.length} адресов на загрузку</DialogDescription>
          </DialogHeader>
          <ul className="space-y-4 max-h-[70vh] overflow-y-scroll pr-2">
            {current?.loading.site_uuid_list.map((site_uuid) => {
              const site = repo.sites.find((s) => s.uuid === site_uuid);
              if (!site) return null;
              return (
                <li
                  key={site.uuid}
                  className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`;
                    window.open(
                      url,
                      // `https://2gis.kz/geo/${site.longitude}%2C${site.latitude}?m=${site.longitude}%2C${site.latitude}%2F18.34`,
                    );
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{site.name}</h2>
                      <p className="text-gray-600">
                        {site.container_on_site
                          .reduce(
                            (acc, c) => [
                              ...acc,
                              `${container_type_to_string(c.container_type.name)} x ${c.quantity}`,
                            ],
                            [] as string[],
                          )
                          .join(", ")}{" "}
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Package className="w-4 h-4 mr-1" />
                      <span className="font-medium">
                        {site.container_on_site.reduce((acc, c) => acc + c.quantity, 0)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};
