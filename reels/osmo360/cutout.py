"""DJI Osmo 360 images -> assets/osmo360/products/ + public/osmo360/products/ (official renders supplied by City Store,
already transparent).
- screen side (374 px, camera ~170 px wide): enhanced x3 (Lanczos + unsharp + slight contrast); the touch screen shows the
  stock camera UI, not marketing text.
- logo side (500 px): enhanced x2.
- NOT_USED_side_unverified.png: side view whose door latch matches an Insta360 X-series body; cannot be confirmed as the
  Osmo 360 -> not used.
- NOT_USED_insta360_stick.png: Insta360-branded selfie stick (another brand) -> not used; the stick is drawn instead.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "osmo360" / "products" / "src"
dst = ROOT / "assets" / "osmo360" / "products"
pub = ROOT / "public" / "osmo360" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "osmo360" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


manifest = {}
for key, name, k in [("screen", "osmo360_screen_side.png", 3.0), ("logo", "osmo360_logo_side.png", 2.0)]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    a = im.getchannel("A")
    rgb = ImageEnhance.Contrast(im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=90, threshold=2))).enhance(1.04)
    rgb.putalpha(a)
    im = defringe(rgb)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"osmo360/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "osmo360" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
