# MacBook Air M4 + cadeau surprise AD: sources and notes

- **Hook footage:** `assets/adair/clip/store_robot_hook.mp4` (City Store's robot in the shop, 5.08 s, 720x1280, no audio),
  retimed to the VO (`public/adair/clip/hook.mp4`, 1080x1920, 5.53 s): 0-1.4 s 1x; the lift 1.35x so the box comes
  up on "cadeau surprise"; the first head turn 1x on "وماشي غير هادي" (punch zoom x1.5); the second turn slowed to
  0.385x with motion interpolation on "عندنا كلشي" (second punch zoom). Stills from the same clip: `store_bg.jpg`
  (trust scene, blurred), `robot_hold.jpg` (end card), `robot_lift.jpg` (cover).
- **VO:** supplied take, 24.37 s, kept at its own pacing (no trims, no speed-up), -14 LUFS. Phrase windows from ffmpeg
  silencedetect; the product cuts land on each spoken name.
- **Product images:** official renders already in the repo from the price-list stories:
  - iPhone 18 Pro Max, MacBook Pro 14, iPad Pro 13, AirPods Pro 3, Apple Watch Ultra 4, Galaxy S26 Ultra
  - gaming is a drawn controller (no game art)
- **Music:** original (`scripts/make_music.py`, style "adair"); SFX from the kit.
- **Edit style (ad, not the reel template):** real footage, punch zooms, hard colour-block cuts with giant outlined
  names, word-by-word captions with the current word highlighted, gift reveal with confetti, trust cards (three straight, aligned, equal-width cards with green checks) on a dark navy background with a
  soft glow and faint grid (the blurred shop background was replaced on request), CTA over the robot freeze frame, small logo bug, film grain.
- **Offer:** "cadeau surprise" (content not revealed) for everyone's first order, as stated by City Store; on-screen
  note "Cadeau surprise offert pour toute première commande". Warranty length not stated (not confirmed).
