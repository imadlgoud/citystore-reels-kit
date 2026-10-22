"""Galaxy A07 images -> assets/a07/products/ + public/a07/products/ (official pair renders, already transparent).
- black: a07_black_pair.png (800 px), enhanced x1.4.
- green: a07_green_pair.png (720 px): the screen carries a "Galaxy A07" marketing overlay -> the whole screen is softened
  (blur restricted to the screen rectangle; the wallpaper is soft gradients anyway), enhanced x1.6.
- NOT_USED_a07_three_colours.png: green / black / LIGHT VIOLET; the third colour is not the "Rose doré" sold -> not used.
- NOT_USED_a07_tiny.png: 120 px, too small (and a light blue / violet unit).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "a07" / "products" / "src"
dst = ROOT / "assets" / "a07" / "products"
pub = ROOT / "public" / "a07" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "a07" / "data").mkdir(parents=True, exist_ok=True)


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


def soften(im, box, radius):
    """normalized-convolution blur restricted to a rounded screen rectangle (no bezel bleed), feathered edge"""
    from PIL import ImageDraw
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle(box, radius=24, fill=255)
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32)
    mk = np.asarray(m, dtype=np.float32) / 255
    blur = lambda x: ndimage.gaussian_filter(x, radius)
    den = blur(mk) + 1e-4
    out = np.stack([blur(rgb[..., c] * mk) / den for c in range(3)], -1)
    soft = np.asarray(m.filter(ImageFilter.GaussianBlur(2)), dtype=np.float32)[..., None] / 255
    res = rgb * (1 - soft) + out * soft
    o = Image.fromarray(np.clip(res, 0, 255).astype(np.uint8))
    o.putalpha(im.getchannel("A"))
    return o


manifest = {}
for key, name, box, k in [("black", "a07_black_pair.png", None, 1.4), ("green", "a07_green_pair.png", (342, 74, 602, 668), 1.6)]:
    im = Image.open(src / name).convert("RGBA")
    if box:
        im = soften(im, box, 22)
    im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    im = defringe(enhance(im, k))
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"a07/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "a07" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
