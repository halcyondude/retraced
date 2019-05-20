import { getPgPool } from "../../persistence/pg";

/**
 * Asynchronously fetch a project from the database.
 */
export default async function getProject(projectId): Promise<any> {
  const pg = await getPgPool();
  const q = "select * from project where id = $1";
  const v = [projectId];
  const result = await pg.query(q, v);
  return result.rows[0];
}
