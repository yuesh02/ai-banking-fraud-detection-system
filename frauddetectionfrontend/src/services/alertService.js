import apiClient from "../api/apiClient";

export const getAlerts = async () => {

  const res = await apiClient.get(
    "/dashboard/alerts"
  );

  return res.data;

};