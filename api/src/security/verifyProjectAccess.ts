
import { getPgPool } from "../persistence/pg";

export interface Options {
  projectId: string;
  userId: string;
}

export default async function(opts: Options): Promise<boolean> {
  const pgPool = await getPgPool();
  const q = "select count(1) from projectuser where user_id = $1 and project_id = $2";
  const result = await pgPool.query(q, [opts.userId, opts.projectId]);
  return result.rows[0].count > 0;
}
