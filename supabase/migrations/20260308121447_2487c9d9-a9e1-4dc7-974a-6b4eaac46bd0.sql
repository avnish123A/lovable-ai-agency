
UPDATE public.finance_deals 
SET is_active = false 
WHERE merchant NOT IN (
  'SBI Cards', 'HDFC Bank', 'ICICI Prudential', 'Zerodha', 'Groww', 'SBI', 
  'Axis Bank', 'HDFC ERGO', 'Kotak Mahindra Bank', 'Bajaj Finserv', 'Upstox', 
  'AU Bank Credit Card CPL', 'AU Small Finance Bank', 'RBL Bank', 'Bank of Baroda',
  'Yes Bank', 'IndusInd Bank', 'ICICI Bank', 'Kotak', 'PhonePe', 'Paytm', 'Razorpay',
  'Bajaj Allianz', 'LIC', 'HDFC Life', 'Max Life', 'Tata AIG', 'Star Health',
  'Punjab National Bank', 'Canara Bank', 'Union Bank', 'IDFC First Bank', 'Federal Bank',
  'Bandhan Bank', 'IDBI Bank', 'Indian Bank', 'Central Bank of India',
  'Bajaj Finance', 'Muthoot Finance', 'Manappuram Finance'
)
AND is_active = true;
