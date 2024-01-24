## LOGINID-AUTH-TEST-APP

This example demonstrates user authentication relying on LoginID [API](https://docs.loginid.io/next/api).

## Setup 
Acquire a tenant base URL and application ID by creating a new [tenant](https://docs.loginid.io/Guides/Creating%20a%20New%20Tenant/). The default website URL is set to http://localhost:3000.

## .env
Generate a .env file and place it at the root of the example. Alternatively, you can utilize the provided example.env file by renaming it to .env. Ensure that it is populated with the relevant variables.

PORT is optional and will default to 3000 if not provided.

LOGINID_APP_ID= <APPLICATION_ID>

LOGINID_BASE_URL= <TENANT_BASE_URL>


## How to Run
You can run either with NPM
The following commands will install the dependencies and run the example in dev mode.

npm install

npm run dev

