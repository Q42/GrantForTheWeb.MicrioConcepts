const CLIENT_ADDRESS = 'http://localhost:5000';
const AMOUNT = 1;
const PORT = 5100;

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ADDRESS,
    credentials: true,
  })
);

const { PaymentRequest, IlpClient } = require('xpring-js');
const bigInt = require('big-integer');

const grpcUrl = 'rxprod.grpcng.wallet.ripplex.io:443';
const ilpClient = new IlpClient(grpcUrl);

app.post('/pay', async (req, res) => {
  const paymentVars = {
    amount: AMOUNT,
    destinationPaymentPointer: req.body.paymentPointer,
    senderAccountId: req.body.accountName,
    fromToken: req.body.authToken,
  };

  console.log('Payment Credentials:', paymentVars);

  const response = await pay(paymentVars);
  res.send(response);
});

async function pay(vars) {
  try {
    const paymentRequest = new PaymentRequest({
      amount: bigInt(vars.amount * 1000000000),
      destinationPaymentPointer: vars.destinationPaymentPointer,
      senderAccountId: vars.senderAccountId,
    });

    var payment = await ilpClient.sendPayment(paymentRequest, vars.fromToken);
    console.log('Payment:', payment);

    return payment;
  } catch (error) {
    console.log('Error:', error);
    return error;
  }
}

const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
