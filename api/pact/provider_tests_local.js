const { Verifier } = require("@pact-foundation/pact");
const packageJson = require("../package.json");
const path = require("path");
const os = require("os");

let opts = {
  providerBaseUrl: "http://localhost:3000",
  provider: "retraced-api",
  pactUrls: [
    path.resolve(process.cwd(), "pacts", "retraced-logs-viewer-retraced-api.json"),
  ],
  publishVerificationResult: process.env["PUBLISH_PACT_VERIFICATION"] === "true",
  providerVersion: packageJson.version,
};

console.log("Starting pact verifier");
return Verifier().verifyProvider(opts);
