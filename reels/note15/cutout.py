"""Redmi Note 15 5G images -> assets/note15/products/ + public/note15/products/ (official Xiaomi render supplied by City
Store, 860 x 696, transparent: Black, Mint, Purple backs + front). Cropped to alpha, enhanced 1.5x, defringe.
- full: the four phones as supplied (the "108MP" print on the camera modules is hardware, kept).
- front: the front phone alone (x >= 612; it sits on top of the others).
- back: the black back, from `note15_black_back.png` (supplied separately; replaces the crop of the four-phone render).
The second image (black back + front) is NOT used: its screen carries a large "REDMI Note 15 5G" overlay and a Mi logo.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "note15" / "products" / "src"
dst = ROOT / "assets" / "note15" / "products"
pub = ROOT / "public" / "note15" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "note15" / "data").mkdir(parents=True, exist_ok=True)


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
src_im = Image.open(src / "note15_colours_back_front.webp").convert("RGBA")


def masked(im, keep):
    a = np.asarray(im).copy()
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    a[..., 3] = np.where(keep(xx, yy), a[..., 3], 0)
    return Image.fromarray(a)


PARTS = {"full": lambda x, y: np.ones_like(x, bool), "front": lambda x, y: x >= 612, "back": lambda x, y: x <= 205}
for key, keep in PARTS.items():
    im = masked(src_im, keep)
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = im.resize((round(im.width * 1.5), round(im.height * 1.5)), Image.LANCZOS)
    im = defringe(im)
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"note15/products/{key}.png", "w": im.width, "h": im.height}
# camera scene: the full black back (supplied separately, 1024 px) replaces the "back" crop of the four-phone render
im = Image.open(src / "note15_black_back.png").convert("RGBA")
im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
im = defringe(im)
im.save(dst / "back.png"); im.save(pub / "back.png")
manifest["back"] = {"src": "note15/products/back.png", "w": im.width, "h": im.height}
# camera scene: the full black back (supplied separately, 1024 px) replaces the "back" crop of the four-phone render
im = Image.open(src / "note15_black_back.png").convert("RGBA")
im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
im = defringe(im)
im.save(dst / "back.png"); im.save(pub / "back.png")
manifest["back"] = {"src": "note15/products/back.png", "w": im.width, "h": im.height}
(ROOT / "public" / "note15" / "data").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "note15" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
