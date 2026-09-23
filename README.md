# Portfolio — Adnane Staouti

Portfolio bilingue (EN / FR) : Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # optionnel : nécessaire seulement pour le formulaire de contact
npm run dev                  # http://localhost:3000 → redirige vers /en ou /fr
```

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build de production / serveur de production |
| `npm run lint` | ESLint |
| `npm run check:content` | Liste tous les placeholders `[ADD …]` restants |

## Espace admin (modifier le contenu sans code)

1. Lance le site : `npm run dev`
2. Ouvre **http://localhost:3000/keystatic**
3. Modifie ce que tu veux, puis clique sur **Save** :
   - **Profile** : nom, titre, intro, niveau, langues, disponibilité, photo, CV, liens, texte « About »
   - **Projects** : créer / modifier / supprimer un projet, images, captures, diagrammes UML, sections de l'étude de cas
   - **Experience**, **Education**, **Skills**, **Certifications**
4. Recharge la page du site : la modification apparaît tout de suite.

Les données sont enregistrées dans `src/content/` (fichiers JSON) et les images dans `public/`.
`npm run check:content` liste ce qu'il reste à compléter.

> En ligne (Vercel), l'admin est **désactivé** par défaut : personne ne peut y accéder.
> Pour l'utiliser en ligne, active le mode GitHub (voir plus bas) : la connexion se fait avec ton compte GitHub
> et seules les personnes qui ont accès au dépôt peuvent modifier.

### Captures d'écran AOS ABHBC

Avant de publier une capture : floute ou remplace les noms, emails et photos d'employés, les numéros de téléphone et les `chat_id` Telegram. Ne publie jamais d'identifiants de test ni de valeurs du `.env`.

## Déploiement sur Vercel

1. Pousse ce dossier sur un dépôt GitHub (public ou privé).
2. Sur vercel.com → **Add New Project** → importe le dépôt → **Deploy** (aucune config nécessaire).
3. Dans **Settings → Environment Variables**, ajoute `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
4. Redéploie. Chaque `git push` redéploie ensuite automatiquement.

Sans `RESEND_API_KEY`, le formulaire affiche un message invitant à écrire directement par email.

### Admin en ligne (optionnel)

Ajoute dans Vercel `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` et `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=<ton-compte>/<ton-dépôt>`,
puis ouvre `/keystatic` en local avec ces variables : Keystatic t'aide à créer l'application GitHub et donne
les variables `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` à ajouter dans Vercel.
Chaque « Save » crée alors un commit sur GitHub et Vercel republie le site automatiquement.

## Structure

```
src/
  app/[lang]/             pages (home, projects, projects/[slug]), layout, 404, image OG
  app/actions/contact.ts  envoi du formulaire (server action + Resend)
  app/sitemap.ts, robots.ts, manifest.ts, icon.svg
  components/ui/          Button, Badge, Reveal, SectionHeading, Placeholder…
  components/layout/      Navbar, Footer, ThemeToggle, LanguageSwitch
  components/sections/    Hero, About, Experience, Projects, Skills, Education, Contact…
  components/project/     ProjectCard, ProjectGrid, Gallery (lightbox), ArchitectureDiagram…
  content/                contenu (JSON modifié par l'admin)
  data/                   lecture du contenu → types utilisés par l'interface
  app/keystatic/          espace admin (Keystatic)
  dictionaries/           textes de l'interface EN / FR
  proxy.ts                redirection / → /en ou /fr selon la langue du navigateur
```
