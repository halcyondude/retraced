import { ApiToken, apiTokenFromRow } from "./";
import { getPgPool } from "../../persistence/pg";

export const getApiTokenQuery = `
  select
    token, created, disabled, environment_id, name, project_id
  from
    token
  where
    token = $1
`;

export default async function getApiToken(
  token: string,
): Promise<ApiToken | null> {

  const pg = await getPgPool();
  const v = [token];
  const result = await pg.query(getApiTokenQuery, v);
  if (result.rowCount > 0) {
    return apiTokenFromRow(result.rows[0]);
  }

  return null;
}
