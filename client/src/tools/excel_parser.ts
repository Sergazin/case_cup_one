import axios from "axios";
import ExcelJS from "exceljs";

export async function excel_parser() {
  const workbook = new ExcelJS.Workbook();
  /*
  const file = await axios.get("/samples/routes.xls", {
    responseType: "arraybuffer",
  });
  * **/
  const file = await axios.get("/samples/graph.xlsx", {
    responseType: "arraybuffer",
  });
  await workbook.xlsx.read(file.data);
}
