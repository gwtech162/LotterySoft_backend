## Authentication API

The Authentication API allows users to sign up, sign in, and sign out.

### Base URL

```
/api/auth
```
### Sign In

Authenticate a user and generate an access token.

- URL: `/signin`
- Method: `POST`
- Request Body:
  - `userName` (string, required): The username of the user.
  - `password` (string, required): The password of the user.

- Response:
  - Success: Status 200 OK. Returns an object with the following properties:
    - `success` (boolean): A boolean indicating the success of the sign-in process.
    - `user` (object): The user object.
    - `token` (string): The access token.
  - Error: Status 500 Internal Server Error. Returns an error message in the response body.

### Sign Out

Invalidate the current session and sign out the user.

- URL: `/signout`
- Method: `POST`

- Response:
  - Success: Status 200 OK. Returns an object with the following properties:
    - `success` (boolean): A boolean indicating the success of the sign-out process.
    - `message` (string): A message indicating that the user has been signed out.
  - Error: Status 500 Internal Server Error. Returns an error message in the response body.

  
# Admin

## Create a Lottery Category

**Endpoint:** `POST /api/admin/addlotterycategory`

Creates a new lottery category.

**Request Body:**
```json
{
  "lotteryName": "Example Lottery",
  "startTime": "2023-07-20T16:00:00.000Z",
  "endTime": "2023-07-20T18:00:00.000Z"
}
```

- `lotteryName` (string, required): The name of the lottery category.
- `startTime` (string, optional): The start time of the lottery category.
- `endTime` (string, optional): The end time of the lottery category.

**Response:**
- Status Code: 201 (Created)
- Body:
```json
{
  "_id": "60f6a3c6c3e5a61f7c1a2b79",
  "lotteryName": "Example Lottery",
  "startTime": "2023-07-20T16:00:00.000Z",
  "endTime": "2023-07-20T18:00:00.000Z",
  "createdAt": "2023-07-20T16:00:00.000Z",
  "updatedAt": "2023-07-20T16:00:00.000Z"
}
```

---

## Read Lottery Categories

**Endpoint:** `GET /api/admin/getlotterycategory`

Retrieves all lottery categories.

**Response:**
- Status Code: 200 (OK)
- Body:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f6a3c6c3e5a61f7c1a2b79",
      "lotteryName": "Example Lottery",
      "startTime": "2023-07-20T16:00:00.000Z",
      "endTime": "2023-07-20T18:00:00.000Z",
      "createdAt": "2023-07-20T16:00:00.000Z",
      "updatedAt": "2023-07-20T16:00:00.000Z"
    },
    {
      "_id": "60f6a3c6c3e5a61f7c1a2b7a",
      "lotteryName": "Another Lottery",
      "startTime": "2023-07-20T19:00:00.000Z",
      "endTime": "2023-07-20T21:00:00.000Z",
      "createdAt": "2023-07-20T16:00:00.000Z",
      "updatedAt": "2023-07-20T16:00:00.000Z"
    }
  ]
}
```

---

## Update a Lottery Category

**Endpoint:** `PATCH /api/admin/updatelotterycategory/:id`

Updates an existing lottery category.

**Request Parameters:**
- `id` (string, required): The ID of the lottery category to update.

**Request Body:**
```json
{
  "lotteryName": "Updated Lottery",
  "startTime": "2023-07-20T16:30:00.000Z",
  "endTime": "2023-07-20T18:30:00.000Z"
}
```

- `lotteryName` (string, optional): The updated name of the lottery category.
- `startTime` (string, optional): The updated start time of the lottery category.
- `endTime` (string, optional): The updated end time of the lottery category.

**Response:**
- Status Code: 200 (OK)
- Body:
```json
{
  "_id": "60f6a3c6c3e5a61f7c1a2b79",
  "lotteryName": "Updated Lottery",
  "startTime": "2023-07-20T16:30:00.000Z",
  "endTime": "2023-07-20T18:30:00.000Z",
  "createdAt": "2023-07-20T16:00:00.000Z",
  "updatedAt": "2023-07-20T16:30:00.000Z"
}
```

---

## Delete a Lottery Category

**Endpoint:** `DELETE /api/admin/deletelotterycategory/:id`

Deletes a lottery category.

**Request Parameters:**
- `id` (string, required): The ID of the lottery category to delete.

**Response:**
- Status Code: 200 (OK)
- Body:
```json
{
  "message": "Category deleted"
}
```

## Sub-Admin API


## Add Sub Admin

- Method: POST
- Endpoint: `/api/admin/addsubadmin`
- Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`, `verifySignUp.checkDuplicateuserName`
- Description: Adds a sub-admin user to the system.
- Request Body:
  - `userName` (required): The username of the sub-admin.
  - `password` (required): The password of the sub-admin.
