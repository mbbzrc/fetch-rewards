const { client } = require("./client");

async function createTransaction({ payer, points }) {
  try {
    const {
      rows: [transaction],
    } = await client.query(
      `
        INSERT INTO transactions (payer, points)
        VALUES ($1, $2)
        RETURNING *;
    `,
      [payer, points]
    );
    return transaction;
  } catch (error) {
    throw error;
  }
}

async function getAllTransactions() {
  try {
    const { rows: transactions } = await client.query(`
        SELECT * FROM transactions;
    `);
    return transactions;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
};
