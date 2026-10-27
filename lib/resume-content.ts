export type ResumeFocus = "ai" | "data";

export const experience = [
  {
    date: "AUG 2025 — PRESENT",
    title: "Associate AI/ML Engineer",
    type: "Full-time",
    company: "Gaude Business & Infrastructure Solutions",
    location: "Trivandrum, India",
    description: "Building AI-driven content systems, RAG workflows, backend services, and full-stack product capabilities."
  },
  {
    date: "MAY 2025 — AUG 2025",
    title: "AI/ML Intern",
    type: "Apprenticeship",
    company: "Gaude Business & Infrastructure Solutions",
    location: "Trivandrum, India",
    description: "Contributed to applied AI and automation work while growing from prototype thinking into production engineering."
  },
  {
    date: "SEP 2024 — MAR 2025",
    title: "Software Engineering Intern",
    type: "Internship",
    company: "Center for Astrology Research & Development (CARD)",
    location: "",
    description: "Developed AstroLedger, an offline-first, cross-platform practice management application. Implemented desktop-led local sync using REST APIs, WebSockets, QR-based pairing over private Wi-Fi, and an offline mutation queue. Packaged releases for Windows and Android."
  }
] as const;

export const resumeFocuses = {
  ai: {
    label: "AI / GenAI",
    title: "AI and Generative AI",
    intro: "A focused view of my work building generative products, retrieval workflows, and the engineering that makes AI useful in production.",
    prioritySkills: ["Generative AI", "Vertex AI · Gemini", "RAG · LangChain", "Python", "Image generation pipelines", "Django · FastAPI"],
    skillGroups: [
      { label: "AI & MODELS", skills: ["Generative AI", "Vertex AI", "Gemini", "RAG", "LangChain", "scikit-learn", "TensorFlow", "Hugging Face"] },
      { label: "GENERATION WORKFLOWS", skills: ["Image generation", "Audio generation", "Prompt engineering", "Batch processing", "PDF generation", "Stability AI", "Replicate", "ElevenLabs"] },
      { label: "PRODUCT ENGINEERING", skills: ["Python", "Django", "FastAPI", "React", "TypeScript", "SQL", "PostgreSQL"] },
      { label: "PLATFORM", skills: ["Google Cloud", "Vertex AI", "Neon", "Vercel", "API integration"] }
    ],
    evidence: [
      {
        number: "01",
        title: "Generative AI Publishing Platform · Mythora",
        summary: "Built connected story, image, audio, and publishing workflows for illustrated books.",
        points: [
          "Designed reusable layered image templates so generic backgrounds can be created once and reused across books, with customizable layers generated separately.",
          "Reduced customizable cover generation from about 5–6 minutes to around 2 minutes. Batch generation of 15–45 images took roughly one-third to one-fifth of the original time, depending on model availability and region.",
          "Reduced faulty-image regeneration through template and resemblance checks, and improved theme and regional-context alignment. Cost controls also included routing providers by cost/quality and reusing cached or tuned prompts to avoid redundant calls."
        ],
        tags: ["Vertex AI · Gemini", "Django", "React", "Image & audio generation", "PDF generation"]
      },
      {
        number: "02",
        title: "MUDU NeoBench",
        summary: "Backend and AI-assisted assessment workflows with analytics designed to avoid unnecessary model calls.",
        points: [
          "Built API and data foundations with FastAPI, PostgreSQL, SQLAlchemy, and Alembic.",
          "Connected assessment content and quiz-generation workflows to Vertex AI / Gemini; kept dashboard analytics data-driven instead of regenerating them with a model on each load."
        ],
        tags: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Vertex AI", "Analytics"]
      },
      {
        number: "03",
        title: "AuraFit",
        summary: "An AI-assisted pantry and fitness product that turns available ingredients and goals into practical meal plans.",
        points: ["Connected a React and Django REST product to Gemini meal planning, nutrition-aware workflows, and a PostgreSQL-backed application."],
        tags: ["Gemini", "Django REST", "React", "PostgreSQL"]
      }
    ]
  },
  data: {
    label: "Data / Backend",
    title: "Data and Backend Engineering",
    intro: "A view emphasizing Python services, relational data, processing pipelines, integrations, and offline-capable application architecture.",
    prioritySkills: ["Python", "SQL", "PostgreSQL · MySQL", "Data pipelines", "FastAPI · Django REST", "SQLAlchemy · Alembic"],
    skillGroups: [
      { label: "DATA WORK", skills: ["Python", "SQL", "pandas", "NumPy", "Data processing", "Dataset integration", "Annotation workflows", "Document validation"] },
      { label: "DATABASES", skills: ["PostgreSQL", "MySQL", "SQLAlchemy", "Alembic", "SQLite", "IndexedDB"] },
      { label: "BACKEND & APIS", skills: ["FastAPI", "Django REST Framework", "Async services", "REST APIs", "WebSockets", "Authentication"] },
      { label: "ANALYTICS & PLATFORM", skills: ["Data-driven dashboards", "scikit-learn", "TensorFlow", "Google Cloud", "TypeScript", "React"] }
    ],
    evidence: [
      {
        number: "01",
        title: "MUDU NeoBench",
        summary: "Assessment platform work spanning service APIs, relational data, and analytics.",
        points: [
          "Built backend capabilities with FastAPI, PostgreSQL, async SQLAlchemy, JWT-based access, and Alembic migrations.",
          "Kept analytics data-driven, reducing repeated model work and avoiding unnecessary generation on dashboard loads."
        ],
        tags: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic"]
      },
      {
        number: "02",
        title: "AstroLedger · CARD",
        summary: "A local-first practice management system built to work across desktop and mobile without relying on cloud connectivity.",
        points: [
          "Implemented local REST and WebSocket communication, QR-based pairing over private Wi-Fi, and an offline mutation queue.",
          "Worked with a desktop-led data model and an offline mobile companion; packaged releases for Windows and Android."
        ],
        tags: ["Django", "React", "TypeScript", "SQLite", "IndexedDB", "WebSockets"]
      },
      {
        number: "03",
        title: "Carnatic Raga Dataset Pipeline",
        summary: "Research work combining music data, annotation, and model-training preparation.",
        points: ["Integrated and prepared annotated Carnatic music data for machine-learning workflows, including dataset processing and model experimentation."],
        tags: ["Python", "Dataset integration", "Annotation", "Machine learning"]
      }
    ]
  }
} as const;