- Response:
  - Status: 201 (Created)
  - Body: The created sub-admin user object.
    - `id`: The ID of the sub-admin user.
    - `userName`: The username of the sub-admin.
    - `role`: The role of the sub-admin (set to "subAdmin").
    - `managerId`: The ID of the admin user who created the sub-admin.

## Get Sub Admin

- Method: GET
- Endpoint: `/api/admin/getsubadmin`
- Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
- Description: Retrieves a list of sub-admin users for the authenticated admin user.
- Response:
  - Status: 200 (OK)
  - Body: An array of sub-admin user objects.
    - `id`: The ID of the sub-admin user.
    - `userName`: The username of the sub-admin.
    - `role`: The role of the sub-admin (set to "subAdmin").
    - `managerId`: The ID of the admin user who created the sub-admin.

## Update Sub Admin

- Method: PATCH
- Endpoint: `/api/admin/updatesubadmin/:id`
- Middleware: `authJwt.verifyToken`, `verifySignUp.checkDuplicateuserName`, `authJwt.isAdmin`
- Description: Updates the details of a sub-admin user.
- Request Parameters:
  - `id`: The ID of the sub-admin user to update.
- Request Body (optional):
  - `userName`: The new username for the sub-admin.
  - `password`: The new password for the sub-admin.
- Response:
  - Status: 200 (OK)
  - Body: The updated sub-admin user object.
    - `id`: The ID of the sub-admin user.
    - `userName`: The updated username of the sub-admin.
    - `role`: The role of the sub-admin (set to "subAdmin").
    - `managerId`: The ID of the admin user who created the sub-admin.

## Delete Sub Admin

- Method: DELETE
- Endpoint: `/api/admin/deletesubadmin/:id`
- Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
- Description: Deletes a sub-admin user.
- Request Parameters:
  - `id`: The ID of the sub-admin user to delete.
- Response:
  - Status: 200 (OK)
  - Body: The deleted sub-admin user object.
    - `id`: The ID of the deleted sub-admin user.
    - `userName`: The username of the deleted sub-admin.
    - `role`: The role of the sub-admin (set to "subAdmin").
    - `managerId`: The ID of the admin user who created the sub-admin.

Certainly! Here's an updated version of the API documentation with more details on the request and response formats:

## Winning Number API

### Authentication

All endpoints in this API require authentication. You need to include a valid JWT token in the `Authorization` header of your requests.

### Error Responses

If an error occurs while processing a request, the API will respond with an appropriate HTTP status code and an error message in the response body.

#### Example Error Response

```json
{
  "message": "Error message"
}
```

### Endpoints

#### Create a Winning Number

```
POST /api/admin/addwiningnumber
```

This endpoint allows you to create a new winning number.

**Request Body:**

```json
{
  "lotteryCategoryName": "Category Name",
  "date": "2023-07-20",
  "numbers": [1, 2, 3, 4, 5]
}
```

- `lotteryCategoryName` (String): Name of the lottery category.
- `date` (Date): Date of the winning number.
- `numbers` (Array): Array of winning numbers.

**Response:**

If successful, the API will respond with the created winning number.

```json
{
  "id": "123456",
  "lotteryCategoryName": "Category Name",
  "date": "2023-07-20",
  "numbers": [1, 2, 3, 4, 5]
}
```

#### Get Winning Numbers by Date

```
GET /api/admin/getwiningnumber/:date
```

This endpoint allows you to retrieve the winning numbers for a specific date.

**Parameters:**

- `date` (String): The date in the format "YYYY-MM-DD".

**Response:**

If successful, the API will respond with the winning numbers for the specified date.

```json
{
  "winningNumbers": [
    {
      "id": "123456",
      "lotteryCategoryName": "Category Name",
      "date": "2023-07-20",
      "numbers": [1, 2, 3, 4, 5]
    }
  ]
}
```

#### Get Winning Numbers

