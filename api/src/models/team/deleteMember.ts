import { getPgPool } from "../../persistence/pg";

import deleteEnvUser from "../environmentuser/delete";
import listEnvironments from "../environment/list";

// opts: userId, projectId
export default async function deleteUserFromProject(opts) {
  const envs: any = await listEnvironments({ projectId: opts.projectId });
  for (const env of envs) {
    await deleteEnvUser({ userId: opts.userId, environmentId: env.id });
  }

  const q = "delete from projectuser where user_id = $1 and project_id = $2";
  const v = [opts.userId, opts.projectId];
  const pg = await getPgPool();
  await pg.query(q, v);
}
