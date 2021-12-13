const client = require("./client");

async function createPayer({ payer, points = 0 }) {
  try {
    const {
      rows: [payerRecord],
    } = await client.query(
      `
            INSERT INTO payers (payer, points)
            VALUES ($1, $2)
            RETURNING *;
        `,
      [payer, points]
    );
    return payerRecord;
  } catch (error) {
    throw error;
  }
}

async function updatePayer({ payer, points }) {
  try {
    const {
      rows: [payerRecord],
    } = await client.query(
      `
        UPDATE payers
        SET points = points + $2
        WHERE payer = $1
        RETURNING *;
      `,
      [payer, points]
    );
    return payerRecord;
  } catch (error) {
    throw error;
  }
}

async function getAllPayers() {
  try {
    const { rows: payers } = await client.query(`
            SELECT payer, points
            FROM payers;
        `);
    return payers;
  } catch (error) {
    throw error;
  }
}

async function getPayerByName(payer) {
  try {
    const {
      rows: [payerRecord],
    } = await client.query(
      `
            SELECT * FROM payers
            WHERE payer = $1;
        `,
      [payer]
    );
    return payerRecord;
  } catch (error) {
    throw error;
  }
}

async function getTotalPayerPoints() {
  try {
    const {
      rows: [totalPoints],
    } = await client.query(`
            SELECT SUM (points)
            FROM payers;
        `);
    return totalPoints;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPayer,
  updatePayer,
  getAllPayers,
  getPayerByName,
  getTotalPayerPoints,
};
