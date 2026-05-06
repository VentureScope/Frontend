export type ResourceStatus = "completed" | "in-progress" | "locked";
export type ResourceType = "VIDEO" | "DOCUMENTATION" | "COURSE MODULE";

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  meta: string;
  status: ResourceStatus;
  thumbnail?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  status: ResourceStatus;
  resources: Resource[];
}

export interface LearningPath {
  id: string;
  title: string;
  focus: string;
  progress: number;
  iconName: string;
  isExpanded: boolean;
  modules: Module[];
}

export const learningPathsData: LearningPath[] = [
  {
    id: "senior-data-scientist",
    title: "Senior Data Scientist",
    focus: "Advanced ML Models & Predictive Analytics",
    progress: 65,
    iconName: "BarChart3",
    isExpanded: true,
    modules: [
      {
        id: "m1",
        title: "Foundation: Advanced Statistics",
        description: "Master the probabilistic frameworks required for senior-level modeling.",
        status: "completed",
        resources: [
          {
            id: "r1",
            type: "VIDEO",
            title: "Bayesian Inference in Practice",
            meta: "MIT OpenCourseWare • 45m",
            status: "completed",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop"
          },
          {
            id: "r2",
            type: "DOCUMENTATION",
            title: "Probabilistic Programming",
            meta: "O'Reilly Chapter 4 • 2hrs",
            status: "completed"
          }
        ]
      },
      {
        id: "m2",
        title: "Core: Deep Learning Architectures",
        description: "Implement and optimize state-of-the-art transformer architectures.",
        status: "in-progress",
        resources: [
          {
            id: "r3",
            type: "COURSE MODULE",
            title: "Transformers & Attention",
            meta: "Coursera • 3hrs remaining",
            status: "in-progress",
            thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=200&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    focus: "Distributed Systems & Security",
    progress: 12,
    iconName: "Cloud",
    isExpanded: false,
    modules: [
      {
        id: "m3",
        title: "Foundation: Cloud Infrastructure",
        description: "Learn the basics of AWS and Azure.",
        status: "in-progress",
        resources: [
          {
            id: "r4",
            type: "VIDEO",
            title: "AWS Certified Solutions Architect",
            meta: "YouTube • 10hrs",
            status: "in-progress",
            thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=200&auto=format&fit=crop"
          }
        ]
      }
    ]
  }
];

export const tabsData = [
  { id: "current-trends", name: "Current Trends" },
  { id: "future-predictions", name: "Future Predictions" },
];

export const rolesData = [
  {
    id: "ai-eng",
    title: "AI Integration Engineer",
    badge: "HIGH DEMAND",
    badgeType: "high-demand" as const,
    description: "Bridging the gap between LLM capabilities and enterprise infrastructure.",
    count: "42,500+",
    iconName: "Cpu",
  },
  {
    id: "devops",
    title: "DevOps Lead",
    badge: "STEADY GROWTH",
    badgeType: "steady-growth" as const,
    description: "Orchestrating scalable, secure deployment pipelines across multi-cloud environments.",
    count: "38,120",
    iconName: "Share2",
  },
  {
    id: "cyber",
    title: "Cybersecurity Architect",
    badge: "HIGH DEMAND",
    badgeType: "high-demand" as const,
    description: "Designing resilient security frameworks to protect enterprise data assets.",
    count: "29,800",
    iconName: "Shield",
  },
  {
    id: "data-mgr",
    title: "Data Science Manager",
    badge: "STEADY GROWTH",
    badgeType: "steady-growth" as const,
    description: "Leading analytical teams to extract actionable intelligence from big data.",
    count: "15,450",
    iconName: "BarChart2",
  },
];
