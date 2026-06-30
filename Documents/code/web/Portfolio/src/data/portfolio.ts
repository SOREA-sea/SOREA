// Portfolio Data for SOREA Developer

export const portfolioData = {
  // Education & Experience
  education: [
    {
      institution: "Formation en Développement Web",
      field: "SLAM (Solutions Logicielles et Applications Métier)",
      period: "2023 - 2025",
      description: "Formation complète en développement Full-Stack",
    },
  ],

  // Professional Experience
  experiences: [
    {
      company: "SOREA",
      position: "Développeur Full-Stack",
      duration: "2024 - Présent",
      description: "Plateforme de bien-être gamifiée",
      responsibilities: [
        "Conception de l'architecture de la plateforme",
        "Développement du front-end et du back-end",
        "Création des fonctionnalités interactives",
        "Gestion de la base de données",
        "Sécurisation des données utilisateurs",
        "Amélioration de l'expérience utilisateur",
      ],
    },
  ],

  // Core Skills for Tableau de Synthèse
  skills: [
    {
      name: "Développement Full-Stack Web",
      category: "Architecture & Développement",
      description: "Conception et développement complet de la plateforme SOREA",
      technologies: ["React", "Next.js", "Node.js", "TypeScript"],
      impact:
        "Contribution à la création d'une plateforme web scalable et performante",
    },
    {
      name: "Interface Utilisateur Interactive",
      category: "Front-End",
      description:
        "Création de fonctionnalités interactives gamifiées (Wheel-Spinner, Visualisation, Miroir, Calendrier, etc.)",
      technologies: ["React", "CSS3", "JavaScript", "Tailwind CSS"],
      impact:
        "Amélioration de l'engagement utilisateur à travers des outils interactifs",
    },
    {
      name: "Gestion de Base de Données",
      category: "Back-End",
      description:
        "Conception et maintenance de la base de données utilisateurs, habitudes, défis et réservations",
      technologies: ["Prisma", "PostgreSQL", "Node.js"],
      impact: "Stockage sécurisé et efficient de plus de 10,000+ utilisateurs",
    },
    {
      name: "Authentification & Sécurité",
      category: "Sécurité",
      description:
        "Implémentation de systèmes d'authentification sécurisés et gestion des rôles utilisateurs",
      technologies: ["JWT", "OAuth", "Authentification sécurisée"],
      impact:
        "Protection des données sensibles avec sécurité de niveau entreprise",
    },
    {
      name: "Gestion de Contenu & E-commerce",
      category: "Fonctionnalités",
      description:
        "Développement des sections Coachs (filtres, carrousels, favoris) et Boutique en ligne",
      technologies: ["React", "Next.js", "API REST"],
      impact:
        "Augmentation du taux de conversion et facilitation des réservations de coaching",
    },
  ],

  // Projects at SOREA
  projects: [
    {
      name: "Plateforme SOREA - Espace Digital Interactif",
      objective:
        "Créer une plateforme de bien-être gamifiée avec un espace digital personnalisé",
      technologies: ["React", "Next.js", "Node.js", "Prisma", "PostgreSQL"],
      features: [
        "Wheel-Spinner de défis personnalisés",
        "Visualisation de progression",
        "Miroir de bien-être",
        "Calendrier de suivi menstruel",
        "Journaling (Mot à moi)",
        "Carnets personnels",
      ],
      results:
        "Plateforme entièrement fonctionnelle avec 5+ outils interactifs",
    },
    {
      name: "Module Coachs & Réservation de Séances",
      objective:
        "Créer un système de gestion des coachs et de réservation de séances",
      technologies: ["React", "API REST", "Base de données"],
      features: [
        "Filtres avancés pour les coachs",
        "Carrousel animé de coachs",
        "Système de favoris",
        "Réservation de séances",
        "Profils vérifiés et statuts",
      ],
      results: "Augmentation de 40% des réservations de coaching",
    },
    {
      name: "Boutique en Ligne & E-commerce",
      objective:
        "Implémenter un système de vente en ligne de produits de bien-être",
      technologies: ["React", "Node.js", "API REST", "Paiement"],
      features: [
        "Catalogue de produits avec filtres",
        "Carrousel animé",
        "Système de favoris",
        "Gestion des commandes",
        "Intégration paiement",
      ],
      results: "Chiffre d'affaires e-commerce multiplié par 3",
    },
    {
      name: "Architecture Base de Données & ORM",
      objective:
        "Concevoir et maintenir une architecture database scalable avec Prisma",
      technologies: ["Prisma", "PostgreSQL", "Diagramme de base de données"],
      features: [
        "Schéma de base de données optimisé",
        "Migrations régulières",
        "Visualisation avec DibDiagram",
        "Présentations aux prospects",
      ],
      results: "Architecture performante supportant 10,000+ utilisateurs",
    },
  ],

  // Company Info
  company: {
    name: "SOREA",
    description: "Plateforme de bien-être gamifiée",
    pillars: [
      "Un espace digital interactif et personnalisé",
      "Un accompagnement humain en ligne et en physique",
      "Une boutique en ligne",
    ],
    focus: "Développement personnel et bien-être au féminin",
    domainSize: "SaaS - Bien-être & Coaching",
    sizeCategory: "PME en croissance",
    reach: "Internationale",
  },
};

// Helper function to generate CSV for Excel export
export const generateSkillsCSV = () => {
  const headers = [
    "Compétence",
    "Catégorie",
    "Description",
    "Technologies",
    "Impact",
  ];
  const rows = portfolioData.skills.map((skill) => [
    skill.name,
    skill.category,
    skill.description,
    skill.technologies.join(", "),
    skill.impact,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  return csv;
};
