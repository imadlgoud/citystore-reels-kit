"""G-Tab T13 images -> assets/gtab/products/ + public/gtab/products/.

All supplied renders are already transparent: cropped to alpha, edge defringe, downscaled to <= 1200 px.
- pair (1750 px): front + back, used in the intro and on the cover.
- front (1750 px): screen side, used for the screen / Android scenes (screen overlays drawn on it).
- back (1750 px): camera side, used for 4G / SIM and battery / memory card.
- pair_small (430 px): same pair from another angle, lower resolution -> not used (the 1750 px pair covers it).
The screens show the stock wallpaper; the camera module's tiny "AI CAMERA" print is unreadable at the sizes used.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "gtab" / "products" / "src"
dst = ROOT / "assets" / "gtab" / "products"
pub = ROOT / "public" / "gtab" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "gtab" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


manifest = {}
for key, name in [("pair", "gtab_t13_pair.webp"), ("front", "gtab_t13_front.webp"), ("back", "gtab_t13_back.webp")]:
    im = Image.open(src / name).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    im.thumbnail((1200, 1200), Image.LANCZOS)
    im = defringe(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"gtab/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "gtab" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
