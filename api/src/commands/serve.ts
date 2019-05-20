import * as util from "util";
import { Server } from "../server/server";

export const name = "serve";
export const describe = "Run the server";
export const builder = {
  bugsnagKey: {
    demand: false,
  },
  sigsciRPCAddress: {
    demand: false,
  },
};

export const handler = (argv) => {
  main(argv).catch((err) => {
    console.log(`Failed with error ${util.inspect(err)}`);
    process.exit(1);
  });
};

export async function main(argv: any): Promise<void> {
  await new Server(
    argv.bugsnagKey,
    argv.sigsciRPCAddress,
  ).start();
}
