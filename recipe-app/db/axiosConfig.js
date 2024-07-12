import axios from "axios";

const httpClient = axios.create();

// adds access tokens in all api requests
// this interceptor is only added when the auth0 instance is ready and exports the getAccessTokenSilently method
export async function addAccessTokenInterceptor({
  getAccessTokenSilently,
  isAuthenticated,
}) {
  httpClient.interceptors.request.use(async (config) => {
    let token;
    if (isAuthenticated) {
      token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export default httpClient;
