const client = require("./client");

async function createTransaction(fields) {
  const insertColumns = Object.keys(fields)
    .map((key) => `"${key}"`)
    .join(", ");

  const insertValues = Object.keys(fields)
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  try {
    const {
      rows: [transaction],
    } = await client.query(
      `      
        INSERT INTO transactions (${insertColumns})
        VALUES (${insertValues})
        RETURNING *;
    `,
      Object.values(fields)
    );

    return transaction;
  } catch (error) {
    throw error;
  }
}

async function updateTransaction({ id, spendPoints }) {
  try {
    const {
      rows: [transaction],
    } = await client.query(
      `
      UPDATE transactions
      SET "activePoints" = "activePoints" - $2,
      "spentPoints" = "spentPoints" + $2
      WHERE id = $1
      RETURNING payer;
    `,
      [id, spendPoints]
    );

    return transaction;
  } catch (error) {
    throw error;
  }
}

async function getAllActiveTransactions() {
  try {
    const { rows: transactions } = await client.query(`
        SELECT id, payer, "activePoints", "spentPoints", timestamp
        FROM transactions
        WHERE "activePoints" > 0
        ORDER BY timestamp;
    `);
    return transactions;
  } catch (error) {
    throw error;
  }
}

async function getAllTransactions() {
  try {
    const { rows: transactions } = await client.query(`
        SELECT id, payer, "activePoints", "spentPoints", timestamp
        FROM transactions;
    `);
    return transactions;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTransaction,
  updateTransaction,
  getAllActiveTransactions,
  getAllTransactions,
};
