# GoPro HERO10 Black (used unit) reel: sources

## Images: City Store's own photos of the actual unit (supplied by City Store)
Originals in `assets/hero10/products/src/`: shot in hand in front of the shop backdrop. The backdrop repeats the store
logo, which contains an **apple mark**, and two photos show a wristband. To keep the Apple logo out (rule: never outside
official product photos) and keep the focus on the product, **every image was cut out to the product only**
(`reels/hero10/cutout.py`: OpenCV GrabCut seeded with backdrop / logo-blue / wood / skin = background and the dark
product = foreground; the open case uses a traced outline of its base). No backdrop, logo, hand or wristband remains.

| File | Used for | Treatment |
|---|---|---|
| `camera_front.webp` | hook, intro, 5.3K / 23 MP, HyperSmooth, waterproof + front screen, cover | product-only cut-out, x1.6 enhance |
| `camera_back.webp` | not used in the final cut (rear screen view; the front view tells the story) | cut out, available |
| `battery.webp` | kit scene ("batteries") | cut-out (convex hull for straight edges), x1.2 |
| `case_closed.webp` | kit scene ("الساكوش") | cut-out (thumb removed) |
| `case_open_kit.webp` | kit scene ("ready to film"): case base with camera, battery and mount | base-only cut-out (the lid and backdrop are dropped) |

The tray carries a small moulded "Recycle" mark (packaging, not marketing text).

## Specs shown (only what the VO says)
- 5.3K video, 23 MP photos; HyperSmooth (run / jump / fall).
- Waterproof to 10 m. Footnote: "10 m : spécification d'origine" (it is a used unit).
- Front screen to see yourself while filming.
- Comes with the case and batteries (the number of batteries is not shown: **to confirm**).
- Trust scene adapted to a used product: "OCCASION TESTÉE" / Produit d'occasion / Testé / Fonctionne bien, plus
  "PREMIER ARRIVÉ, PREMIER SERVI !" (the standard "boîte fermée / jamais ouverts / jamais activés" would be false here).
