import * as util from "util";
import { getPgPool } from "../persistence/pg";

export const name = "list-projects";
export const describe = "list the current projects";
export const builder = {};

async function listProject(): Promise<any> {
  const pg = await getPgPool();
  return pg.query(`select * from project`);
}

export const handler = async (argv) => {
  listProject()
      .then((res) => {
        console.log(`rows: ${util.inspect(res.rows)}`);
        process.exit(0);
      })
      .catch((err) => {
        console.log(util.inspect(err));
        process.exit(1);
      });
};
