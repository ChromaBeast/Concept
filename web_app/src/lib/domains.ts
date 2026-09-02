import { Category } from "./types";

export interface CategoryDomain {
  id: string;
  label: string;
  icon: string;
  categories: Category[];
}

export const CATEGORY_DOMAINS: CategoryDomain[] = [
  {
    id: "all",
    label: "All Domains",
    icon: "Grid",
    categories: [
      "dsa",
      "system_design",
      "databases",
      "operating_systems",
      "networking",
      "oop_design_patterns",
      "frontend",
      "backend",
      "devops_infra",
      "security",
      "testing_qa",
      "version_control",
      "cloud",
      "ml_basics",
      "behavioral_interview",
      "language_specific",
    ],
  },
  {
    id: "core-cs",
    label: "Core CS",
    icon: "Cpu",
    categories: ["dsa", "databases", "operating_systems", "networking"],
  },
  {
    id: "systems-cloud",
    label: "Systems & Cloud",
    icon: "Cloud",
    categories: ["system_design", "cloud", "devops_infra", "security"],
  },
  {
    id: "software-dev",
    label: "Software & Web",
    icon: "Code",
    categories: [
      "frontend",
      "backend",
      "oop_design_patterns",
      "language_specific",
    ],
  },
  {
    id: "practices-career",
    label: "Practices & Career",
    icon: "Brain",
    categories: [
      "testing_qa",
      "version_control",
      "ml_basics",
      "behavioral_interview",
    ],
  },
];
