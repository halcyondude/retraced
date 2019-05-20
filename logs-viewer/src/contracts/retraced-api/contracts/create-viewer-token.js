import * as chai from "chai";
import * as _ from "lodash";
import * as Pact from "@pact-foundation/pact";

const expect = chai.expect;
const MOCK_SERVER_PORT = 3333;

export default () => {

  it("creates a veiwer token", async (done) => {
    await global.provider.addInteraction(createViewerTokenInteraction);
    const result = await doCreateViewerToken(`http://localhost:${MOCK_SERVER_PORT}/v1/project/simple-project/viewertoken`, fetch);

    const body = await result.json();
    expect(body.user.id).to.equal("000000-basic-user");

    global.provider.verify().then(() => done());
  });
}

const createViewerTokenInteraction = new Pact.Interaction()
  .uponReceiving("a request to create a logs viewer token")
  .withRequest({
    path: "/v1/project/sample-project/viewertoken",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .willRespondWith({
    status: 201,
    body: {
      "auth": "blargh",
      "projectId": "simple-project",
      "isAdmin": false,
      "actorId": "",
      "groupId": "",
      "teamId": "",
      "targetId": "",
      "viewLogAction": "",
    },
  });
