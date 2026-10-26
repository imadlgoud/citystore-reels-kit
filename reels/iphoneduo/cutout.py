"""iPhone Duo images -> assets/iphoneduo/products/ + public/iphoneduo/products/ (official Apple product photos supplied by
City Store, already transparent; the Apple logo appears only on the official photos, as allowed).
- open: back + unfolded 7.6" inner screen (iphoneduo_back_open, desert wallpaper), downscaled to <= 1100 px.
- flat: unfolded, seen from outside (back half + cover screen with a portrait), iphoneduo_flat_open (800 px source: enhanced).
- back: folded, back with the two cameras (top object of iphoneduo_back_hand; enhanced).
- front: folded, 5.4" outer screen (middle object of iphoneduo_side_front). It overlaps a second phone whose camera UI
  shows English text ("...urned on.", "SIRI"): cut at the middle phone's right frame edge (x = 671), so none of it remains.
- side: folded, side profile (left object of iphoneduo_side_front).
SKIPPED: the hand-held home screen (bottom of iphoneduo_back_hand): English widgets ("San Francisco", "Partly Cloudy").
Enhance = Lanczos upscale + unsharp + slight contrast.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "iphoneduo" / "products" / "src"
dst = ROOT / "assets" / "iphoneduo" / "products"
pub = ROOT / "public" / "iphoneduo" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "iphoneduo" / "data").mkdir(parents=True, exist_ok=True)


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
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


def pick(name, test, xmax=None):
    """Objects (alpha >= 40, > 3000 px) whose bbox passes test(y0, x0); optional hard cut at column xmax."""
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    keep = a[..., 3] >= 40
    if xmax:
        keep[:, xmax:] = False
    lab, n = ndimage.label(keep)
    m = np.zeros_like(keep)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if (lab[sl] == i + 1).sum() > 3000 and test(sl[0].start, sl[1].start):
            m |= lab == i + 1
    a[..., 3] = np.where(m, a[..., 3], 0)
    im = Image.fromarray(a)
    return im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


SLOTS = {
    "open": ("iphoneduo_back_open.webp", lambda y, x: True, None, 1100, 1),
    "flat": ("iphoneduo_flat_open.png", lambda y, x: True, None, 2000, 1.6),
    "back": ("iphoneduo_back_hand.webp", lambda y, x: y < 400, None, 2000, 1.6),
    "front": ("iphoneduo_side_front.webp", lambda y, x: x > 300, 671, 2000, 1.2),
    "side": ("iphoneduo_side_front.webp", lambda y, x: x < 300, None, 2000, 1.2),
}
manifest = {}
for key, (name, test, xmax, cap, k) in SLOTS.items():
    im = pick(name, test, xmax)
    im = defringe(im)
    if k != 1:
        im = enhance(im, k)
    im.thumbnail((cap, cap), Image.LANCZOS)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"iphoneduo/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "iphoneduo" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
