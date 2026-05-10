import { apiRequest } from "./client";

export async function login(email, password) {
  const res = await apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function register(email, password) {
  const res = await apiRequest("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
}