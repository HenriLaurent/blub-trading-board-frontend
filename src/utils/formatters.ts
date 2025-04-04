export const formatTokenAmount = (rawAmount: string, decimals: number = 18) => {
  const bigIntAmount = BigInt(rawAmount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = bigIntAmount / divisor;
  const decimalPart = bigIntAmount % divisor;

  return `${integerPart}.${decimalPart
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "")}`;
};
