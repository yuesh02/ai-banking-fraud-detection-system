import apiClient from "../api/apiClient";

export const getTransactions = async (
  page = 0,
  size = 10
) => {

  const res = await apiClient.get(
    `/dashboard/transactions?page=${page}&size=${size}`
  );

  return res.data;

};
export const searchTransactions = async (
  filters
) => {

  // Remove empty fields
  const cleanedFilters = {};

  Object.keys(filters).forEach((key) => {

    const value = filters[key];

    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {

      // Convert fraud string to boolean
      if (key === "fraud") {
        cleanedFilters[key] =
          value === "true";
      } else {
        cleanedFilters[key] = value;
      }

    }

  });

  console.log(
    "Sending filters:",
    cleanedFilters
  );

  const res = await apiClient.post(
    "/dashboard/transactions/search",
    cleanedFilters
  );

  return res.data;

};
export const getTransactionDetails =
  async (transactionId) => {

  const res = await apiClient.get(
    `/dashboard/transactions/${transactionId}`
  );

  return res.data;

};