import { getPgPool } from "../../persistence/pg";
import { logger } from "../../logger";

export default async function (id: string): Promise<boolean> {
  const q = `
    delete
    from
      deletion_confirmation
    where
      id = $1
  `;
  const v = [
    id,
  ];

  const pg = await getPgPool();
  const response = await pg.query(q, v);

  if (response.rowCount === 0) {
    logger.info(`Expected deletion_confirmation row to be deleted, but rowCount == 0`);
    return false;
  }

  return true;
}
