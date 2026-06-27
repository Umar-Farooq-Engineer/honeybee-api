const crypto = require('crypto');

exports.createJazzCashPayment = async (req, res, next) => {
  try {
    const { amount, customerName, email, invoiceNo } = req.body;
    if (!amount || !customerName || !email) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const merchantId = process.env.JAZZCASH_MERCHANT_ID || 'YOUR_MERCHANT_ID';
    const password = process.env.JAZZCASH_PASSWORD || 'YOUR_JAZZCASH_PASSWORD';
    const returnUrl = process.env.JAZZCASH_RETURN_URL || 'http://localhost:5173';
    const txnRef = invoiceNo || `INV-${Date.now()}`;

    const payload = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRef,
      pp_Amount: Number(amount).toFixed(0),
      pp_TxnCurrency: 'PKR',
      pp_BillReference: 'HONEY-ORDER',
      pp_Description: 'Payment for honey purchase',
      pp_ReturnURL: returnUrl,
      pp_SecureHash: '',
      pp_TxnDateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pp_MobileNumber: '',
      pp_CNIC: '',
      pp_SubMerchantID: '',
    };

    const hashString = `${payload.pp_Amount}&${payload.pp_BillReference}&${payload.pp_MerchantID}&${payload.pp_TxnCurrency}&${payload.pp_TxnRefNo}&${payload.pp_TxnType}&${payload.pp_Version}&${password}`;
    payload.pp_SecureHash = crypto.createHash('md5').update(hashString).digest('hex');

    res.json({
      success: true,
      payment: {
        endpoint: 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/1.1/Purchase/DoMWalletTransaction',
        payload,
      },
    });
  } catch (error) {
    next(error);
  }
};
