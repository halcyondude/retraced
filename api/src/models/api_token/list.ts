import "source-map-support/register";

import { ApiToken, apiTokenFromRow } from "./";
import { getPgPool } from "../../persistence/pg";

export interface Options {
    projectId: string;
}

export default async function listApiTokens(opts: Options): Promise<ApiToken[]> {
    const q = `
        select
            token,
            project_id,
            created,
            disabled,
            environment_id,
            name
        from
            token
        where
            project_id = $1`;
    const v = [opts.projectId];
    const pg = await getPgPool();
    const result = await pg.query(q, v);
    const rows = result.rowCount > 0 ? result.rows : [];

    return rows.map(apiTokenFromRow);
}
