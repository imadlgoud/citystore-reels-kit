"""Apple Watch Ultra 4 (49 mm, Natural Titanium, Ocean Band) images -> assets/ultra4/products/ + public/ultra4/products/.
Official Apple renders supplied by City Store (Apple logo rule: official product photos are fine).
- front (349x573, white bg): flat-background matte (scripts/cutout_products.py), enclosed areas kept (white UI digits); band ends cut by
  the frame feathered top/bottom; enhanced x2.4 (Lanczos + unsharp + slight contrast).
- angle (423x472, white bg): same matte, only large enclosed areas (inside the band loop) cleared, so the white UI digits stay; enhanced x2.
- side (1007x553, transparent): case + crown close-up; the band fades to black at the bottom of the render, so only the
  top 62 % is kept and its bottom edge is feathered.
Watch faces show the stock UI (time, complications), not marketing text.
"""
import json, pathlib, sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "scripts"))
from cutout_products import cutout  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "ultra4" / "products" / "src"
dst = ROOT / "assets" / "ultra4" / "products"
pub = ROOT / "public" / "ultra4" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "ultra4" / "data").mkdir(parents=True, exist_ok=True)


def enhance(im, k):
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    a = im.getchannel("A")
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=90, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


manifest = {}
cutout("ultra4_natural_ocean_front.png", "front_raw.png", (255, 255, 255), tol=6, soft=14, src_dir=src, dst_dir=dst,
       feather_edges=40, feather_sides=("top", "bottom"))
cutout("ultra4_natural_ocean_angle.png", "angle_raw.png", (255, 255, 255), tol=6, soft=14, src_dir=src, dst_dir=dst, hole_min_area=1500)
for key, k in [("front", 2.4), ("angle", 2.0)]:
    im = enhance(Image.open(dst / f"{key}_raw.png").convert("RGBA"), k)
    (dst / f"{key}_raw.png").unlink()
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"ultra4/products/{key}.png", "w": im.width, "h": im.height}
side = Image.open(src / "ultra4_natural_side.png").convert("RGBA")
side = side.crop((0, 0, side.width, round(side.height * 0.62)))
a = np.asarray(side).copy()
n = 60
a[-n:, :, 3] = (a[-n:, :, 3] * np.linspace(1, 0, n)[:, None] ** 1.3).astype(np.uint8)
side = Image.fromarray(a)
side = side.crop(side.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
side.save(dst / "side.png")
side.save(pub / "side.png")
manifest["side"] = {"src": "ultra4/products/side.png", "w": side.width, "h": side.height}
(ROOT / "public" / "ultra4" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
