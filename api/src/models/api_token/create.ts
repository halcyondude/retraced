import * as uuid from "uuid";
import * as moment from "moment";

import {
  ApiToken,
  ApiTokenValues,
  rowFromApiToken,
} from "./";
import { getPgPool } from "../../persistence/pg";

export default async function create(
  projectId: string,
  environmentId: string,
  values: ApiTokenValues,
  token?: string,
): Promise<ApiToken> {
  const newApiToken: ApiToken = {
    token: token || uuid.v4().replace(/-/g, ""),
    created: moment(),
    projectId,
    environmentId,
    ...values,
  };

  const row = rowFromApiToken(newApiToken);

  const insertStmt = `insert into token (
      token, created, disabled, name, environment_id, project_id
    ) values (
      $1, to_timestamp($2), $3, $4, $5, $6
    )`;
  const insertVals = [
    row.token,
    row.created,
    row.disabled,
    row.name,
    row.environment_id,
    row.project_id,
  ];
  const pg = await getPgPool();
  await pg.query(insertStmt, insertVals);

  return newApiToken;
}
