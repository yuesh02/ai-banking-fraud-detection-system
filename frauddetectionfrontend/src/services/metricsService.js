import apiClient from "../api/apiClient";

export const getMetrics =
  async () => {

  const res =
    await apiClient.get(
      "/dashboard/metrics"
    );

  return res.data;

};