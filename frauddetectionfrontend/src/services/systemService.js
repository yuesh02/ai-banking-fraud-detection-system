import apiClient from "../api/apiClient";

export const getSystemHealth =
  async () => {

  const res =
    await apiClient.get(
      "/system/health"
    );

  return res.data;

};