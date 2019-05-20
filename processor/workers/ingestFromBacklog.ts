import "source-map-support/register";
import { getPgPool } from "../persistence/pg";
import nsq from "../persistence/nsq";

export default async function ingestFromBacklog() {
    const q = `
        WITH deleted AS (
            DELETE FROM backlog WHERE ctid IN (
                SELECT ctid FROM backlog LIMIT 1000
            )
            RETURNING
                new_event_id,
                project_id,
                environment_id,
                received,
                original_event
        )
        INSERT INTO ingest_task (
            id,
            new_event_id,
            project_id,
            environment_id,
            received,
            original_event
        ) SELECT md5(random()::text), * FROM deleted
        ON CONFLICT DO NOTHING
        RETURNING id`;

    const pg = await getPgPool();
    const result = await pg.query(q, []);

    for (const row of result.rows) {
        const job = JSON.stringify({
            taskId: row.id,
        });
        await nsq.produce("raw_events", job);
    }
}
