import * as uuid from "uuid";
import * as pg from "pg";

import { getPgPool } from "../../persistence/pg";
import {
  DeletionConfirmation,
  DeletionConfirmationValues,
  rowFromDeletionConfirmation,
} from "./";

export default async function create(
  dcv: DeletionConfirmationValues,
  queryIn?: (q: string, v: any[]) => Promise<pg.QueryResult>,
): Promise<DeletionConfirmation> {

  const newDeletionConfirmation: DeletionConfirmation = {
    id: uuid.v4().replace(/-/g, ""),
    ...dcv,
  };

  const row = rowFromDeletionConfirmation(newDeletionConfirmation);

  const insertStmt = `insert into deletion_confirmation (
      id, deletion_request_id, retraceduser_id, received, visible_code
    ) values (
      $1, $2, $3, to_timestamp($4), $5
    )`;
  const insertVals = [
    row.id,
    row.deletion_request_id,
    row.retraceduser_id,
    row.received,
    row.visible_code,
  ];
  const pg = await getPgPool();
  await pg.query(insertStmt, insertVals);

  return newDeletionConfirmation;
}
