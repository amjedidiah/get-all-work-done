import { HEADER_NAME } from "@/lib/auth";
import { isClient } from "@/utils";

export default function useAuth() {
  const storeUserToken = async (token: string) =>
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

  const isAuthed = getAuthStatus();

  return {
    isAuthed,
    storeUserToken,
    expireUserToken,
    getAuthStatus,
    getAuthHeaders,
  };
}
