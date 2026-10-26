"""Galaxy A16 (Noir) images -> assets/a16/products/ + public/a16/products/ (official Samsung renders supplied by City Store,
already transparent, but only 301 px). Enhanced 3x: Lanczos upscale + unsharp + slight contrast, then defringe.
- pair: back + front pair (a16_front_back.png): the Samsung wallpaper on the screen, no text overlay.
- back: back alone (a16_back.png). The "SAMSUNG" print is the product's own branding.
SKIPPED: a16_closeup.png (the phones are cut by the image frame on two sides) and a16_angle.png (the phone is only ~45 px
wide, too small to enhance cleanly).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "a16" / "products" / "src"
dst = ROOT / "assets" / "a16" / "products"
pub = ROOT / "public" / "a16" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "a16" / "data").mkdir(parents=True, exist_ok=True)


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
for key, name in [("pair", "a16_front_back.png"), ("back", "a16_back.png")]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = enhance(defringe(im), 3.0)
    im = defringe(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"a16/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "a16" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
