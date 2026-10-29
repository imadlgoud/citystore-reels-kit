"""DJI Osmo Mobile 7 images -> assets/om7/products/ + public/om7/products/ (official DJI renders supplied by City Store,
transparent, small: ~300 px). Enhanced 3x (Lanczos + unsharp + slight contrast), defringe.
- unfolded: gimbal unfolded, no phone (om7_unfolded).
- folded: gimbal folded (om7_folded); the arm touches the render's left edge, so that edge is feathered.
- phone: gimbal holding a phone running the camera view (official demo shot of a running dog; the UI icons are tiny and
  carry no readable text) - left object of om7_kit_phone.
- clamp: magnetic phone clamp - top-right object of om7_kit_phone.
- pouch: carry pouch with the "OSMO" print (product branding) - bottom-right object of om7_kit_phone.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "om7" / "products" / "src"
dst = ROOT / "assets" / "om7" / "products"
pub = ROOT / "public" / "om7" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "om7" / "data").mkdir(parents=True, exist_ok=True)
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


def pick(name, test):
    """objects (alpha >= 40, > 150 px) whose bbox passes test(y0, x0)"""
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    lab, _ = ndimage.label(a[..., 3] >= 40)
    m = np.zeros(lab.shape, bool)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if (lab[sl] == i + 1).sum() > 150 and test(sl[0].start, sl[1].start):
            m |= lab == i + 1
    m = ndimage.binary_dilation(m, iterations=2)
    a[..., 3] = np.where(m, a[..., 3], 0)
    im = Image.fromarray(a)
    return im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


def feather_left(im, px):
    a = np.asarray(im).copy()
    ramp = np.clip(np.arange(a.shape[1]) / px, 0, 1)
    a[..., 3] = (a[..., 3] * ramp[None, :]).astype(np.uint8)
    return Image.fromarray(a)


SLOTS = {
    "unfolded": ("om7_unfolded.png", lambda y, x: True),
    "folded": ("om7_folded.png", lambda y, x: True),
    "phone": ("om7_kit_phone.png", lambda y, x: x < 100),
    "clamp": ("om7_kit_phone.png", lambda y, x: x > 100 and y < 125),
    "pouch": ("om7_kit_phone.png", lambda y, x: x > 100 and y >= 125),
}
manifest = {}
for key, (name, test) in SLOTS.items():
    im = defringe(enhance(defringe(pick(name, test)), K))
    if key == "folded":
        im = feather_left(im, 40)
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"om7/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "om7" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
