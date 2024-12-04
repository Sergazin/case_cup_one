import { RepoCubit } from "@/repo";
import { ContainerTypeEnum, ScheduleEnum, SiteResolved } from "@/ts_client";
import _ from "lodash";

export const derive_months = (all_dates: Date[]): { name: string; days_in_month: number; year: number }[] => {
  const months: { name: string; days_in_month: number; year: number }[] = [];

  for (let day in all_dates) {
    const date = all_dates[day];
    const month = date.getMonth();
    const year = date.getFullYear();
    // Russian locale
    const name = date.toLocaleString("ru", { month: "long" });
    const days_in_month = new Date(year, month + 1, 0).getDate();
    if (!months.find((v) => v.name === name)) {
      months.push({ name, days_in_month, year });
    }
  }
  return months;
};

export type OnDaySiteLoading = {
  site_uuid_list: string[];
  total_containers: number;
};

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export const derive_truck_loading = (
  sites: SiteResolved[],
  all_dates: Date[],
): { [key: string]: { [key: number]: OnDaySiteLoading } } => {
  const truck_loading: { [key: string]: { [key: number]: OnDaySiteLoading } } = {};

  const contracts = RepoCubit.state.get().contracts;

  for (const site of sites) {
    const contract = contracts.find((v) => v.uuid === site.contract_uuid);
    if (!contract) continue;
    let load_per_day = truck_loading[site.truck_uuid] || {};
    let total_containers = 0;
    for (let container of site.container_on_site) total_containers += container.quantity;

    if (site.schedule.name === ScheduleEnum.Weekly) {
      for (let day of all_dates) {
        if (contract.end_date < day.valueOf()) continue;
        const week_day_idx = day.getDay();
        const weekday = weekdays[week_day_idx];
        const value_of = day.valueOf();

        if (!load_per_day[value_of]) load_per_day[value_of] = { site_uuid_list: [], total_containers: 0 };

        if (site.schedule[weekday]) {
          if (!_.includes(load_per_day[value_of].site_uuid_list, site.uuid)) {
            load_per_day[value_of].site_uuid_list.push(site.uuid);
          }
          load_per_day[value_of].total_containers += total_containers;
        }
      }
    }

    truck_loading[site.truck_uuid] = load_per_day;
  }

  return truck_loading;
};

export const container_type_to_string = (constainer_type: ContainerTypeEnum): string => {
  switch (constainer_type) {
    case ContainerTypeEnum.Bunker8:
      return "Бункер 8";
    case ContainerTypeEnum.Container10:
      return "Контейнер 10";
    case ContainerTypeEnum.Cleaning:
      return "Уборка";
    case ContainerTypeEnum.Euro11:
      return "Евро 11";
    case ContainerTypeEnum.Naval:
      return "Навал";
    case ContainerTypeEnum.Septik10:
      return "Септик 10";
    case ContainerTypeEnum.Septik4:
      return "Септик 4";
  }
};
