import type { Localized } from "@/lib/i18n";

/** AOS ABHBC architecture, verified against docker-compose.yml, nginx.conf and the backend code. */
export type ArchNode = {
  id: string;
  title: string;
  tech: string;
  description: Localized;
};

export const requestFlow: ArchNode[] = [
  {
    id: "browser",
    title: "Browser",
    tech: "React · Vite · React Router · Axios",
    description: {
      en: "Single-page application in Arabic. An Axios interceptor attaches the JWT to every call to the relative /api path and sends the user back to login on 401/403 — the API remains the only authority.",
      fr: "Application monopage en arabe. Un intercepteur Axios joint le JWT à chaque appel vers le chemin relatif /api et renvoie vers la connexion en cas de 401/403 — l'API reste la seule autorité.",
    },
  },
  {
    id: "nginx",
    title: "Nginx",
    tech: "nginx:alpine",
    description: {
      en: "Serves the React build (try_files → index.html for client-side routing) and proxies /api and /uploads to the backend, so the browser talks to a single origin and CORS disappears.",
      fr: "Sert le build React (try_files → index.html pour le routage côté client) et redirige /api et /uploads vers le backend : le navigateur ne parle qu'à une origine et la question du CORS disparaît.",
    },
  },
  {
    id: "api",
    title: "Spring Boot API",
    tech: "Java 21 · Spring Boot 3.5 · Spring Security",
    description: {
      en: "REST API that owns every business rule: JWT authentication, role checks with @PreAuthorize, validation, transactions, file storage and scheduled tasks.",
      fr: "API REST qui porte toutes les règles métier : authentification JWT, contrôle des rôles avec @PreAuthorize, validation, transactions, stockage des fichiers et tâches planifiées.",
    },
  },
  {
    id: "db",
    title: "PostgreSQL",
    tech: "PostgreSQL 17 · Flyway",
    description: {
      en: "Relational schema versioned with Flyway. Integrity is enforced in the database: unique reservation per user and day, foreign keys, cascade rules.",
      fr: "Schéma relationnel versionné avec Flyway. L'intégrité est garantie par la base : réservation unique par utilisateur et par jour, clés étrangères, règles de cascade.",
    },
  },
  {
    id: "telegram",
    title: "Telegram",
    tech: "Bot API",
    description: {
      en: "Notifications to the cook and to the announcements channel, a weekday recap at 11:00, and auto-registration through short polling windows. Failures are logged, never propagated to the user.",
      fr: "Notifications au cuisinier et au canal d'annonces, récap en semaine à 11h et auto-enregistrement via de courtes fenêtres de polling. Les échecs sont journalisés, jamais propagés à l'utilisateur.",
    },
  },
];

export const backendLayers: { name: string; role: Localized }[] = [
  { name: "Security filter", role: { en: "Validates the JWT, loads the user and roles", fr: "Valide le JWT, charge l'utilisateur et ses rôles" } },
  { name: "Controller", role: { en: "HTTP endpoints, DTOs in and out, @PreAuthorize", fr: "Endpoints HTTP, DTO en entrée et sortie, @PreAuthorize" } },
  { name: "Service", role: { en: "Business rules, @Transactional boundaries", fr: "Règles métier, frontières @Transactional" } },
  { name: "Repository", role: { en: "Spring Data JPA queries", fr: "Requêtes Spring Data JPA" } },
  { name: "Entity", role: { en: "JPA mapping of the PostgreSQL schema", fr: "Mapping JPA du schéma PostgreSQL" } },
];

export const composeServices: { name: string; image: string; detail: Localized }[] = [
  { name: "frontend", image: "node:20 → nginx:alpine", detail: { en: "Multi-stage build · port 80", fr: "Build multi-étapes · port 80" } },
  { name: "backend", image: "maven:3.9 → temurin:21-jre", detail: { en: "Multi-stage build · uploads volume", fr: "Build multi-étapes · volume uploads" } },
  { name: "postgres", image: "postgres:17", detail: { en: "Persistent data volume", fr: "Volume de données persistant" } },
];
