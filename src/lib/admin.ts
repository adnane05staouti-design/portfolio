/**
 * The admin (/keystatic) is available:
 *  - locally with `npm run dev` (edits are saved to the project files), or
 *  - online only when GitHub storage is configured (login with GitHub required,
 *    only accounts with write access to the repository can edit).
 * Otherwise it is disabled, so nobody can reach it on the public site.
 */
export const isAdminEnabled =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";
