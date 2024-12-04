import { parse_all_data_and_save_to_db } from "../parsers/parse_all_data_and_save_to_db";
import * as T from "../ts_server";

export async function upload(_auth_claims: T.AuthClaims, body: T.UploadRequest): Promise<void> {
  const b64_file = body.file;
  const buffer = Buffer.from(b64_file, "base64");
  await parse_all_data_and_save_to_db(buffer);
}
