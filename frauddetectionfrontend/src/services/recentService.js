import apiClient from "../api/apiClient";

export const getRecentTransactions =
  async () => {

  const res =
    await apiClient.get(
      "/dashboard/recent-transactions"
    );

  return res.data.content;

};