```
POST /api/admin/getwiningnumber
```

This endpoint allows you to retrieve the winning numbers within a date range.

**Request Body:**

```json
{
  "lotteryCategoryName": "Category Name",
  "fromDate": "2023-07-01",
  "toDate": "2023-07-31"
}
```

- `lotteryCategoryName` (String): Name of the lottery category.
- `fromDate` (Date): Start date of the range.
- `toDate` (Date): End date of the range.

**Response:**

```json
{
  "winningNumbers": [
    {
      "id": "123456",
      "lotteryCategoryName": "Category Name",
      "date": "2023-07-20",
      "numbers": [1, 2, 3, 4, 5]
    },
    {
      "id": "789012",
      "lotteryCategoryName": "Category Name",
      "date": "2023-07-25",
      "numbers": [6, 7, 8, 9, 10]
    }
  ]
}
```

#### Update a Winning Number

```
PATCH /api/admin/updatewiningnumber/:id
```

This endpoint allows you to update a winning number.

**Parameters:**

- `id` (String): The ID of the winning number.

**Request Body:**

```json
{
  "lotteryCategoryName": "New Category Name",
  "date": "2023-07-20",
  "numbers": [11, 12, 13, 14, 15]
}
```

- `lotteryCategoryName` (String): Name of the lottery category.
- `date` (Date): Date of the winning number.
- `numbers` (Array): Array of winning numbers.

**Response:**

If successful, the API will respond with the updated winning number.

```json
{
  "id": "123456",
  "lotteryCategoryName": "New Category Name",
  "date": "2023-07-20",
  "numbers": [11, 12, 13, 14, 15]
}
```

#### Delete a Winning Number

```
DELETE /api/admin/deletewiningnumber/:id
```

This endpoint allows you to delete a winning number.

**Parameters:**

- `id` (String): The ID of the winning number.

**Response:**

If successful, the API will respond with a success message indicating that the winning number has been deleted.

```json
{
  "message": "Winning number with ID 123456 has been deleted."
}
```

# SubAdmin

## Add Seller

