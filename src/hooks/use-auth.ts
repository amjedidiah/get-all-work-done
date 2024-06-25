import { isClient } from "@/utils";
import { useState } from "react";

const HEADER_NAME = process.env.NEXT_PUBLIC_HEADER_NAME!;

const storeUserToken = (token: string) =>
  localStorage.setItem(HEADER_NAME, token);

const expireUserToken = () => localStorage.removeItem(HEADER_NAME);

const retrieveUserToken = () => {
  if (!isClient) return;
  return localStorage.getItem(HEADER_NAME);
};

const getAuthStatus = () => {
  const token = retrieveUserToken();

  return !!token;
};

const getAuthHeaders = () => {
  const user_token = retrieveUserToken();
  if (!user_token) return;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(HEADER_NAME, user_token);

  return headers;
};

export default function useAuth() {
  const [isAuthed] = useState(getAuthStatus);

  return {
    isAuthed,
    storeUserToken,
    expireUserToken,
    getAuthStatus,
    getAuthHeaders,
  };
}
