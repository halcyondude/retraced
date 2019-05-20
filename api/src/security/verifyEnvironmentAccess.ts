import { getPgPool } from "../persistence/pg";

export interface Options {
  environmentId: string;
  userId: string;
}

export default async function verifyEnvironmentAccess(opts: Options): Promise<boolean> {
  const pg = await getPgPool();
  const q = "select count(1) from environmentuser where user_id = $1 and environment_id = $2";
  const result = await pg.query(q, [opts.userId, opts.environmentId]);
  return result.rows[0].count > 0;
}
