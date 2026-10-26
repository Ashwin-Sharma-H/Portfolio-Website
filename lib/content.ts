export type Project = {
  slug: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  problem: string;
  approach: string[];
  architecture: { label: string; detail: string }[];
  status: string;
  github?: string;
  live?: string;
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "aurafit",
    number: "01",
    category: "Generative AI · Full stack · PWA",
    title: "AuraFit",
    summary: "An AI-assisted pantry and fitness platform that turns what is on hand into practical, nutrition-aware meal plans.",
    role: "End-to-end project work described in my resume",
    stack: ["React", "Vite", "Django REST", "PostgreSQL", "Gemini", "PWA"],
    problem: "Meal planning often starts with scattered pantry information and goals that are hard to translate into a useful plan.",
    approach: [
      "Built a responsive pantry, meal-planning, and fitness experience around a React and Vite client and Django REST API.",
      "Connected meal suggestions to pantry contents and nutrition targets with Gemini.",
      "Added installable PWA behavior with app-shell caching for a quick, mobile-friendly experience.",
      "Deployed the frontend and backend as separate services, with the database hosted on Neon PostgreSQL."
    ],
    architecture: [
      { label: "Experience", detail: "React + Vite PWA" },
      { label: "Application API", detail: "Django REST Framework" },
      { label: "AI assistance", detail: "Gemini meal planning" },
      { label: "Data", detail: "PostgreSQL on Neon" }
    ],
    status: "Live application",
    github: "https://github.com/Ashwin-Sharma-H/AuraFit",
    live: "https://aura-fit-lime.vercel.app"
  },
  {
    slug: "astroledger",
    number: "02",
    category: "System architecture · Offline first · Cross platform",
    title: "AstroLedger",
    summary: "A privacy-focused practice management system designed to keep its primary records local while supporting desktop and mobile workflows.",
    role: "Public repository owner; individual feature attribution is not broken out in the repository",
    stack: ["React", "TypeScript", "Django", "Electron", "Capacitor", "SQLite", "IndexedDB"],
    problem: "A practice workflow needs to remain useful when internet connectivity is absent, while still linking a desktop workstation and a mobile companion.",
    approach: [
      "Structured the application around a local desktop host and an Android companion instead of requiring a cloud service.",
      "Documented local REST and WebSocket communication for pairing and synchronization over a private Wi-Fi network.",
      "Used SQLite for the desktop ledger and IndexedDB for mobile offline state and queued changes.",
      "Packaged the desktop and Android experiences with Electron and Capacitor."
    ],
    architecture: [
      { label: "Desktop", detail: "Electron · React · local Django service" },
      { label: "Authoritative data", detail: "SQLite on the desktop host" },
      { label: "Mobile companion", detail: "Capacitor · offline IndexedDB" },
      { label: "Local connection", detail: "REST + WebSockets over Wi-Fi" }
    ],
    status: "Public project",
    github: "https://github.com/Ashwin-Sharma-H/AstroLedger",
    note: "The repository describes the software as proprietary. This case study stays at the architecture level and includes no code, internal setup instructions, or screenshots."
  },
  {
    slug: "vanet-greyhole-detection",
    number: "03",
    category: "Machine learning · Network security · Research",
    title: "Greyhole Attack Detection in VANETs",
    summary: "A hybrid detection approach for identifying suspicious packet-dropping behavior in vehicular ad-hoc networks.",
    role: "Implemented the approach described in my resume",
    stack: ["Python", "Machine Learning", "Time series", "VANET"],
    problem: "Greyhole behavior can be difficult to distinguish from changing network conditions in a mobile vehicular network.",
    approach: [
      "Combined speed-based clustering with threshold-based classification to flag suspicious behavior.",
      "Added centralized monitoring to review local alerts and help reduce false positives in simulation.",
      "The public repository also describes a hybrid machine-learning and Dynamic Time Warping direction; detailed implementation and evaluation remain limited in the public documentation."
    ],
    architecture: [
      { label: "Network observations", detail: "Vehicle and packet behavior" },
      { label: "Local signals", detail: "Clustering + threshold checks" },
      { label: "Alert review", detail: "Centralized monitoring" },
      { label: "Evaluation", detail: "Simulation-based research" }
    ],
    status: "Research project",
    github: "https://github.com/Ashwin-Sharma-H/Detection-of-Smart-GrayHole-Attack-in-VANET-using-Logistic-regression-and-Time-Series-Analysis-",
    note: "No detection-accuracy metric is shown because a reliable, attributable result was not established in the available materials."
  }
];

