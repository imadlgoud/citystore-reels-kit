"""Kindle Colorsoft + Kindle Scribe images -> assets/kindles/products/ + public/kindles/products/ (official Amazon renders
supplied by City Store, transparent).
- colorsoft: kindle_colorsoft_black.png (1024 px, supplied for the earlier e-readers reel; Spanish sample page with colour
  pictures, no English marketing text) - cropped, enhanced 1.5x, defringe.
- scribe: kindle_scribe_front_pen.png (226 px: Scribe front + Premium Pen). Its note panel held a handwritten English
  sample ("Discovery leads to joy"): that area (x 73-155, y 124-170) is filled with the panel's white, and the reel draws
  its own handwriting there (box saved in products.json). The book page above is unreadable body text at this size.
  Enhanced 4x.
SKIPPED: kindle_colorsoft_small.png (226 px; the screen shows book covers with English titles - the 1024 px render
covers it) and kindle_scribe_angle.png (226 px, tilted duplicate with the same English handwriting).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "kindles" / "products" / "src"
dst = ROOT / "assets" / "kindles" / "products"
pub = ROOT / "public" / "kindles" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "kindles" / "data").mkdir(parents=True, exist_ok=True)
NOTE = (73, 124, 155, 170)  # handwriting area inside the Scribe note panel (source px)


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
# Colorsoft
im = Image.open(src / "kindle_colorsoft_black.png").convert("RGBA")
im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
im = defringe(enhance(defringe(im), 1.5))
im.thumbnail((1100, 1100), Image.LANCZOS)
im.save(dst / "colorsoft.png"); im.save(pub / "colorsoft.png")
manifest["colorsoft"] = {"src": "kindles/products/colorsoft.png", "w": im.width, "h": im.height}
# Scribe: blank the English handwriting, then crop + enhance
a = np.asarray(Image.open(src / "kindle_scribe_front_pen.png").convert("RGBA")).copy()
x0, y0, x1, y1 = NOTE
paper = np.median(a[y0:y1, x0:x1, :3].reshape(-1, 3)[a[y0:y1, x0:x1, :3].reshape(-1, 3).min(-1) > 200], axis=0)
a[y0:y1, x0:x1, :3] = paper
im = Image.fromarray(a)
bb = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
im = im.crop(bb)
note = [round((x0 - bb[0]) / im.width, 4), round((y0 - bb[1]) / im.height, 4), round((x1 - bb[0]) / im.width, 4), round((y1 - bb[1]) / im.height, 4)]
im = defringe(enhance(defringe(im), 4.0))
im.save(dst / "scribe.png"); im.save(pub / "scribe.png")
manifest["scribe"] = {"src": "kindles/products/scribe.png", "w": im.width, "h": im.height, "note": note}
(ROOT / "public" / "kindles" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
