import { getApiErrorMessage } from "@/lib/auth-api";
import { formToOrganizationCreateApi } from "@/lib/organization-create-mapper";
import {
  dataUrlToLogoFile,
  isSupportedOrganizationLogoMime,
} from "@/lib/organization-logo-utils";
import { parseOrganizationOutApi } from "@/lib/organization-response-parsers";
import {
  createOrganization,
  uploadOrganizationLogo,
} from "@/lib/organizations-api";
import type { OrganizationCreateForm } from "@/types/organization-create";

export type CreateOrganizationResult = {
  orgId: string;
  displayName: string;
  logoUploadFailed: boolean;
};

export async function createOrganizationFromWizard(
  form: OrganizationCreateForm,
): Promise<CreateOrganizationResult> {
  const payload = formToOrganizationCreateApi(form);
  const raw = await createOrganization(payload);
  const parsed = parseOrganizationOutApi(raw);

  if (!parsed) {
    throw new Error("Organization was created but the response was invalid.");
  }

  const displayName =
    parsed.display_name.trim() || parsed.legal_name.trim() || "Organization";

  let logoUploadFailed = false;

  if (form.logoDataUrl) {
    const file = dataUrlToLogoFile(form.logoDataUrl);
    if (!file || !isSupportedOrganizationLogoMime(file.type)) {
      logoUploadFailed = true;
    } else {
      try {
        await uploadOrganizationLogo(parsed.id, file);
      } catch (err) {
        logoUploadFailed = true;
        console.warn("[organization-create] logo upload failed", {
          message: getApiErrorMessage(err),
        });
      }
    }
  }

  return {
    orgId: parsed.id,
    displayName,
    logoUploadFailed,
  };
}
