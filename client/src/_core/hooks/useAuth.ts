import { useCallback, useEffect, useSyncExternalStore } from "react";
import { API_BASE, AUTH_TOKEN_KEY, clearAdminToken, getAdminMe, loginAdmin, AdminUser } from "@/lib/api";

let currentUser: AdminUser | null = null;
let authed = false;
let loading = false;
let hydrated = false;
const listeners = new Set<() => void>();
function notify() { listeners.forEach((listener) => listener()); }
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); }
function getSnapshot() { return `${authed}:${loading}:${currentUser?.id ?? ""}`; }
function getServerSnapshot() { return "false:false:"; }

export function useAuth() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (hydrated || !API_BASE) return;
    hydrated = true;
    let token = "";
    try { token = sessionStorage.getItem(AUTH_TOKEN_KEY) ?? ""; } catch { /* ignore */ }
    if (!token) return;
    loading = true;
    notify();
    getAdminMe().then((user) => { currentUser = user; authed = true; }).catch(() => { clearAdminToken(); }).finally(() => { loading = false; notify(); });
  }, []);
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!API_BASE) return false;
    loading = true;
    notify();
    try {
      currentUser = await loginAdmin(email, password);
      authed = true;
      return true;
    } catch {
      currentUser = null;
      authed = false;
      clearAdminToken();
      return false;
    } finally {
      loading = false;
      notify();
    }
  }, []);
  const logout = useCallback(() => {
    clearAdminToken();
    currentUser = null;
    authed = false;
    notify();
  }, []);
  return { user: currentUser, loading, error: null as null, isAuthenticated: authed, login, logout, refresh: async () => {} };
}
