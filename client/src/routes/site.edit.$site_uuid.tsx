import SiteEditor from "@/sections/booking/site_editor";
import { RepoCubit } from "@/repo";
import { useStore } from "@nanostores/react";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/site/edit/$site_uuid")({
  component: () => {
    const repo = useStore(RepoCubit.state);
    const { site_uuid } = useParams({ strict: true, from: "/site/edit/$site_uuid" });
    const site = repo.sites.find((site) => site.uuid === site_uuid);
    if (!site) return <div>Site not found</div>;
    return <SiteEditor init_data={site} />;
  },
});
