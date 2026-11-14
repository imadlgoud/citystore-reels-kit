"""DJI Osmo Action 5 Pro image -> assets/oa5pro/products/ + public/oa5pro/products/ (official DJI render supplied by City
Store, 371 x 301, transparent). Cropped to alpha, enhanced 3x (Lanczos + unsharp), defringe.
- full: the camera, front 3/4 view (front OLED screen with the camera UI, lens, ACTION 5 PRO plate).
The shop photo of the Essential Combo box is kept as a source but not used (hand + shop wall).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "oa5pro" / "products" / "src"
dst = ROOT / "assets" / "oa5pro" / "products"
pub = ROOT / "public" / "oa5pro" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "oa5pro" / "data").mkdir(parents=True, exist_ok=True)


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
im = Image.open(src / "osmo_action5pro_front_screen.png").convert("RGBA")
im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
im = defringe(enhance(defringe(im), 3.0))
im.save(dst / "full.png"); im.save(pub / "full.png")
manifest["full"] = {"src": "oa5pro/products/full.png", "w": im.width, "h": im.height}
(ROOT / "public" / "oa5pro" / "data").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "oa5pro" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
