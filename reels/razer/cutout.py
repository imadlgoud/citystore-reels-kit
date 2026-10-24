"""Razer Hammerhead USB-C ANC images -> assets/razer/products/ + public/razer/products/ (official renders supplied by
City Store, already transparent, 500 px -> enhanced x2.2: Lanczos + unsharp + slight contrast).
- front: earbuds + in-line remote/mic + USB-C plug.
- kit: earbuds, cable, remote, USB-C plug and spare ear tips. The source has pale ghost copies of the cable on its left
  edge (compression / matte artefacts): light pixels in the left 45 % are made transparent (the product is black).
  The tips shown are the silicone ones, so they are NOT labelled "Comply" on screen.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "razer" / "products" / "src"
dst = ROOT / "assets" / "razer" / "products"
pub = ROOT / "public" / "razer" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "razer" / "data").mkdir(parents=True, exist_ok=True)


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
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=90, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.05)
    rgb.putalpha(a)
    return rgb


manifest = {}
for key, name, ghost in [("front", "hammerhead_usbc_anc_front.png", False), ("kit", "hammerhead_usbc_anc_kit.png", True)]:
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    if ghost:
        lum = a[..., :3].astype(float).mean(-1)
        kill = (lum > 95) & (np.arange(a.shape[1])[None, :] < a.shape[1] * 0.45)
        kill = ndimage.binary_dilation(kill, iterations=2)
        a[kill, 3] = 0
        # drop tiny leftover specks
        lab, n = ndimage.label(a[..., 3] > 20)
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        a[np.isin(lab, 1 + np.flatnonzero(sizes < 150)), 3] = 0
        # the cable ends are frayed on the left edge: fade the left 14 % out
        w = a.shape[1]
        xs0 = np.nonzero((a[..., 3] > 20).any(0))[0].min()
        n = int(w * 0.14)
        fade = np.clip((np.arange(w) - xs0) / n, 0, 1) ** 1.2
        a[..., 3] = (a[..., 3] * fade[None, :]).astype(np.uint8)
    im = Image.fromarray(a)
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(enhance(im, 2.2))
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"razer/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "razer" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
