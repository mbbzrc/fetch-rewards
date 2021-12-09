const { client } = require("./client");

const { createTransaction, getAllTransactions } = require("./transactions.js");

async function dropTables() {
  try {
    console.log("Dropping tables...");
    await client.query(`
            DROP TABLE IF EXISTS transactions;
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
            CREATE TABLE transactions(
                id SERIAL PRIMARY KEY,
                payer VARCHAR(255) NOT NULL,
                points INTEGER NOT NULL,
                timestamp DATE DEFAULT CURRENT_DATE NOT NULL
            );
        `);
    console.log("Finished building tables.");
  } catch (error) {
    throw error;
  }
}

async function createInitialTransactions() {
  try {
    const initialTransactions = [
      { payer: "TestPayer01", points: 200 },
      { payer: "TestPayer02", points: 0 },
      { payer: "TestPayer03", points: 50000 },
    ];
    await Promise.all(
      initialTransactions.map((transaction) => {
        createTransaction(transaction);
      })
    );
  } catch (error) {
    throw error;
  }
}

async function testDatabase() {
  try {
    console.log("Initializing database tests...");

    console.log("Calling getAllTransactions...");
    const transactions = await getAllTransactions();
    console.log("Results: ", transactions);

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
    await createInitialTransactions();
    await testDatabase();
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

rebuildDatabase();
