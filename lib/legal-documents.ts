export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const LEGAL_LAST_UPDATED = "May 24, 2026";
export const LEGAL_CONTACT_EMAIL = "support@venturescope.com";

export const TERMS_OF_SERVICE_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      'Welcome to VentureScope ("VentureScope," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the VentureScope web application, APIs, and related services (collectively, the "Service").',
      "VentureScope is an AI-powered career intelligence platform focused on Ethiopia's technology sector. By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.",
    ],
  },
  {
    id: "service",
    title: "2. The Service",
    paragraphs: [
      "VentureScope helps students and professionals align skills with market demand through features that may include, depending on your account type:",
    ],
    bullets: [
      "Personalized job and skill matching based on your profile and market data",
      "Adaptive learning roadmaps and progress tracking",
      "AI career advisors (personal and organization-scoped)",
      "ATS-oriented resume generation and editing",
      "Market trends, forecasts, and in-demand skills analytics",
      "GitHub portfolio sync and organization workforce tools for invited teams",
      "Notifications about learning paths, resumes, roadmaps, and organization activity",
    ],
  },
  {
    id: "eligibility",
    title: "3. Accounts & eligibility",
    paragraphs: [
      "You must provide accurate registration information and keep your credentials secure. You are responsible for activity under your account.",
      "You may register as a student or professional. You must be at least 16 years old (or the minimum age required in your jurisdiction) to use the Service.",
      "We may suspend or terminate accounts that violate these Terms or pose a security risk.",
    ],
  },
  {
    id: "ai",
    title: "4. AI-generated guidance",
    paragraphs: [
      "Career recommendations, roadmap suggestions, advisor chat responses, and resume drafts may be produced with artificial intelligence and market datasets.",
      "AI output is informational only—not legal, financial, or employment advice. You should verify important decisions independently. We do not guarantee hiring outcomes, salary levels, or forecast accuracy.",
    ],
  },
  {
    id: "integrations",
    title: "5. Third-party integrations",
    paragraphs: [
      "The Service may connect to third parties such as Google, GitHub, university data sources (e.g. via supported extensions), and job-market data providers.",
      "Your use of those integrations is also subject to the third party's terms. You grant VentureScope permission to access data you explicitly connect, solely to provide the Service.",
    ],
  },
  {
    id: "organizations",
    title: "6. Organizations",
    paragraphs: [
      "Organization owners and admins may invite members, manage roadmaps, and use org-scoped advisors. Owners may delete an organization, which permanently removes associated team data subject to our retention practices.",
      "You agree not to upload misleading company information or use organization features to harass, spam, or misrepresent your affiliation.",
    ],
  },
  {
    id: "acceptable-use",
    title: "7. Acceptable use",
    paragraphs: ["You agree not to:"],
    bullets: [
      "Reverse engineer, scrape, or overload the Service without permission",
      "Upload malware, unlawful content, or others' personal data without consent",
      "Impersonate another person or misrepresent your skills or credentials",
      "Circumvent access controls or use the Service to build a competing product using our proprietary data",
    ],
  },
  {
    id: "ip",
    title: "8. Intellectual property",
    paragraphs: [
      "VentureScope retains rights in the Service, branding, and underlying software. You retain rights in content you submit (profile text, resumes, organization details).",
      "You grant us a limited license to host, process, and display your content as needed to operate and improve the Service.",
    ],
  },
  {
    id: "beta",
    title: "9. Beta & availability",
    paragraphs: [
      "Parts of VentureScope may be offered as a beta. Features, market statistics, and integrations may change or be unavailable without notice.",
      "We strive for reliability but do not warrant uninterrupted access. Scheduled maintenance and third-party outages may affect the Service.",
    ],
  },
  {
    id: "liability",
    title: "10. Disclaimers & limitation of liability",
    paragraphs: [
      'THE SERVICE IS PROVIDED "AS IS" TO THE MAXIMUM EXTENT PERMITTED BY LAW. WE DISCLAIM IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
      "To the extent permitted by law, VentureScope and its affiliates are not liable for indirect, incidental, or consequential damages arising from your use of the Service. Our aggregate liability for any claim relating to the Service is limited to the greater of (a) amounts you paid us in the twelve months before the claim or (b) one hundred U.S. dollars.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes & termination",
    paragraphs: [
      "We may update these Terms. Material changes will be reflected on this page with an updated date. Continued use after changes constitutes acceptance.",
      "You may stop using the Service at any time. We may terminate or suspend access for breach of these Terms.",
    ],
  },
  {
    id: "contact",
    title: "12. Contact",
    paragraphs: [
      `Questions about these Terms: ${LEGAL_CONTACT_EMAIL}.`,
      "For privacy practices, see our Privacy Policy.",
    ],
  },
];

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "1. Overview",
    paragraphs: [
      "VentureScope respects your privacy. This Privacy Policy explains what we collect, how we use it, and your choices when you use our career intelligence platform.",
    ],
  },
  {
    id: "collect",
    title: "2. Information we collect",
    paragraphs: ["Depending on how you use VentureScope, we may process:"],
    bullets: [
      "Account data: name, email, password (hashed), role (student/professional), career interests",
      "Profile and resume content you create or upload",
      "Learning roadmap progress, skills, and advisor chat messages",
      "GitHub or OAuth profile data you choose to connect",
      "Organization membership, invites, and company profile fields",
      "Usage, device, and log data needed for security and performance",
      "Notifications and activity related to your account",
    ],
  },
  {
    id: "use",
    title: "3. How we use information",
    paragraphs: ["We use personal data to:"],
    bullets: [
      "Authenticate you and provide core features",
      "Generate skill matches, roadmaps, resumes, and AI guidance",
      "Display market analytics and organization workforce insights",
      "Send service-related notifications and respond to support requests",
      "Improve reliability, prevent abuse, and comply with law",
    ],
  },
  {
    id: "sharing",
    title: "4. Sharing",
    paragraphs: [
      "We do not sell your personal information. We may share data with infrastructure providers, analytics tools, and integration partners (e.g. OAuth providers) only as needed to run the Service.",
      "Organization admins may see member progress and profile information within their organization as designed by the product.",
    ],
  },
  {
    id: "retention",
    title: "5. Retention & security",
    paragraphs: [
      "We retain data while your account is active and for a reasonable period afterward, unless deletion is required sooner by law or your request.",
      "We apply technical and organizational safeguards appropriate to the data we hold. No method of transmission over the Internet is 100% secure.",
    ],
  },
  {
    id: "rights",
    title: "6. Your choices",
    paragraphs: [
      "You may update profile and settings in the dashboard, disconnect integrations, and request account deletion or data export by contacting us.",
      "You can manage notification preferences where the product provides controls.",
    ],
  },
  {
    id: "children",
    title: "7. Children",
    paragraphs: [
      "The Service is not directed to children under 16. If you believe we collected data from a child without consent, contact us to request removal.",
    ],
  },
  {
    id: "changes-privacy",
    title: "8. Changes",
    paragraphs: [
      "We may update this policy. The “Last updated” date at the top of the page will change when we do.",
    ],
  },
  {
    id: "contact-privacy",
    title: "9. Contact",
    paragraphs: [`Privacy inquiries: ${LEGAL_CONTACT_EMAIL}.`],
  },
];

export const DASHBOARD_HELP_SECTIONS = [
  {
    title: "Complete your profile",
    description:
      "Add skills, career interests, and connect GitHub so matches, roadmaps, and resumes reflect your real strengths.",
    href: "/dashboard/profile",
  },
  {
    title: "Explore market trends",
    description:
      "Review trending roles, in-demand skills, and demand forecasts for Ethiopia's tech market before choosing a path.",
    href: "/dashboard/market-trends",
  },
  {
    title: "Start a learning roadmap",
    description:
      "Generate an adaptive path from current or future trending roles, then track modules and resources to completion.",
    href: "/dashboard/learning-path/new-roadmap",
  },
  {
    title: "Talk to My Advisor",
    description:
      "Ask career questions in a chat grounded in market data—salary negotiation, role pivots, and skill gaps.",
    href: "/dashboard/ai-advisor",
  },
  {
    title: "Build your resume",
    description:
      "Create an ATS-friendly CV from your profile, preview it, and export a PDF when you're ready to apply.",
    href: "/dashboard/resume-builder",
  },
  {
    title: "Organizations",
    description:
      "Join or create a team workspace for shared roadmaps, member insights, and org-scoped AI guidance.",
    href: "/dashboard/organization",
  },
] as const;
