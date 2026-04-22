export const submitPayment = (data) => {
  return {
    message: "Payment submitted ✅",
    amount: data.amount,
  };
};