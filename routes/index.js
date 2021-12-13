const apiRouter = require("express").Router();

const {
  createPayer,
  updatePayer,
  getAllPayers,
  getPayerByName,
  getTotalPayerPoints,
  createTransaction,
  updateTransaction,
  getAllActiveTransactions,
} = require("../db");

apiRouter.get("/balance", async (req, res, next) => {
  try {
    const balance = await getAllPayers();
    res.send(balance);
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await getAllActiveTransactions();
    res.send(transactions);
  } catch (error) {
    throw error;
  }
});

apiRouter.post("/transaction", async (req, res, next) => {
  const { payer, activePoints } = req.body;

  try {
    const existingPayer = await getPayerByName(payer);
    if (existingPayer) {
      await updatePayer({ payer, activePoints });
    } else {
      await createPayer({ payer, points: activePoints });
    }

    const transaction = await createTransaction({ payer, activePoints });

    res.send({ message: "Transaction added!", transaction });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch("/spend", async (req, res, next) => {
  const { spendPoints } = req.body;
  try {
    const availablePoints = await getTotalPayerPoints();

    if (spendPoints > availablePoints) {
      return next({
        name: "InsufficientPointsError",
        message: "Insufficient points in your account!",
      });
    }

    const transactions = await getAllActiveTransactions();

    let wallet = spendPoints;
    const pointsSpent = [];

    let i = 0;
    while (wallet > 0) {
      const { id, activePoints } = transactions[i];
      let spendResult;

      if (wallet > activePoints) {
        spendResult = await updateTransaction({
          id,
          spendPoints: activePoints,
        });
        spendResult.points = 0 - activePoints;
      } else {
        spendResult = await updateTransaction({
          id,
          spendPoints: wallet,
        });
        spendResult.points = 0 - wallet;
      }

      pointsSpent.push(spendResult);
      wallet = wallet - activePoints;
      i++;
    }

    await Promise.all(
      pointsSpent.forEach((item) => {
        updatePayer(item);
      })
    );

    res.send({ message: "Your points have been redeemed.", pointsSpent });
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;
