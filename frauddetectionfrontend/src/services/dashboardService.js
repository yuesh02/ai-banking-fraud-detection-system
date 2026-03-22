import apiClient from "../api/apiClient";

export const getSummary = async () => {
  const res = await apiClient.get(
    "/dashboard/summary"
  );
  return res.data;
};

export const getFraudTrend = async () => {
  const res = await apiClient.get(
    "/dashboard/fraud-trend"
  );
  return res.data;
};

export const getRiskDistribution = async () => {
  const res = await apiClient.get(
    "/dashboard/risk-distribution"
  );
  return res.data;
};

export const getRiskByCountry = async () => {
  const res = await apiClient.get(
    "/dashboard/risk-by-country"
  );
  return res.data;
};
