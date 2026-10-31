"""iPhone 15 Pro Max (Blue Titanium) image -> assets/ip15pm/products/ + public/ip15pm/products/ (official Apple render
supplied by City Store, 728 px, transparent; the Apple logo is on the official photo, as allowed). Defringe.
- pair: back + front, as supplied.
- front: the front phone alone (its left frame starts at x = 311 in the source; everything right of it is the front phone).
- cam: the rear camera module (back phone, top-left), enhanced 2x; shown inside a round magnifier in the reel.
The screen shows the stock wallpaper only (no text).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "ip15pm" / "products" / "src"
dst = ROOT / "assets" / "ip15pm" / "products"
pub = ROOT / "public" / "ip15pm" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "ip15pm" / "data").mkdir(parents=True, exist_ok=True)


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
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=80, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


def tight(im):
    return im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


base = defringe(Image.open(src / "ip15pm_blue_titanium_pair.webp").convert("RGBA"))
out = {
    "pair": tight(base),
    "front": tight(base.crop((311, 0, base.width, base.height))),
    "cam": enhance(base.crop((100, 10, 300, 200)), 2.0),
}
manifest = {}
for key, im in out.items():
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"ip15pm/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "ip15pm" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
