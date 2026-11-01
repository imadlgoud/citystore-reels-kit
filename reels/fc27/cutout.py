"""EA SPORTS FC 27 (PS5) box image -> assets/fc27/products/ + public/fc27/products/ (official packshot supplied by City Store,
transparent, 234 x 294 px box): cropped to alpha, enhanced 3x (Lanczos + unsharp + slight contrast), defringe.
The box art (game logo, PS5 banner, PEGI 16, cover athlete) is the product's own packaging, shown as-is; no league or
publisher logos are drawn anywhere else in the reel.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "fc27" / "products" / "src"
dst = ROOT / "assets" / "fc27" / "products"
pub = ROOT / "public" / "fc27" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "fc27" / "data").mkdir(parents=True, exist_ok=True)


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


im = Image.open(src / "fc27_ps5_box.png").convert("RGBA")
im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
im = defringe(enhance(defringe(im), 3.0))
im.save(dst / "box.png")
im.save(pub / "box.png")
manifest = {"box": {"src": "fc27/products/box.png", "w": im.width, "h": im.height}}
(ROOT / "public" / "fc27" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