- URL: `/api/subadmin/addseller`
- Method: `POST`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`, `verifySignUp.checkDuplicateuserName`
- Request Body:
  - `username` (string, required): The username of the seller.
  - `password` (string, required): The password of the seller.
  - Other seller fields...
- Response:
  - Status Code: 201 (Created)
  - Body: The created seller object.

## Get Sellers

- URL: `/api/subadmin/getseller`
- Method: `GET`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Response:
  - Status Code: 200 (OK)
  - Body: An object with the following properties:
    - `success` (boolean): Indicates if the operation was successful.
    - `users` (array): An array of seller objects.
    - `companyName` (string): The company name of the subadmin.

## Update Seller

- URL: `/api/subadmin/updateseller/:id`
- Method: `PATCH`
- Middleware: `authJwt.verifyToken`, `verifySignUp.checkDuplicateuserName`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the seller to be updated.
- Request Body:
  - Updated seller fields...
- Response:
  - Status Code: 200 (OK)
  - Body: The updated seller object.

## Delete Seller

- URL: `/api/subadmin/deleteseller/:id`
- Method: `DELETE`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the seller to be deleted.
- Response:
  - Status Code: 200 (OK)
  - Body: The deleted seller object.

const db = require("../../models");
const BlockNumber = db.blockNumber;

Here's the API documentation for the Sub-Admin Block Number routes:

## Add Block Number

- URL: `/api/subadmin/blocknumbers`
- Method: `POST`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Body:
  - `lotteryCategoryName` (string, required): The name of the lottery category.
  - `gameCategory` (string, required): The game category.
  - `number` (string, required): The block number.
- Response:
  - Status Code: 201 (Created)
  - Body: The created block number object.

## Get Block Numbers

- URL: `/api/subadmin/blocknumbers`
- Method: `GET`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Response:
  - Status Code: 200 (OK)
  - Body: An array of block number objects.

## Update Block Number

- URL: `/api/subadmin/blocknumbers/:id`
- Method: `PATCH`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the block number to be updated.
- Request Body:
  - `lotteryCategoryName` (string): The updated name of the lottery category.
  - `gameCategory` (string): The updated game category.
  - `number` (string): The updated block number.
- Response:
  - Status Code: 200 (OK)
  - Body: The updated block number object.

## Delete Block Number

- URL: `/api/subadmin/blocknumbers/:id`
- Method: `DELETE`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the block number to be deleted.
- Response:

  - Status Code: 200 (OK)
  - Body: An object with the message "Block number removed".

  Here's the API documentation for the Sub-Admin LimitBut routes:

## Add LimitBut

- URL: `/api/subadmin/limitbuts`
- Method: `POST`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Body:
  - `lotteryCategoryName` (string, required): The name of the lottery category.
  - `gameCategory` (string, required): The game category.
  - `limitsButs` (array, required): An array of limitBut objects.
  - `gameNumber` (string, required): The game number.
- Response:
  - Status Code: 201 (Created)
  - Body: The created LimitBut object.

## Get LimitButs

- URL: `/api/subadmin/limitbuts`
- Method: `GET`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Response:
  - Status Code: 200 (OK)
  - Body: An array of LimitBut objects.

## Update LimitBut

- URL: `/api/subadmin/limitbuts/:id`
- Method: `PATCH`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the LimitBut to be updated.
- Request Body:
  - `lotteryCategoryName` (string): The updated name of the lottery category.
  - `gameCategory` (string): The updated game category.
  - `limitsButs` (array): The updated array of limitBut objects.
  - `gameNumber` (string): The updated game number.
- Response:
  - Status Code: 200 (OK)
  - Body: The updated LimitBut object.

## Delete LimitBut

- URL: `/api/subadmin/limitbuts/:id`
- Method: `DELETE`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the LimitBut to be deleted.
- Response:
  - Status Code: 200 (OK)
  - Body: An object with the message "Limit removed".

  Here's the API documentation for the Sub-Admin Payment Term routes:

## Add Payment Term

- URL: `/api/subadmin/paymentterms`
- Method: `POST`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Body:
  - `lotteryCategoryName` (string, required): The name of the lottery category.
  - `conditions` (object, required): The payment term conditions.
- Response:
  - Status Code: 200 (OK) or 400 (Bad Request)
  - Body: The created PaymentTerm object or an error message if the payment term already exists.

## Read Payment Terms

- URL: `/api/subadmin/paymentterms`
- Method: `GET`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Response:
  - Status Code: 200 (OK)
  - Body: An array of PaymentTerm objects.

## Update Payment Term

- URL: `/api/subadmin/paymentterms/:id`
- Method: `PUT`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the PaymentTerm to be updated.
- Request Body:
  - `lotteryCategoryName` (string): The updated name of the lottery category.
  - `conditions` (object): The updated payment term conditions.
- Response:
  - Status Code: 200 (OK)
  - Body: The updated PaymentTerm object.

## Delete Payment Term

- URL: `/api/subadmin/paymentterms/:id`
- Method: `DELETE`
- Middleware: `authJwt.verifyToken`, `authJwt.isSubAdmin`
- Request Parameters:
  - `id` (string, required): The ID of the PaymentTerm to be deleted.
- Response:
  - Status Code: 200 (OK)
  - Body: The deleted PaymentTerm object.

  Sure! Here's an API documentation for the provided code:

## Reports API

This API allows sub-admin users to generate and retrieve various reports related to ticket sales.

### Get Sale Reports

Retrieves the sale reports for a sub-admin within a specified date range.

- **URL:** `/api/subadmin/getsalereports`
- **Method:** GET
- **Authentication:** Requires a valid JWT token in the request headers.
- **Parameters:**
  - `fromDate` (optional): The start date of the report range in the format `YYYY-MM-DD`.
  - `toDate` (optional): The end date of the report range in the format `YYYY-MM-DD`.
  - `lotteryCategoryName` (optional): The name of the lottery category for filtering the report.
  - `seller` (optional): The ID of the seller for filtering the report.
- **Response:**
  - `success`: Boolean indicating the success of the request.
  - `data`: An object containing the sale reports grouped by seller.
    - `name`: The name of the seller.
    - `sum`: The total sum of ticket amounts for the seller.
    - `paid`: The total amount paid to the seller based on winning numbers and payment terms.

### Get Sell Details

Retrieves the details of ticket sales for a specific date and lottery category.

- **URL:** `/api/sbuadmin/getselldetails`
- **Method:** GET
- **Authentication:** Requires a valid JWT token in the request headers.
- **Parameters:**
  - `fromDate` (required): The date of the sales details in the format `YYYY-MM-DD`.
  - `lotteryCategoryName` (optional): The name of the lottery category for filtering the report.
  - `seller` (optional): The ID of the seller for filtering the report.
- **Response:**
  - `success`: Boolean indicating the success of the request.
  - `data`: An array of objects containing the sell details.
    - `_id`: An object containing the details of the sell.
      - `lotteryCategoryName`: The name of the lottery category.
      - `date`: The date of the sell.
      - `gameCategory`: The category of the game.
      - `number`: The game number.
    - `count`: The count of tickets sold for the specific sell details.
    - `totalAmount`: The total amount of tickets sold for the specific sell details.

Here are two additional controller functions for the reports API:

### Get Sell Details by Game Category

Retrieves the sell details grouped by game category for a specific date and lottery category.

- **URL:** `/api/sbuadmin/getselldetailsbygamecategory`
- **Method:** GET
- **Authentication:** Requires a valid JWT token in the request headers.
- **Parameters:**
  - `fromDate` (required): The date of the sales details in the format `YYYY-MM-DD`.
  - `lotteryCategoryName` (optional): The name of the lottery category for filtering the report.
  - `seller` (optional): The ID of the seller for filtering the report.
- **Response:**
  - `success`: Boolean indicating the success of the request.
  - `data`: An array of objects containing the sell details grouped by game category.
    - `_id`: An object containing the details of the sell.
      - `lotteryCategoryName`: The name of the lottery category.
      - `gameCategory`: The category of the game.
    - `totalAmount`: The total amount of tickets sold for the specific sell details.
- **Error Response:**
  - `success`: Boolean indicating the success of the request (false in case of an error).
  - `error`: Error message describing the encountered error.

### Get Sell Details for All Lottery Categories

Retrieves the sell details for all lottery categories for a specific date.

- **URL:** `/api/sbuadmin/getselldetailsallloterycategory`
- **Method:** GET
- **Authentication:** Requires a valid JWT token in the request headers.
- **Parameters:**
- `fromDate` (required): The date of the sales details in the format `YYYY-MM-DD`.
  - `seller` (optional): The ID of the seller for filtering the report.
- **Response:**
  - `success`: Boolean indicating the success of the request.
  - `data`: An object containing the sell details for all lottery categories.
    - Each key in the object represents a lottery category name.
    - Each value in the object is an object containing the sum and paid amounts for that lottery category.
      - `name`: The name of the lottery category.
      - `sum`: The total sum of ticket amounts for the lottery category.
      - `paid`: The total paid amount for the lottery category.
- **Error Response:**
  - `success`: Boolean indicating the success of the request (false in case of an error).
  - `error`: Error message describing the encountered error.

Here's another controller function for the reports API:

### Get Sell Game Number Info

Retrieves detailed sell information for a specific game number in a lottery category and game category.

- **URL:** `/api/sbuadmin/getsellgamenumberinfo`
- **Method:** GET
- **Authentication:** Requires a valid JWT token in the request headers.
- **Parameters:**
  - `lotteryCategoryName` (required): The name of the lottery category.
  - `gameCategory` (required): The category of the game.
  - `gameNumber` (required): The game number.
  - `fromDate` (required): The date of the sales details in the format `YYYY-MM-DD`.
  - `seller` (optional): The ID of the seller for filtering the report.
- **Response:**
  - `success`: Boolean indicating the success of the request.
  - `data`: An object containing the detailed sell information.
    - Each key in the object represents a seller ID.
    - Each value in the object is an object containing the sell details for that seller.
      - `sum`: The total sum of ticket amounts for the specific game number.
      - `name`: The name of the seller.
      - `company`: The name of the seller's company.
      - `ticketCount`: The number of tickets sold for the specific game number.
  - `limitInfo`: An array containing the limit information for the specific game number. (Optional)
- **Error Response:**
  - `success`: Boolean indicating the success of the request (false in case of an error).
  - `error`: Error message describing the encountered error.

  Sure! Here's the API documentation for the ticket routes:

## Get Tickets

Retrieves

- **URL**: `/api/subadmin/gettickets`
- **Method**: GET
- **Auth Required**: Yes (Sub-admin)
- **Query Parameters**:
  - `fromDate` (optional): Start date for filtering tickets.
  - `toDate` (optional): End date for filtering tickets.
  - `lotteryCategoryName` (optional): Lottery category name for filtering tickets.
  - `seller` (optional): Seller ID for filtering tickets. If empty, retrieves tickets associated with the sub-admin's sellers.
- **Response**:
  - `success`: Indicates if the request was successful.
  - `data`: Array of ticket objects that match the query parameters.

## Get Winning Tickets

Retrieves tickets that match the winning numbers based on the provided query parameters.

- **URL**: `/api/subadmin/getwintickets`
- **Method**: GET
- **Auth Required**: Yes (Sub-admin)
- **Query Parameters**:
  - `fromDate` (required): Start date for filtering tickets.
  - `toDate` (required): End date for filtering tickets.
  - `lotteryCategoryName` (optional): Lottery category name for filtering tickets.
  - `seller` (optional): Seller ID for filtering tickets. If empty, retrieves tickets associated with the sub-admin's sellers.
- **Response**:
  - `success`: Indicates if the request was successful.
  - `data`: Array of ticket objects that match the winning numbers.

## Delete Ticket

Deletes a ticket by its ID.

- **URL**: `/api/subadmin/deleteticket/:id`
- **Method**: DELETE
- **Auth Required**: Yes (Sub-admin)
- **URL Parameters**:
  - `id`: ID of the ticket to be deleted.
- **Response**:
  - `message`: Indicates the result of the deletion operation.

## Get Winning Numbers

Retrieves winning numbers based on the provided query parameters.

- **URL**: `/api/subadmin/getwiningnumber`
- **Method**: POST
- **Auth Required**: Yes (Sub-admin)
- **Request Body**:
  - `lotteryCategoryName` (optional): Lottery category name for filtering winning numbers.
  - `fromDate` (required): Start date for filtering winning numbers.
  - `toDate` (required): End date for filtering winning numbers.
- **Response**:
  - `success`: Indicates if the request was successful.
  - `data`: Array of winning number objects that match the query parameters. Each object contains the following properties:
    - `date`: Date of the winning numbers.
    - `lotteryName`: Name of the lottery category.
    - `numbers`: Object containing the winning numbers for different game categories. The properties vary based on the game category:
      - `second` (optional): Winning number for the second position in the "BLT" game category.
      - `third` (optional): Winning number for the third position in the "BLT" game category.
      - `l3c` (optional): Winning number for the "L3C" game category.

# seller

## Sign In

- **Endpoint:** POST /api/seller/signin
- **Description:** Authenticates a seller by validating the provided credentials.
- **Request Body:**
  - `imei` (string, required): The IMEI number of the seller.
  - `password` (string, required): The password of the seller.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "user": {
        // Seller user object
      },
      "subadmin": {
        // Subadmin user object
      },
      "token": "JWT token"
    }
    ```
