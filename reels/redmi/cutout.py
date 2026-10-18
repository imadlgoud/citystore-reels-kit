"""Redmi images -> assets/redmi/products/ + public/redmi/products/ (all three are official back+front pair renders,
already transparent: cropped to alpha, defringe, enhanced / downscaled to ~1200 px).
- note15 (1600 px): Redmi Note 15 5G, black. Module print "108MP AI CAMERA" (hardware print, kept).
- proplus (600 px, small): Redmi Note 14 Pro+ 5G, black. Module print "200MP AI CAMERA" matches the script. Enhanced x2.
- note14 (800 px): Redmi Note 14 5G, black. Module print "50MP OIS" is NOT in the script and may not match the version
  sold (camera specs differ between markets) -> softened (blurred inside a small box on the module). Enhanced x1.5.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "redmi" / "products" / "src"
dst = ROOT / "assets" / "redmi" / "products"
pub = ROOT / "public" / "redmi" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "redmi" / "data").mkdir(parents=True, exist_ok=True)


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


def soften(im, box, radius=6):
    """blur a small rectangle (printed spec on the camera module) in place"""
    region = im.crop(box)
    a = region.getchannel("A")
    region = region.convert("RGB").filter(ImageFilter.GaussianBlur(radius))
    region.putalpha(a)
    im.paste(region, box[:2])
    return im


SLOTS = {
    "note15": ("redmi_note15_5g_black.webp", None, 1200 / 1600),
    "proplus": ("redmi_note14proplus_5g_black.png", None, 2.0),
    "note14": ("redmi_note14_5g_black.png", (290, 218, 316, 272), 1.5),
}
manifest = {}
for key, (name, box, k) in SLOTS.items():
    im = Image.open(src / name).convert("RGBA")
    if box:
        im = soften(im, box)
    im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    im = enhance(im, k) if k > 1 else im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    im = defringe(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"redmi/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "redmi" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
