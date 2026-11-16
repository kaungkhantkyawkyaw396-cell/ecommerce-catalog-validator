# E-Commerce Catalog Validator Service

A beginner-friendly Express HTTP server for validating catalog item data.

## Requirements
- Node.js (LTS version)
- Postman

## Run the project
1. Extract this ZIP file.
2. Open the extracted `catalog-validator-service` folder in VS Code.
3. Open Terminal in VS Code.
4. Run `npm install`.
5. Run `npm start`.
6. Keep the terminal open. The server runs at `http://localhost:3000`.

## API endpoint
- Method: `POST`
- URL: `http://localhost:3000/api/catalog/items`
- Header: `Content-Type: application/json`

### Required payload
- `sku`: 3-20 characters; uppercase letters, numbers, and hyphens only.
- `price`: number greater than 0.
- `tags`: array with at least one unique, non-empty string.
- `vendor.name`: required non-empty string.
- `vendor.email`: valid email address.

A valid item returns HTTP `201`. Invalid item data returns HTTP `422` with an `errors` array.

## Postman collection
Import `Catalog_Validator_Postman_Collection.json` into Postman. It contains:
1. Valid item (expected 201)
2. Invalid SKU (expected 422)
3. Invalid price (expected 422)
4. Empty tags array (expected 422)
5. Missing vendor details (expected 422)

Run each request using the local server. The collection includes basic status-code tests.

## GitHub submission
Create a GitHub repository, upload `server.js`, `package.json`, `package-lock.json` (created after `npm install`), and `README.md`, then submit the repository URL and exported Postman collection on Google Classroom.
