# PS5 Slim Digital Edition 1 To story: sources
- `src/ps5_slim_digital_box.png` (301 px, transparent, supplied by City Store): the retail box (Sony PS5 Slim Digital
  Edition, multilingual product name, PEGI marks), upscaled 3x -> `public/pricelist/ps5/slim_digital_box.png`.
  Single-product story: the template draws one large hero card when a list has a single product.
- Replaced on request by `src/ps5_slim_digital_box_angle.png` (301 px, 3/4 view of the box), upscaled 3x -> `slim_digital_box_angle.png`.
- Enhanced with `scripts/upscale_ai.py` (EDSR x4 AI super-resolution; the "8K/4K/HDR" badges and the small caption are taken from a plain Lanczos x4 because EDSR garbled them):
  `python3 scripts/upscale_ai.py assets/pricelist/ps5/src/ps5_slim_digital_box_angle.png public/pricelist/ps5/slim_digital_box_angle.png 750,70,1100,160 700,535,1010,590`
