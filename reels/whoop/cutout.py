"""WHOOP 5.0 images -> assets/whoop/products/ + public/whoop/products/ (official WHOOP renders supplied by City Store,
already transparent). The soft render shadow (alpha < 40) is dropped so each object is a clean separate cut-out; then
crop to alpha, downscale to <= 1000 px, defringe.
- duo: band + battery pack together (whoop5_band_battery, both objects).
- band: the band alone (left object of whoop5_band_battery).
- battery: the battery pack alone (right object of whoop5_band_battery).
SKIPPED: whoop5_flatlay_app and whoop5_app_band. Both are built around a phone showing the WHOOP app (Healthspan / WHOOP
Age screen) whose text is all English UI copy -> replaced by a drawn French "WHOOP Age" dial in the reel. The flat-lay band
and cable are only 218-233 px wide (and the cable is cut by the frame), so the 2000 px render above covers them.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "whoop" / "products" / "src"
dst = ROOT / "assets" / "whoop" / "products"
pub = ROOT / "public" / "whoop" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "whoop" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


def pick(name, xr):
    """Objects whose bounding box starts inside the x range xr (shadow removed)."""
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    keep = a[..., 3] >= 40
    lab, n = ndimage.label(keep)
    m = np.zeros_like(keep)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if (lab[sl] == i + 1).sum() > 2000 and xr[0] <= sl[1].start < xr[1]:
            m |= lab == i + 1
    m = ndimage.binary_fill_holes(m)
    a[..., 3] = np.where(m, a[..., 3], 0)
    im = Image.fromarray(a)
    return im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


SLOTS = {
    "duo": ("whoop5_band_battery.webp", (0, 2000)),
    "band": ("whoop5_band_battery.webp", (0, 1110)),
    "battery": ("whoop5_band_battery.webp", (1110, 2000)),
}
manifest = {}
for key, (name, xr) in SLOTS.items():
    im = pick(name, xr)
    im.thumbnail((1000, 1000), Image.LANCZOS)
    im = defringe(im)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"whoop/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "whoop" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
