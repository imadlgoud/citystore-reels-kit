"""Apple Watch Ultra 3 (49 mm, black titanium, Black Ocean Band) images -> assets/ultra3/products/ + public/ultra3/products/.
Official Apple renders supplied by City Store (transparent, small: 301 / 320 px), enhanced 3x (Lanczos + unsharp + slight
contrast), defringe. Same keys as the Ultra 4 reel so its scenes can be reused.
- angle: three-quarter view with the Ocean Band (ultra3_angle).
- front: front view (ultra3_front).
- side: case + Digital Crown close-up (ultra3_side); the band is cut by the render frame on the left and right, so those
  edges are feathered.
Watch faces show the stock French UI (time, complications such as "STATIONNEMENT"), not marketing text.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "ultra3" / "products" / "src"
dst = ROOT / "assets" / "ultra3" / "products"
pub = ROOT / "public" / "ultra3" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "ultra3" / "data").mkdir(parents=True, exist_ok=True)
K = 3.0


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


def feather_sides(im, frac=0.1):
    a = np.asarray(im).copy()
    w = a.shape[1]
    ramp = np.clip(np.minimum(np.arange(w), np.arange(w)[::-1]) / (frac * w), 0, 1)
    a[..., 3] = (a[..., 3] * ramp[None, :]).astype(np.uint8)
    return Image.fromarray(a)


manifest = {}
for key, name in [("angle", "ultra3_angle.png"), ("front", "ultra3_front.png"), ("side", "ultra3_side.png")]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(enhance(defringe(im), K))
    if key == "side":
        im = feather_sides(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"ultra3/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "ultra3" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
