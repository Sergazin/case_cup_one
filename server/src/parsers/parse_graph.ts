import ExcelJS from "exceljs";

export async function parse_excel_graphs(raw_data: Buffer): Promise<GraphExcelRawItem[]> {
  const workbook = new ExcelJS.Workbook();
  // @ts-ignore
  const result = await workbook.xlsx.load(raw_data);
  const sheet = result.worksheets[0];

  const header_rows = 10;
  const total_rows = sheet.rowCount - header_rows;

  const graph_items: GraphExcelRawItem[] = [];

  for (let i = 0; i <= total_rows; i++) {
    const row = sheet.getRow(i + header_rows);
    const row_data: string[] = [];
    for (let j = 1; j <= 22; j++) {
      let data = row.getCell(j);
      row_data.push(data.value?.toString() || "");
    }
    if (row_data.length != 22) continue;

    graph_items.push({
      garbage_truck_plate_no: row_data[0],
      site: row_data[1],
      contractor: row_data[2],
      contract: row_data[3],
      waste_type: row_data[4],
      container_type: row_data[5],
      installed: parseInt(row_data[6]),
      latitude: parseFloat(row_data[7]),
      longitude: parseFloat(row_data[8]),
      iin: row_data[9],
      schedule_type: row_data[10],
      schedule_name: row_data[11],
      schedule_parameters: row_data[12],
      monday: parseInt(row_data[13] || "0"),
      tuesday: parseInt(row_data[14] || "0"),
      wednesday: parseInt(row_data[15] || "0"),
      thursday: parseInt(row_data[16] || "0"),
      friday: parseInt(row_data[17] || "0"),
      saturday: parseInt(row_data[18] || "0"),
      sunday: parseInt(row_data[19] || "0"),
      start_date: date_parse(row_data[20]),
      end_date: date_parse(row_data[21]),
    });
  }

  return graph_items;
}

export type GraphExcelRawItem = {
  garbage_truck_plate_no: string; // Район
  site: string; // Площадка
  contractor: string; // Контрагент
  contract: string; // Договор
  waste_type: string; // Вид отходов
  container_type: string; // Тип емкости
  installed: number; // Установлено
  latitude: number; // Широта
  longitude: number; // Долгота
  iin: string; // ИНН
  schedule_type: string; // Тип графика
  schedule_name: string; // Имя графика
  schedule_parameters: string; // Параметры графика
  monday: number; // пн
  tuesday: number; // вт
  wednesday: number; // ср
  thursday: number; // чт
  friday: number; // пт
  saturday: number; // сб
  sunday: number; // вс
  start_date: string | null; // Дата начала
  end_date: string | null; // Дата окончания
};

import { parse } from "date-fns";
export function date_parse(raw: string): string | null {
  try {
    return parse(raw, "dd.MM.yyyy", new Date()).toISOString();
  } catch (e) {
    return null;
  }
}
