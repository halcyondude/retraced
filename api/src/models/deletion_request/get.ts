import { getPgPool } from "../../persistence/pg";
import {
  DeletionRequest,
  deletionRequestFromRow,
} from "./";

export default async function (id: string): Promise<DeletionRequest | null> {
  const q = `
    select
      id, created, backoff_interval, resource_kind, resource_id
    from
      deletion_request
    where
      id = $1
  `;
  const v = [
    id,
  ];

  const pg = await getPgPool();
  const response = await pg.query(q, v);

  if (response.rowCount === 0) {
    return null;
  }

  return deletionRequestFromRow(response.rows[0]);
}
