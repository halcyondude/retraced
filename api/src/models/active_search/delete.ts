import { getPgPool } from "../../persistence/pg";

export interface Options {
  activeSearchId: string;
  projectId: string;
  environmentId: string;
  groupId: string;
}

export default async function(opts: Options) {
  const deleteStmt = `delete from active_search where
    id = $1 and
    project_id = $2 and
    environment_id = $3 and
    group_id = $4`;
  const deleteVals = [
    opts.activeSearchId,
    opts.projectId,
    opts.environmentId,
    opts.groupId,
  ];
  const pg = await getPgPool();
  const result = await pg.query(deleteStmt, deleteVals);
  if (result.rowCount !== 1) {
    throw new Error(`Expected deleted row count of 1, got ${result.rowCount}`);
  }
}