- **Error Responses:**
  - Status Code: 200
  - Response Body:
    - User not found:
      ```json
      {
        "success": false,
        "message": "User not found!"
      }
      ```
    - User locked:
      ```json
      {
        "success": false,
        "message": "This user is locked now!"
      }
      ```
    - Subadmin locked:
      ```json
      {
        "success": false,
        "message": "Your subAdmin is locked! So you can't login now!"
      }
      ```
    - Invalid password:
      ```json
      {
        "success": false,
        "message": "Invalid password!"
      }
      ```
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

## Sign Out

- **Endpoint:** POST /api/seller/signout
- **Description:** Signs out the currently authenticated seller.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "message": "You've been signed out!"
    }
    ```
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

## Create New Ticket

- **Endpoint:** POST /api/seller/newticket
- **Description:** Creates a new ticket for the seller.
- **Request Body:**
  - `lotteryCategoryName` (string, required): The name of the lottery category for the ticket.
  - `sellerId` (string, required): The ID of the seller.
  - `numbers` (array, required): An array of numbers for the ticket.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "message": "success",
      "ticketId": "newTicketId"
    }
    ```
- **Error Responses:**
  - Status Code: 200
  - Response Body:
    - Ticket creation failed:
      ```json
      {
        "success": false,
        "message": "new ticket create failed! please try again!"
      }
      ```
    - Time is up:
      ```json
      {
        "success": false,
        "message": "Haiti local time now: currentTime. \n Time is up!. Sorry, you can't create a ticket."
      }
      ```
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

