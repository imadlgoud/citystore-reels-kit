"""TP-Link Archer TX3000E image -> assets/tx3000e/products/ + public/tx3000e/products/ (official TP-Link render supplied
by City Store, transparent, 301 px). Cropped to alpha, enhanced 3x (Lanczos + unsharp), defringe.
- full: the PCIe card (red heatsink) with the cable to the magnetic antenna base and its two antennas.
- card: the card alone (crop of the same render).
- base: the antenna base alone (crop of the same render).
The box photo is not used: its front carries English marketing copy ("Arm Your PC with Next-Gen Wi-Fi Technology")
and reads "Bluetooth 5.3" while the script says 5.0.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "tx3000e" / "products" / "src"
dst = ROOT / "assets" / "tx3000e" / "products"
pub = ROOT / "public" / "tx3000e" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "tx3000e" / "data").mkdir(parents=True, exist_ok=True)


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
src_im = Image.open(src / "tx3000e_card_antenna_base.png").convert("RGBA")
src_im = src_im.crop(src_im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())  # ~270 x 301


def masked(im, keep):
    a = np.asarray(im).copy()
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    a[..., 3] = np.where(keep(xx, yy), a[..., 3], 0)
    return Image.fromarray(a)


# split the render (trimmed source pixels): card bottom-left, antenna base + antennas top-right
PARTS = {
    "full": lambda x, y: np.ones_like(x, bool),
    "card": lambda x, y: (y >= 166) & (x < 170) & ((x < 156) | (y > 259)),
    "base": lambda x, y: (x >= 156) & (y < 259) & ~((x < 165) & (y > 244)),
}
for key, keep in PARTS.items():
    im = masked(src_im, keep)
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(enhance(defringe(im), 3.0))
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"tx3000e/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "tx3000e" / "data").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "tx3000e" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
