"use client";

import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import { cacheOrganizationName } from "@/lib/organization-label-cache";
import { canEditOrganizationProfile } from "@/lib/organization-permissions";
import {
  profileToOrganizationUpdateApi,
  toOrganizationProfile,
} from "@/lib/organization-profile-mapper";
import { parseOrganizationOutApi } from "@/lib/organization-response-parsers";
import {
  deleteOrganizationLogo,
  getOrganization,
  updateOrganization,
  uploadOrganizationLogo,
} from "@/lib/organizations-api";
import type { OrganizationProfile } from "@/types/organization-profile";

export type SaveOrganizationProfileOptions = {
  logoFile?: File | null;
  removeLogo?: boolean;
};

export function useOrganizationProfile(orgId: string) {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const canEdit = profile
    ? canEditOrganizationProfile(profile.myRole ?? "member")
    : false;

  const reload = useCallback(async () => {
    if (!orgId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getOrganization(orgId);
      const parsed = parseOrganizationOutApi(data);
      if (!parsed) {
        setProfile(null);
        setNotFound(true);
        return;
      }
      const nextProfile = toOrganizationProfile(parsed);
      cacheOrganizationName(orgId, nextProfile.displayName);
      setProfile(nextProfile);
    } catch (err: unknown) {
      const status =
        err instanceof AxiosError ? err.response?.status : undefined;
      if (status === 404) {
        setNotFound(true);
        setProfile(null);
        setError(null);
      } else {
        setError(getApiErrorMessage(err));
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveProfile = useCallback(
    async (
      draft: OrganizationProfile,
      options: SaveOrganizationProfileOptions = {},
    ) => {
      setSaving(true);
      setError(null);
      try {
        if (options.removeLogo) {
          await deleteOrganizationLogo(orgId);
        } else if (options.logoFile) {
          await uploadOrganizationLogo(orgId, options.logoFile);
        }

        const updated = await updateOrganization(
          orgId,
          profileToOrganizationUpdateApi(draft),
        );
        const parsed = parseOrganizationOutApi(updated);
        if (!parsed) {
          throw new Error("Profile was saved but the response was invalid.");
        }
        const saved = toOrganizationProfile(parsed);
        cacheOrganizationName(orgId, saved.displayName);
        setProfile(saved);
        return saved;
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [orgId],
  );

  const displayName =
    profile?.displayName.trim() ||
    profile?.legalName.trim() ||
    "Organization";

  return {
    profile,
    displayName,
    loading,
    saving,
    error,
    notFound,
    canEdit,
    reload,
    saveProfile,
  };
}
