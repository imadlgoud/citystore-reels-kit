"""AirPods 5 images (second reel) -> assets/airpods5b/products/ + public/airpods5b/products/ (official Apple renders
supplied by City Store, transparent, 301 px). Cropped to alpha, enhanced 2.5x (Lanczos + unsharp), defringe.
No Apple logo is visible in these renders.
- open: earbuds lifted above the open case (airpods5_open_buds_up).
- case: case with the earbuds inside (airpods5_case_buds_in; the source is already soft from an earlier upscale).
(The 1000-2000 px renders used by the first AirPods 5 reel are not in the repository, so these are used.)
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "airpods5b" / "products" / "src"
dst = ROOT / "assets" / "airpods5b" / "products"
pub = ROOT / "public" / "airpods5b" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "airpods5b" / "data").mkdir(parents=True, exist_ok=True)


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
for key, name in [("open", "airpods5_open_buds_up.png"), ("case", "airpods5_case_buds_in.png")]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(enhance(defringe(im), 2.5))
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"airpods5b/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "airpods5b" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