## Get Tickets

- **Endpoint:** GET /api/seller/gettickets
- **Description:** Retrieves all tickets for the seller.
- **Query Parameters:**
  - `fromDate` (string, optional): The starting date to filter tickets (format: yyyy-MM-DD).
  - `toDate` (string, optional): The ending date to filter tickets (format: yyyy-MM-DD).
  - `lotteryCategoryName` (string, optional): The name of the lottery category to filter tickets.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "ticketId",
          "date": "ticketDate",
          "ticketId": "ticketId",
          "lotteryCategoryName": "lotteryCategoryName"
        },
        ...
      ]
    }
    ```
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```
## Get Ticket Numbers

- **Endpoint:** GET /api/seller/getticketnumbers
- **Description:** Retrieves the numbers of a specific ticket.
- **Query Parameters:**
  - `id` (string, required): The ID of the ticket.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "data": [1, 2, 3, ...]
    }
    ```
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

## Match Winning Numbers

- **Endpoint:** GET /api/seller/matchwinningnumbers
- **Description:** Retrieves the tickets that match the winning numbers within a specified date range and lottery category.
- **Query Parameters:**
  - `fromDate` (string, required): The starting date to filter tickets (format: yyyy-MM-DD).
  - `toDate` (string, required): The ending date to filter tickets (format: yyyy-MM-DD).
  - `lotteryCategoryName` (string, required): The name of the lottery category to filter tickets.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "data": [
        {
          "ticketId": "ticketId",
          "_id": "ticketId",
          "date": "ticketDate",
          "lotteryCategoryName": "lotteryCategoryName"
        },
        ...
      ]
    }
    ```
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

