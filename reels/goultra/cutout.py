"""Insta360 GO Ultra Creator Bundle images -> assets/goultra/products/ + public/goultra/products/ (official Insta360
renders supplied by City Store, already transparent; cropped to alpha, downscaled to <= 1000 px, defringe).
- kit: camera in the Action Pod (flip screen up) + Creator Bundle accessories (as sold).
- pod: Action Pod back, flip screen (photo of a child on the screen = official demo content).
- camera: GO Ultra camera alone.
- tripod: Mini Tripod 2-in-1 (selfie stick + tripod). The "Insta360" prints are the product's own branding.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "goultra" / "products" / "src"
dst = ROOT / "assets" / "goultra" / "products"
pub = ROOT / "public" / "goultra" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "goultra" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


manifest = {}
for key, name in [("kit", "goultra_creator_bundle_kit.webp"), ("pod", "goultra_actionpod_back.webp"), ("camera", "goultra_camera.png"), ("tripod", "goultra_mini_tripod.png")]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im.thumbnail((1000, 1000), Image.LANCZOS)
    im = defringe(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"goultra/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "goultra" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
