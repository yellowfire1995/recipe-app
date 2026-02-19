import axios from "axios";
import logger from "../src/utils/logger";

const httpClient = axios.create();

// adds access tokens in all api requests
// this interceptor is only added when the auth0 instance is ready and exports the getAccessTokenSilently method
export async function addAccessTokenInterceptor({
  getAccessTokenSilently,
  isAuthenticated,
}) {
  httpClient.interceptors.request.use(async (config) => {
    let token;
    try {
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      logger.log(error);
    }
    return config;
  });
}

export default httpClient;
