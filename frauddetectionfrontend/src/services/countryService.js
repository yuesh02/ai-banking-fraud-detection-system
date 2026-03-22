import apiClient from "../api/apiClient";

export const getRiskByCountry =
  async () => {

  const res =
    await apiClient.get(
      "/dashboard/risk-by-country"
    );

  return res.data;

};