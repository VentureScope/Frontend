"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WizardStepProgress } from "@/components/organization/create/WizardProgress";
import { WizardNavFooter } from "@/components/organization/create/WizardNavFooter";
import { StepIdentityNames } from "@/components/organization/create/steps/StepIdentityNames";
import { StepIdentityBranding } from "@/components/organization/create/steps/StepIdentityBranding";
import { StepDescription } from "@/components/organization/create/steps/StepDescription";
import { StepIndustryVertical } from "@/components/organization/create/steps/StepIndustryVertical";
import { StepCoreServices } from "@/components/organization/create/steps/StepCoreServices";
import { StepWebLinks } from "@/components/organization/create/steps/StepWebLinks";
import { StepDeveloper } from "@/components/organization/create/steps/StepDeveloper";
import { StepReview } from "@/components/organization/create/steps/StepReview";
import {
  DESCRIPTION_WORD_LIMIT,
  getWizardStepMeta,
  ORG_CREATE_DRAFT_KEY,
} from "@/lib/organization-create-constants";
import {
  createProfileFromWizard,
  saveOrganizationProfile,
} from "@/lib/organization-profiles-storage";
import {
  EMPTY_ORGANIZATION_CREATE_FORM,
  WIZARD_STEP_COUNT,
  type CreateOrganizationStep,
  type OrganizationCreateForm,
} from "@/types/organization-create";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function normalizeDraftForm(
  raw: Partial<OrganizationCreateForm> & { githubConnected?: boolean },
): OrganizationCreateForm {
  const { githubConnected: _legacy, ...rest } = raw;
  const merged = {
    ...EMPTY_ORGANIZATION_CREATE_FORM,
    ...rest,
  };
  if (!Array.isArray(merged.developerSources)) {
    merged.developerSources = [];
  }
  return merged;
}

export function CreateOrganizationWizard() {
  const router = useRouter();
  const [step, setStep] = useState<CreateOrganizationStep>(1);
  const [form, setForm] = useState<OrganizationCreateForm>(
    EMPTY_ORGANIZATION_CREATE_FORM,
  );

  const patch = useCallback((updates: Partial<OrganizationCreateForm>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORG_CREATE_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          step?: CreateOrganizationStep;
          form?: OrganizationCreateForm;
        };
        if (parsed.form) {
          setForm(normalizeDraftForm(parsed.form));
        }
        if (
          parsed.step &&
          parsed.step >= 1 &&
          parsed.step <= WIZARD_STEP_COUNT
        ) {
          setStep(parsed.step);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  function saveDraft() {
    sessionStorage.setItem(
      ORG_CREATE_DRAFT_KEY,
      JSON.stringify({ step, form }),
    );
    toast.success("Draft saved.");
  }

  function exitWizard() {
    router.push("/dashboard/organization");
  }

  function validateStep(current: CreateOrganizationStep): boolean {
    if (current === 1) {
      if (!form.legalName.trim() && !form.displayName.trim()) {
        toast.error("Enter a legal or display name to continue.");
        return false;
      }
    }
    if (current === 3) {
      if (countWords(form.description) > DESCRIPTION_WORD_LIMIT) {
        toast.error(
          `Description must be ${DESCRIPTION_WORD_LIMIT} words or fewer.`,
        );
        return false;
      }
    }
    if (current === 4) {
      if (!form.industryVertical) {
        toast.error("Select an industry vertical.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    if (step < WIZARD_STEP_COUNT) {
      setStep((s) => (s + 1) as CreateOrganizationStep);
      return;
    }
    completeSetup();
  }

  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as CreateOrganizationStep);
  }

  function completeSetup() {
    const name = form.displayName.trim() || form.legalName.trim();
    const id = slugify(name) || `org-${Date.now()}`;
    saveOrganizationProfile(createProfileFromWizard(id, form));
    sessionStorage.removeItem(ORG_CREATE_DRAFT_KEY);
    toast.success(`"${name}" has been created.`);
    router.push(`/dashboard/organization/${id}`);
  }

  const stepMeta = getWizardStepMeta(step);
  const wordCount = countWords(form.description);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            saveDraft();
            exitWizard();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          Save & exit
        </button>
      </div>

      <div className="vs-surface overflow-hidden rounded-md">
        <header className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-start gap-3">
            <Link
              href="/dashboard/organization"
              className="mt-0.5 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Organization Setup
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Step {step} of {WIZARD_STEP_COUNT}: {stepMeta.headerLabel}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={exitWizard}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/5"
              onClick={saveDraft}
            >
              Save draft
            </Button>
          </div>
        </header>

        <div className="border-b border-border px-5 py-4 sm:px-8">
          <WizardStepProgress currentStep={step} />
          <div className="mt-3 flex justify-between gap-2">
            {Array.from({ length: WIZARD_STEP_COUNT }, (_, i) => {
              const n = (i + 1) as CreateOrganizationStep;
              const meta = getWizardStepMeta(n);
              return (
                <span
                  key={meta.key}
                  className={`hidden flex-1 text-center text-[9px] font-bold uppercase tracking-wider sm:block ${
                    n === step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
          {step === 1 && <StepIdentityNames form={form} onChange={patch} />}
          {step === 2 && <StepIdentityBranding form={form} onChange={patch} />}
          {step === 3 && <StepDescription form={form} onChange={patch} />}
          {step === 4 && <StepIndustryVertical form={form} onChange={patch} />}
          {step === 5 && <StepCoreServices form={form} onChange={patch} />}
          {step === 6 && <StepWebLinks form={form} onChange={patch} />}
          {step === 7 && <StepDeveloper form={form} onChange={patch} />}
          {step === 8 && <StepReview form={form} />}
        </div>

        <div className="px-5 pb-8 sm:px-8">
          <WizardNavFooter
            showBack={step > 1}
            onBack={goBack}
            onNext={goNext}
            isLastStep={step === WIZARD_STEP_COUNT}
            nextDisabled={step === 3 && wordCount > DESCRIPTION_WORD_LIMIT}
          />
        </div>
      </div>
    </div>
  );
}
