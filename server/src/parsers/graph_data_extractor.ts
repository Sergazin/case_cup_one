import { v4, v5 } from "uuid";

import {
  ContainerTypeEnum,
  ScheduleEnum,
  type ContractRaw,
  type GarbageTruckRaw,
  type OrganizationRaw,
  type SiteRaw,
  type AllData,
} from "../ts_server";
import type { GraphExcelRawItem } from "./parse_graph";

export async function graph_data_extractor(data: GraphExcelRawItem[]): Promise<AllData> {
  const organizations: OrganizationRaw[] = [];
  /*
  const container_types = new Set<string>();
  const schedule_types = new Set<string>();
  * **/
  const sites: SiteRaw[] = [];
  const garbage_trucks: GarbageTruckRaw[] = [];
  const contracts: ContractRaw[] = [];

  const filtered_data = data.filter(
    (row_data) =>
      row_data.schedule_type == "Недельный" ||
      !(
        !row_data.monday &&
        !row_data.tuesday &&
        !row_data.wednesday &&
        !row_data.thursday &&
        !row_data.friday &&
        !row_data.saturday &&
        !row_data.sunday
      ),
  );

  for (const row_data of filtered_data) {
    // ORGANIZATION ========================================
    let organization = organizations.find((o) => o.iin === row_data.iin);
    if (!organization) {
      organization = {
        uuid: v5(row_data.iin, v5.DNS),
        iin: row_data.iin,
        name: row_data.contractor,
        imported: true,
      };
      organizations.push(organization);
    }

    // CONTRACT ========================================
    if (!row_data.start_date || !row_data.end_date)
      throw new Error(
        `Start or end date is missing for ${row_data.contract} ${row_data.start_date} ${row_data.end_date}`,
      );

    const start_date = new Date(row_data.start_date).valueOf();
    const end_date = new Date(row_data.end_date).valueOf();

    let contract = contracts.find(
      (c) =>
        c.name === (row_data.contract || "Без договора") && c.start_date === start_date && c.end_date === end_date,
    )!;
    if (!contract) {
      contract = {
        uuid: v4(),
        organization_uuid: organization.uuid,
        name: row_data.contract || "Без договора",
        start_date,
        end_date,
        imported: true,
        archived: false,
      };
      contracts.push(contract);
    }
    if (!contract)
      throw new Error(`Contract not found for ${row_data.contract} ${row_data.start_date} ${row_data.end_date}`);

    //container_types.add(row_data.container_type);
    //schedule_types.add(row_data.schedule_type);

    // TRUCK ========================================
    let truck = garbage_trucks.find((t) => t.plate_no === row_data.garbage_truck_plate_no);
    if (!truck) {
      truck = {
        uuid: v5(row_data.garbage_truck_plate_no, v5.DNS),
        plate_no: row_data.garbage_truck_plate_no,
        max_load_per_trip: 70,
        max_trip_per_day: 3,
        imported: true,
      };
      garbage_trucks.push(truck);
    }

    // SITE ========================================
    let site = sites.find(
      (s) =>
        s.name === row_data.site &&
        s.latitude === row_data.latitude &&
        s.longitude === row_data.longitude &&
        contract.uuid === s.contract_uuid,
    );
    if (!site) {
      site = {
        uuid: v4(),
        contract_uuid: contract.uuid,
        container_on_site: [
          {
            container_type: { name: parse_container_type(row_data.container_type) },
            quantity: row_data.installed,
          },
        ],
        name: row_data.site,
        latitude: row_data.latitude,
        longitude: row_data.longitude,
        organization_uuid: organization.uuid,
        truck_uuid: truck.uuid,
        schedule: {
          name: ScheduleEnum.Weekly,
          monday: !!row_data.monday,
          tuesday: !!row_data.tuesday,
          wednesday: !!row_data.wednesday,
          thursday: !!row_data.thursday,
          friday: !!row_data.friday,
          saturday: !!row_data.saturday,
          sunday: !!row_data.sunday,
        },
        imported: true,
        archived: false,
      };
      sites.push(site);
    } else {
      //throw new Error(`Site already exists: ${site.name}`);
      const found_container = site.container_on_site.find(
        (v) => v.container_type.name === parse_container_type(row_data.container_type),
      );
      if (found_container) {
        //console.log("found_container", found_container, site);
        found_container.quantity += row_data.installed;
      } else {
        site.container_on_site.push({
          container_type: { name: parse_container_type(row_data.container_type) },
          quantity: row_data.installed,
        });
      }
    }
  }

  console.log(sites.length, filtered_data.length);
  return { organizations, sites, garbage_trucks, contracts };
}

export function parse_container_type(type_str: string): ContainerTypeEnum {
  const val = {
    "Бункер 8": ContainerTypeEnum.Bunker8,
    "Евро 1.1": ContainerTypeEnum.Euro11,
    "Контейнер 1.0": ContainerTypeEnum.Container10,
    Навал: ContainerTypeEnum.Naval,
  }[type_str];
  if (!val) throw new Error(`Unknown container type: ${type_str}`);
  return val;
}
