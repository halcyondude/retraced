import "source-map-support/register";

import { getPgPool } from "../persistence/pg";

export default function getLocationByIP(ipAddress) {
  return new Promise(async (resolve, reject) => {
    if (!ipAddress) {
      resolve(undefined);
      return;
    }

    const pg = await getPgPool();
    pg.connect((err, pg, done) => {
      if (err) {
        reject(err);
        return;
      }

      const q = "select * from geoip where network >> $1";
      pg.query(q, [ipAddress], (qerr, result) => {
        done(true);
        if (qerr) {
          reject(qerr);
        } else if (result.rowCount > 0) {
          resolve(result.rows[0]);
        } else {
          resolve(undefined);
        }
      });
    });
  });
}
