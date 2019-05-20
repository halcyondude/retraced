import { getPgPool } from "../persistence/pg";
import { apiTokenFromAuthHeader } from "./helpers";
import getApiToken from "../models/api_token/get";
import { ApiToken } from "../models/api_token/index";

export default class Authenticator {

  public static default() {
    return new Authenticator();
  }

  public async getApiTokenOr401(authorization: string, projectId: string): Promise<ApiToken> {
    const apiTokenId = apiTokenFromAuthHeader(authorization);
    const apiToken = await getApiToken(apiTokenId);
    if (!apiToken || apiToken.projectId !== projectId || apiToken.disabled) {
      throw { status: 401, err: new Error("Unauthorized") };
    }

    return apiToken;
  }
}
