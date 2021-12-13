const client = require("./client");

const {
  createPayer,
  getAllPayers,
  createTransaction,
  getAllActiveTransactions,
} = require("./index");
const { updatePayer } = require("./payers");

async function dropTables() {
  try {
    console.log("Dropping tables...");
    await client.query(`
            DROP TABLE IF EXISTS transactions;
            DROP TABLE IF EXISTS payers;
        `);
    console.log("Finished dropping tables.");
  } catch (error) {
    throw error;
  }
}

async function buildTables() {
  try {
    console.log("Building tables...");
    await client.query(`
            CREATE TABLE payers(
                id SERIAL PRIMARY KEY,
                payer VARCHAR(255) UNIQUE NOT NULL,
                points INTEGER
            );
            CREATE TABLE transactions(
                id SERIAL PRIMARY KEY,
                payer VARCHAR(255) REFERENCES payers (payer),
                "activePoints" INTEGER DEFAULT 0,
                "spentPoints" INTEGER DEFAULT 0,
                timestamp TIMESTAMP(0) DEFAULT current_timestamp
            );
        `);
    console.log("Finished building tables.");
  } catch (error) {
    throw error;
  }
}

async function createInitialPayers() {
  try {
    const initialPayers = [
      { payer: "DANNON" },
      { payer: "UNILEVER" },
      { payer: "MILLER COORS" },
    ];
    await Promise.all(
      initialPayers.map((payer) => {
        createPayer(payer);
      })
    );
  } catch (error) {
    throw error;
  }
}

async function createInitialTransactions() {
  try {
    const initialTransactions = [
      { payer: "DANNON", activePoints: 300 },
      { payer: "UNILEVER", activePoints: 50 },
      {
        payer: "MILLER COORS",
        activePoints: 500,
        timestamp: "2020-11-02T14:00:000Z",
      },
      { payer: "DANNON", activePoints: 200 },
      { payer: "MILLER COORS", activePoints: 30 },
    ];
    await Promise.all(
      initialTransactions.map((transaction) => {
        createTransaction(transaction);
        updatePayer({
          payer: transaction.payer,
          points: transaction.activePoints,
        });
      })
    );
  } catch (error) {
    throw error;
  }
}

async function testDatabase() {
  try {
    console.log("Initializing database tests...");

    console.log("Calling getAllActiveTransactions...");
    const transactions = await getAllActiveTransactions();
    console.log("Results: ", transactions);

    console.log("Calling getAllPayers...");
    const payers = await getAllPayers();
    console.log("Results: ", payers);

    console.log("Finished testing database.");
  } catch (error) {
    throw error;
  }
}

async function rebuildDatabase() {
  try {
    await client.connect();
    await dropTables();
    await buildTables();
    await createInitialPayers();
    await createInitialTransactions();
    await testDatabase();
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

rebuildDatabase();
