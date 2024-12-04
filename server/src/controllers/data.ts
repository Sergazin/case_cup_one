import { v4 } from "uuid";
import * as T from "../ts_server";
import { ContractRawModel, GarbageTruckRawModel, OrganizationRawModel, SiteRawModel } from "../ts_server/models";

export async function get_all_data(_auth_claims: T.AuthClaims): Promise<T.AllData> {
  const [organizations, garbage_trucks, sites, contracts] = await Promise.all([
    OrganizationRawModel.find({}),
    GarbageTruckRawModel.find({}),
    SiteRawModel.find({ archived: false }),
    ContractRawModel.find({ archived: false }),
  ]);
  return { organizations, garbage_trucks, sites, contracts };
}
export async function add_contract(_auth_claims: T.AuthClaims, body: T.ContractPublic): Promise<T.ContractResolved> {
  const new_contract = await ContractRawModel.create({
    ...body,
    uuid: v4(),
    imported: false,
  });
  return new_contract;
}
export async function add_site(_auth_claims: T.AuthClaims, body: T.SitePublic): Promise<T.SiteResolved> {
  const new_site = await SiteRawModel.create({
    ...body,
    uuid: v4(),
    imported: false,
  });
  return new_site;
}

export async function update_site(
  _auth_claims: T.AuthClaims,
  site_uuid: string,
  body: T.SitePublic,
): Promise<T.SiteResolved> {
  const site = await SiteRawModel.findOne({ uuid: site_uuid });
  if (!site) {
    throw new Error("Site not found");
  }
  site.set(body);
  await site.save();
  return site;
}

export async function archive_contract(_auth_claims: T.AuthClaims, contract_uuid: string): Promise<void> {
  const contract = await ContractRawModel.findOne({ uuid: contract_uuid, archived: false, imported: false });
  if (!contract) {
    throw new Error("Contract not found");
  }
  contract.archived = true;
  await contract.save();
  await ContractRawModel.updateMany({ contract_uuid }, { $set: { archived: true } });
}

export async function archive_site(_auth_claims: T.AuthClaims, contract_uuid: string): Promise<void> {
  const site = await SiteRawModel.findOne({ uuid: contract_uuid, archived: false, imported: false });
  if (!site) {
    throw new Error("Site not found");
  }
  site.archived = true;
  await site.save();
}
