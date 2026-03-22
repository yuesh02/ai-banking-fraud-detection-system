import apiClient from "../api/apiClient";

export const getLiveTransactions =
  async () => {

  const res =
    await apiClient.get(
      "/dashboard/transactions/live"
    );

  return res.data;

};