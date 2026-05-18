import { CORE_SERVICE_OPTIONS } from "@/lib/organization-create-constants";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type { OrganizationCreateForm } from "@/types/organization-create";

type Props = {
  form: OrganizationCreateForm;
};

function serviceLabel(id: string): string {
  const preset = CORE_SERVICE_OPTIONS.find((o) => o.id === id);
  if (preset) return preset.title;
  return id.replace(/^custom-/, "").replace(/-/g, " ");
}

export function StepReview({ form }: Props) {
  const displayName = form.displayName.trim() || form.legalName.trim() || "—";
  const services = [...form.coreServices, ...form.customServices];

  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Review & complete"
        description="Confirm your organization details before creating your workspace."
      />

      <dl className="vs-surface divide-y divide-border rounded-md text-sm">
        <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
          <dt className="font-semibold text-muted-foreground">Organization</dt>
          <dd className="sm:col-span-2 text-foreground">{displayName}</dd>
        </div>
        {form.legalName && form.displayName && form.legalName !== form.displayName && (
          <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
            <dt className="font-semibold text-muted-foreground">Legal name</dt>
            <dd className="sm:col-span-2 text-foreground">{form.legalName}</dd>
          </div>
        )}
        {form.tagline && (
          <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
            <dt className="font-semibold text-muted-foreground">Tagline</dt>
            <dd className="sm:col-span-2 text-foreground">{form.tagline}</dd>
          </div>
        )}
        {form.industryVertical && (
          <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
            <dt className="font-semibold text-muted-foreground">Industry</dt>
            <dd className="sm:col-span-2 text-foreground">{form.industryVertical}</dd>
          </div>
        )}
        {services.length > 0 && (
          <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
            <dt className="font-semibold text-muted-foreground">Services</dt>
            <dd className="sm:col-span-2 text-foreground">
              {services.map(serviceLabel).join(", ")}
            </dd>
          </div>
        )}
        {(form.website || form.linkedIn || form.twitter) && (
          <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
            <dt className="font-semibold text-muted-foreground">Links</dt>
            <dd className="sm:col-span-2 space-y-1 text-foreground">
              {form.website && <div>{form.website}</div>}
              {form.linkedIn && <div>{form.linkedIn}</div>}
              {form.twitter && <div>{form.twitter}</div>}
            </dd>
          </div>
        )}
        <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3">
          <dt className="font-semibold text-muted-foreground">Developer ecosystem</dt>
          <dd className="sm:col-span-2 text-foreground">
            {form.developerSources.length === 0 ? (
              "None added"
            ) : (
              <ul className="space-y-1">
                {form.developerSources.map((entry) => (
                  <li key={entry.id}>
                    {entry.kind === "organization" ? "Org" : "Repo"} ·{" "}
                    {entry.identifier}
                    {entry.kind === "repository" &&
                    entry.visibility === "public"
                      ? " (public)"
                      : entry.connected
                        ? " (connected)"
                        : ""}
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
