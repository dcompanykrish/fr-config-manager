const utils = require("./utils.js");
const fs = require("fs");
const axios = require("axios");
const { saveJsonToFile } = utils;

const ENDPOINT_SUBDIR = "endpoints";
const ENDPOINT_CONFIG_FILENAME = "endpoint-config.json";
const SCRIPT_CONTENT_SUBDIR = "scripts-content";

function processEndpoints(endpoints, fileDir, name) {
  try {
    endpoints.forEach((endpoint) => {
      const endpointName = endpoint._id.split("/")[1];

      if (name && name !== endpointName) {
        return;
      }
      const endpointDir = `${fileDir}/${endpointName}`;
      if (!fs.existsSync(endpointDir)) {
        fs.mkdirSync(endpointDir, { recursive: true });
      }

      const scriptFilename = `${endpointName}.js`;
      fs.writeFileSync(`${endpointDir}/${scriptFilename}`, endpoint.source);
      delete endpoint.source;
      endpoint.file = `${scriptFilename}`;
      const endpointFilename = `${endpointDir}/${endpointName}.json`;
      saveJsonToFile(endpoint, endpointFilename);
    });
  } catch (err) {
    console.error(err);
  }
}

async function exportEndpoints(exportDir, tenantUrl, name, token) {
  try {
    const idmEndpoint = `${tenantUrl}/openidm/config`;

    const endpointsResponse = await axios({
      method: "get",
      url: idmEndpoint,
      // Query filter taken from UI
      params: {
        _queryFilter:
          '!(file pr) and _id sw "endpoint" and !(context sw "util") and !(_id eq "endpoint/linkedView")',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const endpoints = endpointsResponse.data.result;

    const fileDir = `${exportDir}/${ENDPOINT_SUBDIR}`;
    processEndpoints(endpoints, fileDir, name);
  } catch (err) {
    console.log(err);
  }
}

module.exports.exportEndpoints = exportEndpoints;
