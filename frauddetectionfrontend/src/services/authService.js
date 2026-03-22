import apiClient from "../api/apiClient";

export const loginUser =
  async (username, password) => {

  const res =
    await apiClient.post(
      "/auth/login",
      {
        username,
        password
      }
    );

  return res.data;

};