import { Controller } from "./controllers";
import init_db from "./inits/db";
import { router, start_server } from "./inits/web_server";
//import { parse_all_data_and_save_to_db } from "./parsers/parse_all_data_and_save_to_db";
import { apply_routes } from "./ts_server";

async function main() {
  //parse_all_data_and_save_to_db();
  const x = await init_db();
  x.on("connected", () => {
    console.log("DB connected");
  });
  apply_routes(router, new Controller());
  await start_server();
}
main();
