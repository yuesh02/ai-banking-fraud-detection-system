import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api/dashboard"
});

export const getSummary = () => API.get("/summary");
export const getRiskTrend = () => API.get("/risk-trend");
export const getFraudDistribution = () => API.get("/fraud-distribution");
export const getTransactions = () => API.get("/transactions");