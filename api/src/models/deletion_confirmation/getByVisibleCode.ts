import { getPgPool } from "../../persistence/pg";
import {
  DeletionConfirmation,
  deletionConfirmationFromRow,
} from "./";

export default async function (visibleCode: string): Promise<DeletionConfirmation | null> {
  const q = `
    select
      id, deletion_request_id, retraceduser_id, received, visible_code
    from
      deletion_confirmation
    where
      visible_code = $1
  `;
  const v = [
    visibleCode,
  ];

  const pg = await getPgPool();
  const response = await pg.query(q, v);

  if (response.rowCount === 0) {
    return null;
  }

  return deletionConfirmationFromRow(response.rows[0]);
}
