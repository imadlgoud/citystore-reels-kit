"""WHOOP Life images -> assets/whooplife/products/ + public/whooplife/products/ (official WHOOP renders supplied by City Store,
transparent, small: ~300 px). Defringe, enhance (Lanczos + unsharp + slight contrast).
- life: the WHOOP Life (MG) sensor on its band, sensor side with the green LEDs (whoop_life_mg_band, enhanced 3x).
- box: the WHOOP Life box front ("WHOOP" + "LIFE" = product packaging) from whoop_life_box_contents (enhanced 3x).
- battery: the battery pack. The one in the box photo is only 31 x 40 px, so the same accessory is taken from the 2000 px
  WHOOP render supplied for the WHOOP 5.0 reel (whoop5_band_battery, right object, shadow dropped).
SKIPPED from whoop_life_box_contents: the box back (small English print), and the band / cable (25 and 12 px wide).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "whooplife" / "products" / "src"
dst = ROOT / "assets" / "whooplife" / "products"
pub = ROOT / "public" / "whooplife" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "whooplife" / "data").mkdir(parents=True, exist_ok=True)


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


def pick(name, test, alpha_min=40):
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    lab, _ = ndimage.label(a[..., 3] >= alpha_min)
    m = np.zeros(lab.shape, bool)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if (lab[sl] == i + 1).sum() > 200 and test(sl[0].start, sl[1].start):
            m |= lab == i + 1
    m = ndimage.binary_fill_holes(m)
    a[..., 3] = np.where(m, a[..., 3], 0)
    im = Image.fromarray(a)
    return im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


out = {
    "life": defringe(enhance(defringe(pick("whoop_life_mg_band.png", lambda y, x: True)), 3.0)),
    "box": defringe(enhance(defringe(pick("whoop_life_box_contents.png", lambda y, x: 120 < x < 160)), 3.0)),
    "battery": defringe(pick("whoop5_band_battery.webp", lambda y, x: x >= 1110)),
}
out["battery"].thumbnail((700, 700), Image.LANCZOS)
manifest = {}
for key, im in out.items():
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"whooplife/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "whooplife" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
