import {
  Code2,
  Database,
  Layout,
  LineChart,
  Palette,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { CreateOrganizationStep } from "@/types/organization-create";

export const WIZARD_STEPS: {
  id: CreateOrganizationStep;
  key: string;
  label: string;
  headerLabel: string;
}[] = [
  { id: 1, key: "names", label: "Names", headerLabel: "Basic identity" },
  { id: 2, key: "branding", label: "Branding", headerLabel: "Branding" },
  { id: 3, key: "description", label: "Description", headerLabel: "Description" },
  { id: 4, key: "industry", label: "Industry", headerLabel: "Industry" },
  { id: 5, key: "services", label: "Services", headerLabel: "Services" },
  { id: 6, key: "links", label: "Links", headerLabel: "Web & social" },
  { id: 7, key: "developer", label: "Developer", headerLabel: "Developer" },
  { id: 8, key: "review", label: "Review", headerLabel: "Review" },
];

export function getWizardStepMeta(step: CreateOrganizationStep) {
  return WIZARD_STEPS.find((s) => s.id === step)!;
}

export const INDUSTRY_VERTICALS = [
  "Technology & Software",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Manufacturing & Industrial",
  "Professional Services",
  "Education & Research",
  "Retail & E-commerce",
  "Government & Public Sector",
];

export type CoreServiceOption = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const CORE_SERVICE_OPTIONS: CoreServiceOption[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "UI/UX Implementation, React, Vue, Web Components",
    icon: Layout,
  },
  {
    id: "backend",
    title: "Backend",
    description: "API Development, Database Architecture, Scaling",
    icon: Database,
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Machine Learning, Analytics, Big Data",
    icon: LineChart,
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Network Security, Penetration Testing",
    icon: Shield,
  },
  {
    id: "product-design",
    title: "Product Design",
    description: "User Research, Wireframing, Prototyping",
    icon: Palette,
  },
  {
    id: "engineering",
    title: "Engineering",
    description: "Platform tooling, DevOps, Infrastructure",
    icon: Code2,
  },
];

export const DESCRIPTION_WORD_LIMIT = 1000;
export const DESCRIPTION_WORD_MIN_RECOMMENDED = 500;

export const ORG_CREATE_DRAFT_KEY = "venturescope-org-create-draft";

export const TECH_STACK_SUGGESTIONS = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Kubernetes",
  "Docker",
  "AWS",
  "GCP",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Terraform",
] as const;

export const ORGANIZATION_PRODUCT_TYPES = [
  { value: "website" as const, label: "Website" },
  { value: "app" as const, label: "App" },
  { value: "api" as const, label: "API / Service" },
  { value: "platform" as const, label: "Platform" },
  { value: "other" as const, label: "Other" },
];
