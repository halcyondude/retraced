
import { getPgPool } from "../../persistence/pg";

export interface Options {
  user_id: string;
}

/**
 * Asynchronously returns all projects for a user from the database
 */
export default async function listProjects(opts: Options) {
  const q = `select project.* from project
    inner join projectuser
    on project.id = projectuser.project_id
    where projectuser.user_id = $1`;
  const v = [
    opts.user_id,
  ];

  const pg = await getPgPool();
  const result = await pg.query(q, v);

  return result.rowCount > 0 ? result.rows : [] ;
}
