import * as uuid from "uuid";
import * as moment from "moment";
import * as pg from "pg";

import { getPgPool } from "../../persistence/pg";
import {
  DeletionRequest,
  DeletionRequestValues,
  rowFromDeletionRequest,
} from "./";

export default async function create(
  drv: DeletionRequestValues,
  queryIn?: (q: string, v: any[]) => Promise<pg.QueryResult>,
): Promise<DeletionRequest> {

  const newDeletionRequest: DeletionRequest = {
    id: uuid.v4().replace(/-/g, ""),
    created: moment(),
    ...drv,
  };

  const row = rowFromDeletionRequest(newDeletionRequest);

  const insertStmt = `
    insert into deletion_request (
      id, created, backoff_interval, resource_kind, resource_id
    ) values (
      $1, to_timestamp($2), $3, $4, $5
    )
  `;
  const insertVals = [
    row.id,
    row.created,
    row.backoff_interval,
    row.resource_kind,
    row.resource_id,
  ];

  const pg = await getPgPool();
  await pg.query(insertStmt, insertVals);

  return newDeletionRequest;
}
