"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { cacheOrganizationName } from "@/lib/organization-label-cache";
import { canEditOrganizationProfile } from "@/lib/organization-permissions";
import {
  profileToOrganizationUpdateApi,
  toOrganizationProfile,
} from "@/lib/organization-profile-mapper";
import { parseOrganizationOutApi } from "@/lib/organization-response-parsers";
import { useOrganizationDetailQuery } from "@/hooks/queries/use-organization-detail-query";
import { queryKeys } from "@/lib/query-keys";
import {
  deleteOrganizationLogo,
  updateOrganization,
  uploadOrganizationLogo,
} from "@/lib/organizations-api";
import type { OrganizationProfile } from "@/types/organization-profile";

export type SaveOrganizationProfileOptions = {
  logoFile?: File | null;
  removeLogo?: boolean;
};

export function useOrganizationProfile(orgId: string) {
  const queryClient = useQueryClient();
  const query = useOrganizationDetailQuery(orgId);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const profile = useMemo((): OrganizationProfile | null => {
    if (!query.data || query.data.kind !== "ok") return null;
    return toOrganizationProfile(query.data.data);
  }, [query.data]);

  const notFound =
    !query.isPending &&
    !query.isError &&
    query.data?.kind === "not_found";

  const canEdit = profile
    ? canEditOrganizationProfile(profile.myRole ?? "member")
    : false;

  const saveProfile = useCallback(
    async (
      draft: OrganizationProfile,
      options: SaveOrganizationProfileOptions = {},
    ) => {
      setSaving(true);
      setSaveError(null);
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
        queryClient.setQueryData(queryKeys.organizations.detail(orgId), {
          kind: "ok" as const,
          data: parsed,
        });
        return saved;
      } catch (err) {
        const message = getApiErrorMessage(err);
        setSaveError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [orgId, queryClient],
  );

  const displayName =
    profile?.displayName.trim() ||
    profile?.legalName.trim() ||
    "Organization";

  return {
    profile,
    displayName,
    loading: query.isPending,
    saving,
    error: saveError ?? (query.error ? getApiErrorMessage(query.error) : null),
    notFound,
    canEdit,
    reload: () => query.refetch(),
    saveProfile,
  };
}
