"""E-readers (Kindle 11th gen Vert + Noir, Kobo Libra Colour Noir) -> assets/readers2/products/ + public/readers2/products/
(official renders supplied by City Store, transparent). Cropped to alpha, enhanced (Lanczos + unsharp + slight contrast),
defringe. Screens show book pages / a French planner page (content, not marketing text).
- black: Kindle 11th gen Noir front (kindle11_black_front, 900 x 1200, supplied for the Kindle 11 reel), enhanced 1.2x.
- green_pair: Kindle 11th gen Vert, back + front (kindle11_green_pair, 301 px), enhanced 3x. Its page is an English poem
  (book content, kept small; not marketing copy).
- black_pair: Kindle 11th gen Noir, back + front (kindle11_black_pair, 301 px, French page), enhanced 3x.
- kobo: Kobo Libra Colour Noir (kobo_libra_colour_black, 190 x 253 px, French planner page "Cette semaine"), enhanced 3.5x.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "readers2" / "products" / "src"
dst = ROOT / "assets" / "readers2" / "products"
pub = ROOT / "public" / "readers2" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "readers2" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


def enhance(im, k):
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    a = im.getchannel("A")
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.5, percent=90, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


manifest = {}
for key, name, k in [("black", "kindle11_black_front.png", 1.2), ("green_pair", "kindle11_green_pair.png", 3.0),
                     ("black_pair", "kindle11_black_pair.png", 3.0), ("kobo", "kobo_libra_colour_black.png", 3.5)]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(enhance(defringe(im), k))
    im.thumbnail((1100, 1100), Image.LANCZOS)
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"readers2/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "readers2" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
