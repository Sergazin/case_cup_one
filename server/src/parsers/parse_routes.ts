import ExcelJS from "exceljs";
import fs from "fs";

export async function parse_excel_routes() {
  const workbook = new ExcelJS.Workbook();
  const result = await workbook.xlsx.readFile("./samples/routes.xlsx", {});
  const sheet = result.worksheets[0];

  const header_rows = 4;
  const total_rows = sheet.rowCount - header_rows;

  const items: SiteManagementRecord[] = [];
  //console.log(sheet)

  const district = "550AN06";

  for (let i = 0; i <= total_rows; i++) {
    const row = sheet.getRow(i + header_rows);
    const row_data: string[] = [];
    for (let j = 1; j <= 6; j++) {
      let data = row.getCell(j);
      row_data.push(data.value?.toString() || "");
    }

    items.push({
      no: parseInt(row_data[0]),
      siteName: row_data[1],
      contractor: row_data[2],
      containerComposition: row_data[3],
      pickupTime: row_data[4],
      district: row_data[5],
    });
  }
  fs.writeFileSync("./samples/routes.json", JSON.stringify(items, null, 2));
}

type SiteManagementRecord = {
  no: number; // №
  siteName: string; // Наименование площадки
  contractor: string; // Контрагент
  containerComposition: string; // Состав емкостей
  pickupTime: string; // Время вывоза
  district: string; // Район
};

import { parse } from "date-fns";
export function date_parse(raw: string): Date {
  return parse(raw, "dd.MM.yyyy", new Date());
}
