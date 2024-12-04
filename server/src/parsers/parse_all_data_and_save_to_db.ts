import { graph_data_extractor } from "../parsers/graph_data_extractor";
import { parse_excel_graphs } from "../parsers/parse_graph";
//import fs from "fs/promises";
import { ContractRawModel, GarbageTruckRawModel, OrganizationRawModel, SiteRawModel } from "../ts_server/models";

export async function parse_all_data_and_save_to_db(excel_file_content: Buffer) {
  console.log("Parsing all data and saving to DB");
  //false && (async () => {
  //const excel_file_content = await fs.readFile("./samples/graph.xlsx");
  const graph_data = await parse_excel_graphs(excel_file_content);
  //await fs.writeFile("./samples/graph.json", JSON.stringify(graph_data, null, 2));
  //})();

  //const graph_data = JSON.parse(await fs.readFile("./samples/graph.json", "utf-8")) as GraphExcelRawItem[];
  const extracted = await graph_data_extractor(graph_data);
  console.log(extracted);
  //await fs.writeFile("./samples/extracted.json", JSON.stringify(extracted, null, 2));

  //await mongoose.connection.db?.dropDatabase();
  console.log("DB dropped");

  console.log("DB connected");
  await Promise.all([
    SiteRawModel.deleteMany({ imported: true }),
    OrganizationRawModel.deleteMany({ imported: true }),
    GarbageTruckRawModel.deleteMany({ imported: true }),
    ContractRawModel.deleteMany({ imported: true }),
  ]);

  await Promise.all([
    SiteRawModel.create(extracted.sites),
    OrganizationRawModel.create(extracted.organizations),
    GarbageTruckRawModel.create(extracted.garbage_trucks),
    ContractRawModel.create(extracted.contracts),
  ]);
  console.log("All done!");
}
