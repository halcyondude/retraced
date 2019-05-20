import "source-map-support/register";
import * as uuid from "uuid";

import populateEnvUser from "../environmentuser/populate_from_project";
import { getPgPool } from "../../persistence/pg";

export interface Options {
  userId: string;
  projectId: string;
}

export default async function addUserToProject(opts: Options) {
  const pg = await getPgPool();
  const q = `insert into projectuser (
      id, project_id, user_id
    ) values (
      $1, $2, $3
    )`;
  const v = [
    uuid.v4().replace(/-/g, ""),
    opts.projectId,
    opts.userId,
  ];
  await pg.query(q, v);

  await populateEnvUser({
    project_id: opts.projectId,
    user_id: opts.userId,
  });
}