export type ProfessionalProject = {
  slug: string;
  number: string;
  title: string;
  description: string;
  contribution: string;
  optimizationHighlights?: { title: string; detail: string }[];
  technologies: string[];
  status: string;
};

export const professionalProjects: ProfessionalProject[] = [
  {
    slug: "generative-ai-publishing-platform",
    number: "01",
    title: "Generative AI Publishing Platform",
    description: "An end-to-end generative content and digital publishing system that brings text, media, and document output into a connected workflow.",
    contribution: "Built the platform end to end, including AI-assisted generation and publishing workflows.",
    optimizationHighlights: [
      {
        title: "Reusable, layered image templates",
        detail: "Designed book artwork as reusable layers, separating generic backgrounds from customizable content. A template image could be generated once and reused across books built from that template, reducing repeated image generation and its associated cost."
      },
      {
        title: "Faster customizable covers",
        detail: "Reduced cover generation from about 5–6 minutes to around 2 minutes by generating from the layered template, while keeping the cover customizable."
      },
      {
        title: "Batch image-generation throughput",
        detail: "Optimized batch processing for batches of roughly 15–45 images. Generation time fell to around one-third to one-fifth of the previous time, depending on the selected Google Cloud model, its availability, and region."
      },
      {
        title: "Fewer full image regenerations",
        detail: "Introduced a strict template structure and visual-resemblance matching for replacements. Faulty images could be regenerated against the established design instead of rebuilding them from scratch, significantly reducing repeat generation."
      },
      {
        title: "Stronger theme and regional alignment",
        detail: "Improved generation logic to follow the selected theme and story context more closely, including regional objects and scenery, reducing off-context results in regional stories."
      }
    ],
    technologies: ["Django", "React", "LLM APIs", "Image and audio generation", "PDF generation"],
    status: "Professional work · Details generalized"
  },
  {
    slug: "employee-work-update-platform",
    number: "02",
    title: "Employee Work-Update Platform",
    description: "A web application for recording work updates, viewing weekly summaries, and exporting reports, with authenticated access and task synchronization.",
    contribution: "Built the application end to end.",
    technologies: ["Django REST", "React", "PostgreSQL", "JWT", "Reporting"],
    status: "Professional work · Details generalized"
  },
  {
    slug: "reusable-learning-platform-architecture",
    number: "03",
    title: "Reusable Learning Platform Architecture",
    description: "A team-built learning application was specialized into a more generic architecture designed to support learning contexts beyond company training.",
    contribution: "Extended and generalized the architecture; the original application was developed by the team.",
    technologies: ["FastAPI", "React", "PostgreSQL", "Role-based workflows", "AI-assisted content"],
    status: "Professional work · Details generalized"
  },
  {
    slug: "guided-exercise-tracking-platform",
    number: "04",
    title: "Guided Exercise Tracking Platform",
    description: "A generic web and mobile platform architecture with early evaluation of candidate pose models for movement tracking.",
    contribution: "Built the generic architecture and compared suitable model options, including initial performance and feasibility testing.",
    technologies: ["Django REST", "Next.js", "Expo", "On-device pose models", "Model evaluation"],
    status: "Current project · In development"
  }
];

export const certifications = [
  { name: "Agentic AI Certified Foundations Associate", issuer: "Oracle", issued: "Sep 2026" },
  { name: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional", issuer: "Oracle", issued: "Oct 2025", expires: "Oct 2027" },
  { name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate", issuer: "Oracle", issued: "Oct 2025", expires: "Oct 2027" },
  { name: "Oracle Cloud Infrastructure 2025 Data Science Professional", issuer: "Oracle", issued: "Oct 2025", expires: "Oct 2027" },
  { name: "SQL (Basics)", issuer: "HackerRank", issued: "Jun 2022" }
];

export const github = "https://github.com/Ashwin-Sharma-H";
export const linkedin = "https://www.linkedin.com/in/ashwin-sharma-h/";
export const certificationsUrl = "https://www.linkedin.com/in/ashwin-sharma-h/details/certifications/";
