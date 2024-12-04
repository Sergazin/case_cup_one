import * as nanostores from "nanostores";
import { AllData, ContractPublic, ContractResolved, SitePublic, SiteResolved } from "./ts_client";
import { api } from "./api";

const state = nanostores.map<AllData>({
  organizations: [],
  garbage_trucks: [],
  contracts: [],
  sites: [],
});

export class RepoCubit {
  static state = state;
  static async init() {
    const all_data = await api.get_all_data();
    state.set(all_data);
  }

  static async create_contract(data: ContractPublic): Promise<ContractResolved> {
    const new_contract = await api.add_contract(data);
    const $ = state.get();
    state.set({ ...$, contracts: [...$.contracts, new_contract] });
    return new_contract;
  }

  static async create_site(data: SitePublic): Promise<SiteResolved> {
    const new_site = await api.add_site(data);
    const $ = state.get();
    state.set({ ...$, sites: [...$.sites, new_site] });
    return new_site;
  }

  static async update_site(site_uuid: string, data: SitePublic): Promise<SiteResolved> {
    const updated_site = await api.update_site(site_uuid, data);
    const $ = state.get();
    state.set({ ...$, sites: $.sites.map((site) => (site.uuid === site_uuid ? updated_site : site)) });
    return updated_site;
  }

  static async archive_contract(contract_uuid: string): Promise<void> {
    await api.archive_contract(contract_uuid);
    const $ = state.get();
    state.set({
      ...$,
      contracts: $.contracts.filter((contract) => contract.uuid !== contract_uuid),
      sites: $.sites.filter((site) => site.contract_uuid !== contract_uuid),
    });
  }

  static async archive_site(site_uuid: string): Promise<void> {
    await api.archive_site(site_uuid);
    const $ = state.get();
    state.set({ ...$, sites: $.sites.filter((site) => site.uuid !== site_uuid) });
  }
}
