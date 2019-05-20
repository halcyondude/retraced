import { getPgPool } from "../../persistence/pg";

export interface Options {
  actionId: string;
}

export default async function getAction(opts: Options): Promise<any> {
  const pg = await getPgPool();
  const values = `id, environment_id, event_count, action, project_id, display_template,
      extract(epoch from created) * 1000 as created,
      extract(epoch from first_active) * 1000 as first_active,
      extract(epoch from last_active) * 1000 as last_active`;

  const q = `select ${values} from action where id = $1`;
  const v = [opts.actionId];

  const result = await pg.query(q, v);

  if (result.rowCount > 0) {
    return result.rows[0];
  }

  return null;
}
