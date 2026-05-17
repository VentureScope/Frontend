export interface Resume {
  id: string;
  title: string;
  company: string;
  lastUpdated: string;
  matchScore: number;
  atsStatus: string;
  tags: string[];
  isRecent: boolean;
  image?: string;
  content: {
    summary: string;
    experience: {
      id: string;
      role: string;
      company: string;
      duration: string;
      description: string[];
    }[];
    education: {
      id: string;
      degree: string;
      school: string;
      year: string;
    }[];
    skills: string[];
  };
}

export const mockResumes: Resume[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Safaricom",
    lastUpdated: "2 hours ago",
    matchScore: 94,
    atsStatus: "Excellent",
    tags: ["Optimized for Fintech roles"],
    isRecent: true,
    image: "/resume-1.jpg",
    content: {
      summary: "Senior Product Designer with 5+ years of experience crafting intuitive interfaces and improving user retention.",
      experience: [
        {
          id: "exp-1",
          role: "Senior Product Designer",
          company: "Safaricom",
          duration: "2021 - Present",
          description: [
            "Architected the design system used across 4 enterprise products.",
            "Increased user retention by 22% through UX overhaul."
          ]
        }
      ],
      education: [
        {
          id: "edu-1",
          degree: "BSc Computer Science",
          school: "University of Nairobi",
          year: "2018"
        }
      ],
      skills: ["UX Design", "Figma", "Prototyping", "Design Systems"]
    }
  },
  {
    id: "2",
    title: "Creative Lead",
    company: "Design Studio",
    lastUpdated: "Aug 12, 2023",
    matchScore: 82,
    atsStatus: "Good",
    tags: ["Creative Direction"],
    isRecent: false,
    image: "/resume-2.jpg",
    content: {
      summary: "Creative Lead directing cross-functional teams to deliver award-winning brand campaigns.",
      experience: [
        {
          id: "exp-2",
          role: "Creative Lead",
          company: "Design Studio",
          duration: "2018 - 2021",
          description: [
            "Spearheaded design campaigns for Fortune 500 clients."
          ]
        }
      ],
      education: [
        {
          id: "edu-2",
          degree: "BA Graphic Design",
          school: "Kenyatta University",
          year: "2017"
        }
      ],
      skills: ["Creative Direction", "Adobe CC", "Team Leadership"]
    }
  },
  {
    id: "3",
    title: "UX Research Strategist",
    company: "Global Tech",
    lastUpdated: "Aug 12, 2023",
    matchScore: 75,
    atsStatus: "Average",
    tags: ["Research", "Strategy"],
    isRecent: false,
    image: "/resume-3.jpg",
    content: {
      summary: "UX Researcher specializing in quantitative and qualitative analysis.",
      experience: [
        {
          id: "exp-3",
          role: "UX Researcher",
          company: "Global Tech",
          duration: "2016 - 2018",
          description: [
            "Conducted over 100 user interviews to guide product strategy."
          ]
        }
      ],
      education: [
        {
          id: "edu-3",
          degree: "MSc Human-Computer Interaction",
          school: "Stanford University",
          year: "2016"
        }
      ],
      skills: ["User Interviews", "Usability Testing", "Data Analysis"]
    }
  },
];

export interface Role {
  id: string;
  title: string;
  description: string;
  icon: string;
  demand: "HIGH DEMAND" | "STABLE" | "EMERGING";
  demandColor: string;
  trend: number;
  trendDirection: "up" | "down" | "stable";
}

export const TRENDING_ROLES: Role[] = [
  {
    id: "senior-devops",
    title: "Senior DevOps Engineer",
    description: "Infrastructure automation and scaling expert.",
    icon: "☁️",
    demand: "HIGH DEMAND",
    demandColor: "vs-badge vs-badge-danger",
    trend: 18,
    trendDirection: "up",
  },
  {
    id: "fullstack-dev",
    title: "Fullstack Developer",
    description: "Versatile architect across front-end and back-end.",
    icon: "</> ",
    demand: "STABLE",
    demandColor: "vs-badge vs-badge-neutral",
    trend: 2.4,
    trendDirection: "up",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "ML modeling and predictive analytics leader.",
    icon: "📊",
    demand: "HIGH DEMAND",
    demandColor: "vs-badge vs-badge-danger",
    trend: 12,
    trendDirection: "up",
  },
  {
    id: "ai-research",
    title: "AI Research Lead",
    description: "Pioneering LLM and generative AI strategy.",
    icon: "🧠",
    demand: "EMERGING",
    demandColor: "vs-badge vs-badge-warning",
    trend: 45,
    trendDirection: "up",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    description: "Expert in UX strategy and visual design systems.",
    icon: "🎨",
    demand: "STABLE",
    demandColor: "vs-badge vs-badge-neutral",
    trend: 0.8,
    trendDirection: "up",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    description: "Protecting enterprise assets from threats.",
    icon: "🛡️",
    demand: "HIGH DEMAND",
    demandColor: "vs-badge vs-badge-danger",
    trend: 22,
    trendDirection: "up",
  },
];

export interface Highlight {
  id: string;
  title: string;
  description: string;
  tags: string[];
  selected?: boolean;
}

export const GITHUB_PROJECTS: Highlight[] = [
  {
    id: "quantum-viz",
    title: "quantum-viz-engine",
    description:
      "Real-time data visualization library utilizing WebGL and WebAssembly for high-performance rendering.",
    tags: ["TypeScript", "1.2k"],
    selected: true,
  },
  {
    id: "distributed-ledger",
    title: "distributed-ledger-alpha",
    description:
      "Research implementation of a BFT consensus algorithm for micro-networks.",
    tags: ["Rust", "84"],
    selected: false,
  },
];

export const EDUCATION: Highlight[] = [
  {
    id: "stanford",
    title: "Advanced Machine Learning",
    description: "STANFORD UNIVERSITY • A+ Top 2% of Class",
    tags: [],
    selected: true,
  },
  {
    id: "mit",
    title: "Complex Systems Design",
    description: "MIT OPENCOURSEWARE • Verified Certificate",
    tags: [],
    selected: false,
  },
];

export const SKILLS: Highlight[] = [
  {
    id: "architecture",
    title: "System Design",
    description: "ARCHITECTURE",
    tags: [],
    selected: true,
  },
  {
    id: "cloud",
    title: "AWS Solutions",
    description: "CLOUD",
    tags: [],
    selected: true,
  },
  {
    id: "backend",
    title: "GraphQL",
    description: "BACKEND",
    tags: [],
    selected: true,
  },
];
