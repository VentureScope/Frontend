"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAdminUser,
  getAdminUser,
  listAdminUsers,
  reactivateAdminUser,
  updateAdminUser,
} from "@/lib/admin-users-api";
import { getAdminApiErrorMessage, matchesDirectoryTab } from "@/lib/admin-utils";
import type { DirectoryTabId } from "@/lib/admin-utils";
import type { AdminUserResponse, AdminUserUpdatePayload } from "@/types/admin";

const DEFAULT_PER_PAGE = 20;

export function useAdminUsers() {
  const [items, setItems] = useState<AdminUserResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [tab, setTab] = useState<DirectoryTabId>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const includeInactive = tab === "inactive" || tab === "all";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminUsers({
        page,
        per_page: search.trim() ? 100 : perPage,
        include_inactive: includeInactive,
      });
      setItems(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, includeInactive, search]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [tab, search]);

  const filtered = useMemo(() => {
    let list = items.filter((u) => matchesDirectoryTab(u, tab));
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.full_name?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [items, tab, search]);

  const refreshUser = useCallback(async (userId: string) => {
    const updated = await getAdminUser(userId);
    setItems((prev) =>
      prev.map((u) => (u.id === userId ? updated : u)),
    );
    return updated;
  }, []);

  const patchUser = useCallback(
    async (userId: string, payload: AdminUserUpdatePayload) => {
      setActionLoading(true);
      try {
        const updated = await updateAdminUser(userId, payload);
        setItems((prev) =>
          prev.map((u) => (u.id === userId ? updated : u)),
        );
        return updated;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const deactivateUser = useCallback(
    async (userId: string, hardDelete = false) => {
      setActionLoading(true);
      try {
        await deleteAdminUser(userId, { hard_delete: hardDelete });
        await load();
      } finally {
        setActionLoading(false);
      }
    },
    [load],
  );

  const reactivateUser = useCallback(
    async (userId: string) => {
      setActionLoading(true);
      try {
        const updated = await reactivateAdminUser(userId);
        setItems((prev) =>
          prev.map((u) => (u.id === userId ? updated : u)),
        );
        return updated;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  return {
    users: filtered,
    total,
    page,
    pages,
    perPage,
    setPage,
    tab,
    setTab,
    search,
    setSearch,
    loading,
    error,
    actionLoading,
    reload: load,
    refreshUser,
    patchUser,
    deactivateUser,
    reactivateUser,
  };
}
