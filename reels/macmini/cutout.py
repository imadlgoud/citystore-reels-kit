"""Mac mini M6 images -> assets/macmini/products/ + public/macmini/products/ (official Apple renders supplied by City Store,
already transparent; the Apple logo only appears on the official top view, as allowed).
- back (359 px, ports): enhanced x2.6. front (1499 px): downscaled to 1200. top (1500 px, Apple logo): downscaled to 1000.
- NOT_USED_m6_chip_hand.png: NOT an official photo (hand-held painted "M6" chip with an Apple logo over an older,
  wide Mac mini design) -> not used.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "macmini" / "products" / "src"
dst = ROOT / "assets" / "macmini" / "products"
pub = ROOT / "public" / "macmini" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "macmini" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


manifest = {}
for key, name, k in [("back", "macmini_m6_back.png", 2.6), ("front", "macmini_m6_front.webp", 1200 / 1499), ("top", "macmini_m6_top.webp", 1000 / 1500)]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    if k > 1:
        a = im.getchannel("A")
        rgb = ImageEnhance.Contrast(im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=90, threshold=2))).enhance(1.04)
        rgb.putalpha(a)
        im = rgb
    im = defringe(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"macmini/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "macmini" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
