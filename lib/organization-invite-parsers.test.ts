import { describe, expect, it } from "vitest";
import { parseAcceptInviteOrganizationId } from "@/lib/organization-invite-parsers";

describe("parseAcceptInviteOrganizationId", () => {
  it("reads organization_id from partial accept payload", () => {
    expect(
      parseAcceptInviteOrganizationId({
        organization_id: "org-123",
      }),
    ).toBe("org-123");
  });

  it("uses preview org id when accept body is empty", () => {
    expect(parseAcceptInviteOrganizationId(null, "org-preview")).toBe(
      "org-preview",
    );
    expect(parseAcceptInviteOrganizationId({}, "org-preview")).toBe(
      "org-preview",
    );
  });

  it("returns null when response and fallback are missing", () => {
    expect(parseAcceptInviteOrganizationId(null)).toBeNull();
    expect(parseAcceptInviteOrganizationId({})).toBeNull();
  });
});
