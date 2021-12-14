# Reward Points Keeper Web Service

This is a RESTful web service that uses Node.js with Express and a PostgreSQL database. Users can log transactions submitted with associated payer and rewards points, spend saved points, and query information on both saved and previously spent points.

## Setting Up the Server

For testing purposes, the server can be started locally as follows:

1. Download the project files;
2. [Install PostgreSQL](https://www.postgresql.org/download/) and create a database named "**fetch-rewards**";
3. From the project folder, use the command line to install npm. Then execute `npm run db:build` to create tables and populate the database with some seed entries. Finally, execute `npm run server:dev` to start the server.

Once the server is running, you can send HTTP requests.

## Routes and Responses

The development server runs on port 5000, so all requests to the API must begin with `http://localhost:5000/api`.

### GET Balance

GET `/balance` returns an array of objects representing a list of payers with the total balance of points for each. The totals reflect the active points associated with each payer in logged transactions.

#### Example

> http://localhost:5000/api/balance

```
[
    {
        "payer": "UNILEVER",
        "points": 50
    },
    {
        "payer": "DANNON",
        "points": 500
    },
    {
        "payer": "MILLER COORS",
        "points": 530
    }
]
```

### GET Transaction History

GET `/transaction-history` returns a complete list of transactions logged. Responses are returned in the order they were logged (by serial id), not by timestamp.

#### Example

> http://localhost:5000/api/transaction-history

```
[
    {
        "id": 1,
        "payer": "DANNON",
        "activePoints": 0,
        "spentPoints": 300,
        "timestamp": "2020-10-02T19:00:00.000Z"
    },
    {
        "id": 2,
        "payer": "UNILEVER",
        "activePoints": 0,
        "spentPoints": 50,
        "timestamp": "2021-02-02T21:00:00.000Z"
    },
    {
        "id": 3,
        "payer": "MILLER COORS",
        "activePoints": 490,
        "spentPoints": 10,
        "timestamp": "2019-12-02T21:00:00.000Z"
    },
]
```

### GET Active Transactions

GET `/active-transactions` returns a list of transactions with at least some active points. Transactions with no active points are excluded. Responses are ordered by timestamp, from oldest to newest.

#### Example

> http://localhost:5000/api/active-transactions

```
[
    {
        "id": 3,
        "payer": "MILLER COORS",
        "activePoints": 490,
        "spentPoints": 10,
        "timestamp": "2020-11-02T21:00:00.000Z"
    },
    {
        "id": 4,
        "payer": "DANNON",
        "activePoints": 200,
        "spentPoints": 0,
        "timestamp": "2021-02-02T17:30:00.000Z"
    },
    {
        "id": 5,
        "payer": "MILLER COORS",
        "activePoints": 30,
        "spentPoints": 0,
        "timestamp": "2021-12-13T17:21:40.000Z"
    }
]
```

### POST Transaction

POST `/transaction` receives a "payer" string and a "points" number in the body of the request and creates a transaction entry in the database.

#### Example

> http://localhost:5000/api/transaction

```
{
    "message": "Transaction added!",
    "transaction": {
        "id": 6,
        "payer": "YOPLAIT",
        "activePoints": 550,
        "spentPoints": 0,
        "timestamp": "2021-12-14T16:57:23.000Z"
    }
}
```

### PATCH Spend

PATCH `/spend` receives a "points" number to spend. It accesses all logged transactions with active points, from oldest to newest, and subtracts the spending points from each until the spending points are exhausted. If the number of points to spend exceeds the available active points in the database, an error message will be returned and no points will be spent.

#### Example 1

> http://localhost:5000/api/spend

Body of the HTTP request:

```
{
    "points":"180"
}
```

Response:

```
{
    "message": "Your points have been redeemed.",
    "pointsSpent": [
        {
            "payer": "DANNON",
            "points": -120
        },
        {
            "payer": "UNILEVER",
            "points": -50
        },
        {
            "payer": "MILLER COORS",
            "points": -10
        }
    ]
}
```

#### Example 2

```
{
    "name": "InsufficientPointsError",
    "message": "Insufficient points in your account!"
}
```
