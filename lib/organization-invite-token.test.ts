import { describe, expect, it } from "vitest";
import { decodeInviteToken, hasInviteDisplayData } from "@/lib/organization-invite-token";

function jwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${header}.${body}.signature`;
}

describe("decodeInviteToken", () => {
  it("reads organization fields from JWT payload", () => {
    const decoded = decodeInviteToken(
      jwt({
        organization_id: "org-1",
        organization_name: "VC-tech",
        organization_industry: "Technology",
        team_role: "Data Science",
        inviter_name: "Samuel Keno",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );

    expect(decoded?.organizationId).toBe("org-1");
    expect(decoded?.organizationName).toBe("VC-tech");
    expect(decoded?.organizationIndustry).toBe("Technology");
    expect(decoded?.teamRole).toBe("Data Science");
    expect(decoded?.inviterName).toBe("Samuel Keno");
    expect(decoded?.isExpired).toBe(false);
    expect(hasInviteDisplayData(decoded)).toBe(true);
  });

  it("returns null for opaque non-jwt tokens", () => {
    expect(
      decodeInviteToken("Yz1oKEb5BJTSvfNUZ7JcoqSiUMINW-WbXR4rB4m8oqY"),
    ).toBeNull();
  });
});
