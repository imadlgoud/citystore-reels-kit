"""Samsung Galaxy Tab A7 Lite (Silver) image -> assets/taba7lite/products/ + public/taba7lite/products/ (official Samsung
render supplied by City Store, 1200 px, transparent). Cropped to alpha, defringe; no upscale needed.
- full: back (camera) + front, as supplied.
- front: the front alone (screen with the default wallpaper).
- back: the back alone (silver, camera).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "taba7lite" / "products" / "src"
dst = ROOT / "assets" / "taba7lite" / "products"
pub = ROOT / "public" / "taba7lite" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "taba7lite" / "data").mkdir(parents=True, exist_ok=True)


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
src_im = Image.open(src / "galaxy_tab_a7lite_silver_front_back.webp").convert("RGBA")
src_im = src_im.crop(src_im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
W, H = src_im.size


def masked(im, keep):
    a = np.asarray(im).copy()
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    a[..., 3] = np.where(keep(xx, yy), a[..., 3], 0)
    return Image.fromarray(a)


FRONT_X = 262  # left edge of the front tablet (trimmed source px)
PARTS = {
    "full": lambda x, y: np.ones_like(x, bool),
    "front": lambda x, y: x >= FRONT_X,
    "back": lambda x, y: x < FRONT_X,
}
for key, keep in PARTS.items():
    im = masked(src_im, keep)
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(im)
    if max(im.size) > 1100:
        im.thumbnail((1100, 1100), Image.LANCZOS)
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"taba7lite/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "taba7lite" / "data").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "taba7lite" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
