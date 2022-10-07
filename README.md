# Example of a language-oriented approach

View the [tailored example](./example/automobile-tailored.yml) to see an API design using a tailored API description language (ADL), then view the [generated OpenAPI document](./example/automobile-openapi.yml), which is built using the code in [index.js](./index.js).

## What's happening here?

This is an example of a language-oriented approach to API design. Instead of starting with a universal ADL OpenAPI, an organization creates a tailored ADL and generates OpenAPI documents from it. In this example, the API is an automobile API, and it's design is captured in the tailored ADL.

This example shows how a tailored ADL can allow people to focus on the API details that are unique to the API and let tooling generate an OpenAPI document that uses the patterns agreed upon by an organization.

This is a minimal example. We could add code that could include error responses and schemas or support more operation types like updating and deleting items. Each feature could capture the approach the organization uses to design APIs and hide all the technical details. The tailored ADL itself is also minimal, not allowing for all the features you'd expect from defining schemas. This shows how organizations can add just enough language into their tailored ADL to help put guardrails around how people design APIs.