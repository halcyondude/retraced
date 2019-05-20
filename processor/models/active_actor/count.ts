import "source-map-support/register";
import { getPgPool } from "../../persistence/pg";
import { EnvironmentTimeRange } from "../../common";

export default async function count(opts: EnvironmentTimeRange): Promise<number> {
  const select = `
  select count(1) from active_actor
  where
    project_id = $1
    and environment_id = $2
    and created_at >= $3
    and created_at < $4`;

  const pg = await getPgPool();
  const results = await pg.query(select, [
    opts.projectId,
    opts.environmentId,
    opts.range[0].format(),
    opts.range[1].format(),
  ]);

  return results.rows[0].count;
}
