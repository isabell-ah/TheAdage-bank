export const fmtAmt = (amount) => {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `KES ${formatted}`;
};

export const fmtAmtSigned = (amount) => {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${fmtAmt(amount)}`;
};
