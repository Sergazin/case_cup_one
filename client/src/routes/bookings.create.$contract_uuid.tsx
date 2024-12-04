import { RepoCubit } from "@/repo";
import SiteEditor from "@/sections/booking/site_editor";
import { ScheduleEnum } from "@/ts_client";
import { useStore } from "@nanostores/react";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings/create/$contract_uuid")({
  component: () => {
    const repo = useStore(RepoCubit.state);
    const { contract_uuid } = useParams({ strict: false });
    const contract = repo.contracts.find((c) => c.uuid === contract_uuid);
    return (
      <SiteEditor
        init_data={{
          organization_uuid: contract?.organization_uuid || "",
          contract_uuid: contract?.uuid || "",
          truck_uuid: "",
          schedule: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            name: ScheduleEnum.Weekly,
          },
          name: "",
          description: "",
          latitude: 0,
          longitude: 0,
          container_on_site: [],
          imported: false,
          archived: false,
        }}
      />
    );
  },
});
