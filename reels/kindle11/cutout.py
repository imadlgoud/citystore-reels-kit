"""Kindle 11th gen (basic, 6") images -> assets/kindle11/products/ + public/kindle11/products/.

- kindle11_black_front.png (900x1200): official front render of the basic Kindle 11th gen, Black; transparent.
  Cropped to alpha, defringe, light enhance x1.3. Screen shows a book page (not marketing text).
- NOT_USED_paperwhite_*.png: the two other supplied images show a Kindle PAPERWHITE (flush glass front, thinner
  bezels, 6.8" screen), a different model from the one sold -> not used (rule: exact model only).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "kindle11" / "products" / "src"
dst = ROOT / "assets" / "kindle11" / "products"
pub = ROOT / "public" / "kindle11" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "kindle11" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


im = Image.open(src / "kindle11_black_front.png").convert("RGBA")
im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
im = im.resize((round(im.width * 1.3), round(im.height * 1.3)), Image.LANCZOS)
a = im.getchannel("A")
rgb = ImageEnhance.Contrast(im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=70, threshold=2))).enhance(1.03)
rgb.putalpha(a)
im = defringe(rgb)
im.save(dst / "front.png")
im.save(pub / "front.png")
(ROOT / "public" / "kindle11" / "data" / "products.json").write_text(json.dumps({"front": {"src": "kindle11/products/front.png", "w": im.width, "h": im.height}}, indent=1) + "\n")
print(im.size)
