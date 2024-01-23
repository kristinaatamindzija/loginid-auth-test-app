This example demonstrates user authentication relying on LoginID SDK.

# Setup 
Acquire a tenant base URL and application ID by creating a new tenant. The default website URL is set to http://localhost:3000. If you wish to modify the port, you can specify the website URL as http://localhost:<PORT>.

# .env
Generate a .env file and place it at the root of the example. Alternatively, you can utilize the provided example.env file by renaming it to .env. Ensure that it is populated with the relevant variables.

PORT is optional and will default to 3000 if not provided.

LOGINID_APP_ID=<APPLICATION_ID>
LOGINID_BASE_URL=<TENANT_BASE_URL>
PORT=<PORT>

# How to Run
You can run either with NPM
The following commands will install the dependencies and run the example in dev mode.

npm install
npm run dev

