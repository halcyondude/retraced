import { getPgPool } from "../../persistence/pg";

// projectId, tokenId
export default async function deleteApiToken(opts) {
  const q = "delete from token where token = $1 and project_id = $2";
  const v = [opts.tokenId, opts.projectId];
  const pg = await getPgPool();
  await pg.query(q, v);
}
