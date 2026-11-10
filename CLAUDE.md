# City Store reels: standing rules for Claude

See `README.md` (pipeline, one row per reel) and `docs/HANDOFF_PROMPT.md` (full brief). Rules added by the user:

- **"Premier arrivé, premier servi" → same cover stamp.** Whenever a reel's script contains "premier arrivé, premier
  servi", its cover must include `<FirstServedStamp />` from `src/components/FirstServedStamp.tsx` (the HERO10 cover
  is the reference: `src/reels/hero10/Hero10Cover.tsx`). Don't restyle it; only nudge `right` / `top` if the product
  layout needs it.
- **Used products (d'occasion):** never claim "Boîte fermée / Jamais ouverts / Jamais activés" in the trust scene;
  use `ChecklistTrust` with true items (see `src/reels/hero10/Hero10Reel.tsx`).
- **Every reel gets a reel description (caption).** With every delivered video, also give the user a ready-to-paste
  caption in the chat and save it as `reels/<id>/caption.md` (committed). Style (see `reels/rbrange/caption.md`):
  Darija + French like the script; first line = the hook from the VO; product name + DISPONIBLE line; short bullet
  lines with the specs **from the script only** (no extra claims); the trust line exactly as spoken (singular/plural,
  neuf / occasion as the VO says); CTA "إلا بغيتي تكوموندي، صيفط لينا ميساج." + citystore.ma; hashtags at the end.
  **Minimal emojis**: only 📩 before the CTA and 🌐 before citystore.ma, none elsewhere.
- **Product-first hook (every new reel).** The hook scene uses `<ProductHook />` from `src/components/ProductHook.tsx`
  (reference: `APHook` in `src/reels/airpods5b/APScenes.tsx`). The real product and the VO hook line are fully visible
  from frame 0: no pop-in, no white flash, no drawn-only opening. The second half of the hook comes in as `punch`. Set
  `hookCorner: true` in the Direction so Citybot starts in the corner. Older reels are left as they are unless the
  user asks to re-cut them.
