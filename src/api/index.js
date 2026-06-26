import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

// Auth
export const signup = (data) => API.post("/signup", data);
export const signin = (data) => API.post("/signin", data);

//  Transactions
export const getTransactions = (token) =>
  API.get("/transactions", { headers: { Authorization: `Bearer ${token}` } });

export const createTransaction = (data, token) =>
  API.post("/transactions", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateTransaction = (id, data, token) =>
  API.put(`/transactions/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteTransaction = (id, token) =>
  API.delete(`/transactions/${id}`, { headers: { Authorization: `Bearer ${token}` } });

//  Tags 
export const getTags = (token) =>
  API.get("/tags", { headers: { Authorization: `Bearer ${token}` } });

export const createTag = (data, token) =>
  API.post("/tags", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateTag = (id, data, token) =>
  API.put(`/tags/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteTag = (id, token) =>
  API.delete(`/tags/${id}`, { headers: { Authorization: `Bearer ${token}` } });

//Budgets
export const getBudgets = (token) =>
  API.get("/budgets", { headers: { Authorization: `Bearer ${token}` } });

export const createBudget = (data, token) =>
  API.post("/budgets", data, { headers: { Authorization: `Bearer ${token}` } });

export const updateBudget = (id, data, token) =>
  API.put(`/budgets/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteBudget = (id, token) =>
  API.delete(`/budgets/${id}`, { headers: { Authorization: `Bearer ${token}` } });