import "source-map-support/register";
import { getPgPool } from "./persistence/pg";
import * as bugsnag from "bugsnag";

const pgPool = getPgPool();

const useCache = !process.env.RETRACED_DB_NO_CACHE;
const actorCache = {};
const targetCache = {};
const groupCache = {};

const common = {
  getActor: async (id) => {
    const maybeActor = actorCache[id];
    if (maybeActor) {
      return maybeActor;
    }

    const pg = await getPgPool();
    const q = "select * from actor where id = $1";
    const v = [id];
    const result = await pg.query(q, v);
    const actor = result.rows[0];
    if (useCache) {
      actorCache[id] = actor;
    }
    return actor;
  },

  getTarget: async (id) => {
    const maybeTarget = targetCache[id];
    if (maybeTarget) {
      return maybeTarget;
    }

    const pg = await getPgPool();
    const q = "select * from target where id = $1";
    const v = [id];
    const result = await pg.query(q, v);

    const object = result.rows[0];
    if (useCache) {
      targetCache[id] = object;
    }
    return object;
  },

  getGroup: async (id) => {
    const maybeGroup = groupCache[id];
    if (maybeGroup) {
      return maybeGroup;
    }

    const pg = await getPgPool();
    const q = "select * from group_detail where group_id = $1";
    const v = [id];
    const result = await pg.query(q, v);
    const group = result.rows[0];
    if (useCache) {
      groupCache[id] = group;
    }
    return group;
  },
};

function setupBugsnag() {
  if (!process.env["BUGSNAG_TOKEN"]) {
    // console.error("BUGSNAG_TOKEN not set, error reports will not be sent to bugsnag");
  } else {
    bugsnag.register(process.env["BUGSNAG_TOKEN"] || "", {
      releaseStage: process.env["STAGE"],
      notifyReleaseStages: ["production", "staging"],
    });
  }
}

export default common;
export { setupBugsnag };
