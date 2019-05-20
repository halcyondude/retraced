const { Verifier } = require("@pact-foundation/pact");
const packageJson = require("../package.json");

let opts = {
  providerBaseUrl: "http://localhost:3000",
  provider: "retraced-api",
  pactBrokerUrl: "https://replicated-pact-broker.herokuapp.com",
  pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
  publishVerificationResult: process.env["PUBLISH_PACT_VERIFICATION"] === "true",
  providerVersion: packageJson.version,
};

console.log("Starting pact verifier");
return Verifier().verifyProvider(opts);
