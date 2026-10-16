# City Store reels: standing rules for Claude

See `README.md` (pipeline, one row per reel) and `docs/HANDOFF_PROMPT.md` (full brief). Rules added by the user:

- **"Premier arrivé, premier servi" → same cover stamp.** Whenever a reel's script contains "premier arrivé, premier
  servi", its cover must include `<FirstServedStamp />` from `src/components/FirstServedStamp.tsx` (the HERO10 cover
  is the reference: `src/reels/hero10/Hero10Cover.tsx`). Don't restyle it; only nudge `right` / `top` if the product
  layout needs it.
- **Used products (d'occasion):** never claim "Boîte fermée / Jamais ouverts / Jamais activés" in the trust scene;
  use `ChecklistTrust` with true items (see `src/reels/hero10/Hero10Reel.tsx`).
