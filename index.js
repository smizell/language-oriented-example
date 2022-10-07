const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const filename = "./example/automobile-tailored.yml";

const apiDetails = {
  title: "Automobile API",
  description: "Automobile API",
  version: "1.0.0",
};

main();

// --------------------------------------------------

function main() {
  const tailoredYaml = fs.readFileSync(filename, "utf-8");
  const tailored = YAML.parse(tailoredYaml);
  const openapi = generateOpenAPI(tailored);
  const output = YAML.stringify(openapi);
  console.log(output);
}

function generateOpenAPI(tailored) {
  const openapi = baseOpenAPI(apiDetails);
  buildSchemas(openapi, tailored);
  buildOperations(openapi, tailored);
  return openapi;
}

function baseOpenAPI(apiDetails) {
  return {
    openapi: "3.0.0",
    info: {
      title: apiDetails.title,
      version: apiDetails.version,
      description: `${apiDetails.description} [generated from code]`,
    },
    paths: {},
    components: {
      schemas: {},
    },
  };
}

function buildSchemas(openapi, tailored) {
  tailored.resources.forEach((resource) => {
    const collectionSchemaName = `${resource.name}-collection`;
    const itemSchemaName = `${resource.name}-item`;

    const itemProperties = Object.keys(resource.properties).reduce(
      (result, propertyName) => {
        const propertyType = resource.properties[propertyName];
        result[propertyName] = {
          type: propertyType,
        };
        return result;
      },
      {}
    );

    itemProperties["id"] = { type: "string" };

    openapi.components.schemas[itemSchemaName] = {
      type: "object",
      properties: itemProperties,
    };

    openapi.components.schemas[collectionSchemaName] = {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            $ref: `#/components/schemas/${itemSchemaName}`,
          },
        },
      },
    };
  });
}

function buildOperations(openapi, tailored) {
  tailored.resources.forEach((resource) => {
    const pluralResourceName = `${resource.name}s`;
    const idParameterName = `${resource.name}_id`;
    const collectionURL = `/${pluralResourceName}`;
    const itemUrl = `/${pluralResourceName}/{${idParameterName}}`;

    if (resource.operations.includes("list")) {
      ensurePathItem(openapi, collectionURL);

      openapi.paths[collectionURL]["get"] = {
        operationId: `list-${pluralResourceName}`,
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${resource.name}-collection`,
                },
              },
            },
          },
        },
      };
    }

    if (resource.operations.includes("retrieve")) {
      ensurePathItem(openapi, itemUrl);

      openapi.paths[itemUrl]["get"] = {
        operationId: `retrieve-${pluralResourceName}`,
        parameters: [
          {
            name: idParameterName,
            in: "path",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${resource.name}-item`,
                },
              },
            },
          },
        },
      };
    }
  });
}

function ensurePathItem(openapi, url) {
  if (!openapi.paths[url]) {
    openapi.paths[url] = {};
  }
}
