import axios from "axios";
import "dotenv/config";

const _ = process.env;

export default async function getManagementToken() {
  var options = {
    method: "POST",
    url: _.AUTH0_URL,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: _.AUTH0_CLIENT_ID,
      client_secret: _.AUTH0_CLIENT_SECRET,
      audience: _.AUTH0_AUDIENCE,
    }),
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
