import * as moment from "moment";
import { getPgPool } from "../../persistence/pg";
import { Invite } from "./index";

export interface Options {
  projectId: string;
}

export default async function listInvites(opts: Options): Promise<Invite[]> {
  const fields = `id, email, project_id,
      extract(epoch from created) * 1000 as created`;

  const q = `select ${fields} from invite where project_id = $1 order by created asc`;
  const v = [opts.projectId];
  const pg = await getPgPool();
  const result = await pg.query(q, v);
  if (result.rowCount > 0) {
    return result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      project_id: row.project_id,
      created: moment(row.created),
    }));
  }

  return [];

}
