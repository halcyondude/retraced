import "source-map-support/register";

import { getPgPool } from "../persistence/pg";

export default async function saveUserReportingEvent(job) {
  const pg = await getPgPool();
  const jobObj = JSON.parse(job.body);

  const q = `
  insert into reporting_event (
    created_at, project_id, environment_id, event_name
  ) values (
    to_timestamp($1::double precision / 1000), $2, $3, $4
  )`;
  const v = [
    jobObj.timestamp,
    jobObj.projectId,
    jobObj.environmentId,
    jobObj.event,
  ];
  await pg.query(q, v);
}
