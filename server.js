const express = require('express');
const ViteExpress = require('vite-express');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require("moment")
const qs = require('qs');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}
app.post('/api/create_payment', async (req, res) => {
  const tmnCode = "CFFD0BGK"; // Lấy từ VNPay .env
  const secretKey = "E5LTCMVQ0NADKODCFFVVX1MIG8UL5MMR"; // Lấy từ VNPay

  const returnUrl = "http://localhost:5000/api/payment-result"; // Trang kết quả
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let ipAddr = req.ip;
  let orderId = moment().format("YYYYMMDDHHmmss");

  let createDate = moment().format("YYYYMMDDHHmmss");
  let orderInfo = "Thanh_toan_don_hang";
  let locale = "vn";
  let currCode = "VND";

  const { amount } = req.body;
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params);
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  let paymentUrl = vnp_Url + "?" + qs.stringify(vnp_Params);
  res.json({ paymentUrl });

});

app.get('/api/payment-result', (req, res) => {
  const responseCode = req.query.vnp_ResponseCode;

  if (responseCode === '00') {
    // Thành công
    res.redirect('/success');
  } else {
    // Thất bại
    res.redirect('/failure');
  }
});

ViteExpress.listen(app, port, () => {
  console.log(`🚀 Server + Vite đang chạy tại http://localhost:${port}`);
});
