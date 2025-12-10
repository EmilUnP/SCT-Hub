import { Service, Training, News, SERPModule, TeamMember } from "@/types";

export const services: Service[] = [
  {
    id: "accounting",
    title: "Accounting Services",
    description: "Comprehensive accounting solutions for your business",
    icon: "Calculator",
    category: "accounting",
    features: [
      "Bookkeeping & Ledger Management",
      "Financial Reporting",
      "Accounts Payable & Receivable",
      "Bank Reconciliation",
      "Month-end Closing",
    ],
    serpIntegrated: true,
  },
  {
    id: "tax",
    title: "Tax Services",
    description: "Expert tax planning and compliance services",
    icon: "FileText",
    category: "tax",
    features: [
      "Tax Planning & Strategy",
      "Tax Return Preparation",
      "Tax Compliance",
      "Tax Consulting",
      "IRS Audit Support",
    ],
    serpIntegrated: true,
  },
  {
    id: "hr",
    title: "HR & Personnel Management",
    description: "Complete HR outsourcing solutions",
    icon: "Users",
    category: "hr",
    features: [
      "Payroll Management",
      "Employee Records",
      "HR Documentation",
      "Compliance Management",
      "Performance Management",
    ],
    serpIntegrated: true,
  },
  {
    id: "audit",
    title: "Audit Services",
    description: "Professional audit and assurance services",
    icon: "Shield",
    category: "audit",
    features: [
      "Financial Statement Audits",
      "Internal Audits",
      "Compliance Audits",
      "Risk Assessment",
      "Audit Reports",
    ],
    serpIntegrated: false,
  },
  {
    id: "serp-integration",
    title: "SERP Integration",
    description: "Seamless integration with SERP business management system",
    icon: "Database",
    category: "serp",
    features: [
      "System Integration",
      "Data Migration",
      "Custom Workflows",
      "Training & Support",
      "Ongoing Maintenance",
    ],
    serpIntegrated: true,
  },
];

export const trainings: Training[] = [
  {
    id: "serp-basics",
    title: "SERP System Fundamentals",
    description: "Learn the basics of SERP system for accounting professionals",
    category: "SERP Training",
    duration: "2 days",
    trainer: "Expert Trainer",
    price: "$299",
    date: "2025-01-15",
  },
  {
    id: "tax-compliance",
    title: "Tax Compliance Workshop",
    description: "Deep dive into tax compliance and regulations",
    category: "Tax Training",
    duration: "1 day",
    trainer: "Tax Specialist",
    price: "$199",
    date: "2025-01-20",
  },
  {
    id: "hr-management",
    title: "HR Management Best Practices",
    description: "Comprehensive HR management training for professionals",
    category: "HR Training",
    duration: "3 days",
    trainer: "HR Expert",
    price: "$399",
    date: "2025-02-01",
  },
  {
    id: "financial-reporting",
    title: "Advanced Financial Reporting",
    description: "Master financial reporting with SERP system",
    category: "Accounting Training",
    duration: "2 days",
    trainer: "CFO Consultant",
    price: "$349",
    date: "2025-02-10",
  },
];

export const news: News[] = [
  {
    id: "news-1",
    title: "New SERP Module Released",
    excerpt: "We're excited to announce the release of our new SERP module with enhanced features",
    content: "Full content about the new SERP module release...",
    category: "Product Updates",
    date: "2025-12-01",
  },
  {
    id: "news-2",
    title: "Tax Law Changes 2025",
    excerpt: "Important tax law changes coming in 2025 that affect your business",
    content: "Full content about tax law changes...",
    category: "Tax Updates",
    date: "2025-11-25",
  },
  {
    id: "news-3",
    title: "HR Compliance Workshop",
    excerpt: "Join our free HR compliance workshop next month",
    content: "Full content about the HR workshop...",
    category: "Events",
    date: "2025-11-20",
  },
];

export const serpModules: SERPModule[] = [
  {
    id: "financial",
    title: "Financial Management",
    description: "Complete financial management and accounting module",
    icon: "TrendingUp",
  },
  {
    id: "hr",
    title: "Human Resources",
    description: "Comprehensive HR and payroll management system",
    icon: "Users",
  },
  {
    id: "inventory",
    title: "Inventory Management",
    description: "Advanced inventory tracking and management",
    icon: "Package",
  },
  {
    id: "reporting",
    title: "Reporting & Analytics",
    description: "Real-time reporting and business analytics",
    icon: "BarChart",
  },
  {
    id: "integration",
    title: "Third-party Integration",
    description: "Seamless integration with external systems",
    icon: "Link",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Emil Babayev",
    role: "CEO & Founder",
    bio: "20+ years of experience in accounting and business consulting. Expert in business development in Azerbaijan",
  },
  {
    id: "2",
    name: "Leyla Məmmədova",
    role: "Head of Accounting",
    bio: "Expert in financial management and SERP systems. Extensive experience in financial services in Baku",
  },
  {
    id: "3",
    name: "Rəşad Həsənov",
    role: "HR Director",
    bio: "HR professional specializing in outsourcing and compliance. Consultant for Azerbaijan job market",
  },
];

export const statistics = {
  clients: 500,
  yearsExperience: 15,
  services: 20,
  trainings: 50,
};