## Get Sale Reports for Seller

- **Endpoint:** GET /api/seller/salereports
- **Description:** Retrieves the sale reports for a seller within a specified date range and lottery category.
- **Query Parameters:**
  - `fromDate` (string, required): The starting date to filter sale reports (format: yyyy-MM-DD).
  - `toDate` (string, required): The ending date to filter sale reports (format: yyyy-MM-DD).
  - `lotteryCategoryName` (string, required): The name of the lottery category to filter sale reports.
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "data": {
        "sum": 1000,
        "paid": 500
      }
    }
    ```
  - `sum`: The total sum of amounts from all tickets sold by the seller within the specified date range and lottery category.
  - `paid`: The total amount paid to the seller based on the winning numbers and payment terms.
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```
## Read Winning Number

- **Endpoint:** GET /api/seller/winningnumber
- **Description:** Retrieves the winning numbers within a specified date range and lottery category.
- **Request Body:**
  - `lotteryCategoryName` (string, required): The name of the lottery category to filter winning numbers.
  - `fromDate` (string, required): The starting date to filter winning numbers (format: yyyy-MM-DD).
  - `toDate` (string, required): The ending date to filter winning numbers (format: yyyy-MM-DD).
- **Success Response:**
  - Status Code: 200
  - Response Body:
    ```json
    {
      "success": true,
      "data": [
        {
          "date": "2023-07-01",
          "lotteryName": "Lottery Category 1",
          "numbers": {
            "second": 123,
            "third": 456,
            "l3c": 789
          }
        },
        ...
      ]
    }
    ```
  - `date`: The date of the winning numbers.
  - `lotteryName`: The name of the lottery category.
  - `numbers`: The winning numbers, including the second, third, and l3c positions.
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

## Lottery Time Check

- **Endpoint:** GET /api/seller/lotterytimecheck
- **Description:** Checks if the current time is within the start and end time of a specified lottery.
- **Query Parameters:**
  - `lotId` (string, required): The ID of the lottery to check the time for.
- **Success Response:**
  - Status Code: 200
  - Response Body (if current time is within the lottery time):
    ```json
    {
      "success": true,
      "data": true,
      "time": "12:34",
      "startTime": "12:00",
      "endTime": "13:00"
    }
    ```
  - Response Body (if current time is not within the lottery time):
    ```json
    {
      "success": true,
      "data": false,
      "time": "14:00",
      "startTime": "12:00",
      "endTime": "13:00"
    }
    ```
  - `data`: Indicates if the current time is within the start and end time of the specified lottery (true/false).
  - `time`: The current time.
  - `startTime`: The start time of the specified lottery.
  - `endTime`: The end time of the specified lottery.
- **Error Response:**
  - Status Code: 500
  - Response Body:
    ```json
    {
      "success": false,
      "data": false
    }
    ```