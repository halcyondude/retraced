import "source-map-support/register";
import * as moment from "moment";

import { getPgPool } from "../persistence/pg";

export default async function pruneViewerDescriptors(job) {
    // These expire after 5 minutes, but allow for some clock difference with api
    const before = moment().subtract(1, "day").format();

    const pg = await getPgPool();
    pg.query("DELETE FROM viewer_descriptors WHERE created < $1", [before]);
}
