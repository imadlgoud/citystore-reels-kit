"""Apple Pencil range images -> assets/pencils/products/ + public/pencils/products/ (official Apple renders supplied by
City Store, transparent; the Apple logo printed on the pencils is part of the official photos, as allowed).
Each pencil is cropped to its alpha and upscaled to ~940 px tall (Lanczos + unsharp), defringe.
Identification (checked on the renders, not just the file order):
- pro: "Pencil Pro" print (pencil_pro).
- gen2: flat side, "Pencil" print, no cap seam (pencil_2nd_gen).
- gen1: round, silver band + cap (pencil_1st_gen).
- usbc: flat side, "Pencil" print and a cap seam near the top (sliding cap over the USB-C port) (pencil_usbc).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "pencils" / "products" / "src"
dst = ROOT / "assets" / "pencils" / "products"
pub = ROOT / "public" / "pencils" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "pencils" / "data").mkdir(parents=True, exist_ok=True)
TARGET_H = 940


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
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=70, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.03)
    rgb.putalpha(a)
    return rgb


manifest = {}
for key, name in [("pro", "pencil_pro.png"), ("gen2", "pencil_2nd_gen.png"), ("gen1", "pencil_1st_gen.png"), ("usbc", "pencil_usbc.png")]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(enhance(defringe(im), TARGET_H / im.height))
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"pencils/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "pencils" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
