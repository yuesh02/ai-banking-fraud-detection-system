import apiClient from "../api/apiClient";

export const getTopRiskyMerchants =
  async () => {

  const res =
    await apiClient.get(
      "/dashboard/top-risky-merchants"
    );

  return res.data;

};