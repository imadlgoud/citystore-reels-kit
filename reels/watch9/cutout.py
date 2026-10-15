"""Galaxy Watch9 40mm LTE Black images -> assets/watch9/products/ + public/watch9/products/.

All four supplied images are already transparent.
- angle (1500x1000): 3/4 view, cropped to alpha.
- front (386x641, small): straps are cut flat by the frame -> alpha fade top/bottom; enhanced
  (Lanczos x2.5 + unsharp + slight contrast).
- back (1500x1500): sensor side; the case-back engraving (model no., "40mm", "LTE", ...) is tiny hardware
  engraving, not marketing text; used small.
- charger: cropped out of the in-box image (watch + charger); the watch half is not used (lower quality
  duplicate of the front view). Enhanced lightly.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "watch9" / "products" / "src"
dst = ROOT / "assets" / "watch9" / "products"
pub = ROOT / "public" / "watch9" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "watch9" / "data").mkdir(parents=True, exist_ok=True)


def crop_alpha(im):
    return im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())


def defringe(im):
    """partially transparent edge pixels take the colour of the nearest opaque pixel (no light halos)"""
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


def enhance(im, k):
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    a = im.getchannel("A")
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.2, percent=90, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


def fade_ends(im, frac=0.1):
    """fade the alpha at the top and bottom (strap cut by the photo frame)"""
    a = np.asarray(im).copy()
    h = a.shape[0]
    n = int(h * frac)
    ramp = np.linspace(0, 1, n) ** 1.5
    a[:n, :, 3] = (a[:n, :, 3] * ramp[:, None]).astype(np.uint8)
    a[h - n:, :, 3] = (a[h - n:, :, 3] * ramp[::-1][:, None]).astype(np.uint8)
    return Image.fromarray(a)


manifest = {}


def save(key, im):
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"watch9/products/{key}.png", "w": im.width, "h": im.height}


save("angle", defringe(crop_alpha(Image.open(src / "watch9_40_black_angle.png").convert("RGBA"))))
save("front", fade_ends(defringe(enhance(crop_alpha(Image.open(src / "watch9_40_black_front.png").convert("RGBA")), 2.5))))
save("back", defringe(crop_alpha(Image.open(src / "watch9_40_black_back.webp").convert("RGBA"))))
box = Image.open(src / "watch9_40_black_box_charger.webp").convert("RGBA")
save("charger", defringe(enhance(crop_alpha(box.crop((box.width * 0.58, 0, box.width, box.height))), 1.2)))
(ROOT / "public" / "watch9" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
