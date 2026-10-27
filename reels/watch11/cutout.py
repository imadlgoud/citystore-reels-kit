"""Apple Watch Series 11 46mm shop photos (City Store's own, 301 px) -> assets/watch11/products/ + public/watch11/products/.
Enhanced 3x (Lanczos + unsharp + slight contrast), defringe.
- trio: three units on the shop stand, screens off (w11_trio_stand). The background is a flat grey (128,128,128) at alpha
  200 while the product is at alpha 255, so the alpha is remapped (200 -> 0, 255 -> 255): clean key, stand kept.
- setup: three units, screens on the pairing screen with Spanish / Arabic / Chinese setup text (w11_trio_setup): each
  screen (polygon traced by hand) is filled with the screen's own black, so no text or icon remains.
- wrist: one unit on a wrist; its screen showed a language list ("English", Chinese): filled the same way. The reel draws
  its own heart-rate screen on top, using the screen box saved in products.json.
SKIPPED: w11_back_engraving (the back engraving carries the Apple logo, not allowed outside official photos; it confirms
"SERIES 11 · 46MM ALUMINUM CASE") and w11_back_hand (mostly a hand, product small and blurry).
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "watch11" / "products" / "src"
dst = ROOT / "assets" / "watch11" / "products"
pub = ROOT / "public" / "watch11" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "watch11" / "data").mkdir(parents=True, exist_ok=True)
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


# screen polygons traced by hand on the 301 px sources (the auto dark-region pick caught the band on the wrist photo)
SCREENS = {
    "setup": [[(18, 89), (77, 89), (77, 142), (18, 142)], [(124, 86), (187, 86), (187, 141), (124, 141)],
              [(221, 78), (278, 77), (288, 136), (233, 141)]],
    "wrist": [[(113, 106), (180, 106), (190, 188), (124, 192)]],
}


def blank_screens(a, polys):
    """fill each screen polygon (UI text included) with the screen's own dark colour, 1 px feathered edge"""
    from PIL import ImageDraw
    boxes = []
    for poly in polys:
        m = Image.new("L", (a.shape[1], a.shape[0]), 0)
        ImageDraw.Draw(m).polygon(poly, fill=255)
        mk = np.asarray(m) > 0
        px = a[mk][:, :3]
        col = np.median(px[px.max(-1) < np.percentile(px.max(-1), 60)], axis=0)
        soft = np.asarray(m.filter(ImageFilter.GaussianBlur(0.7)), dtype=np.float32)[..., None] / 255
        a[..., :3] = (a[..., :3] * (1 - soft) + col * soft).astype(np.uint8)
        xs, ys = [p[0] for p in poly], [p[1] for p in poly]
        boxes.append([min(xs), min(ys), max(xs), max(ys)])
    return a, boxes


def crop(a, boxes):
    im = Image.fromarray(a)
    bb = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    fr = [[round((b[0] - bb[0]) / w, 4), round((b[1] - bb[1]) / h, 4), round((b[2] - bb[0]) / w, 4), round((b[3] - bb[1]) / h, 4)] for b in boxes]
    return im.crop(bb), fr


manifest = {}
for key, name in [("trio", "w11_trio_stand.png"), ("setup", "w11_trio_setup.png"), ("wrist", "w11_wrist.png")]:
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    if key == "trio":
        al = a[..., 3].astype(np.float32)
        a[..., 3] = np.clip((al - 200) / 55 * 255, 0, 255).astype(np.uint8)
    boxes = []
    if key in SCREENS:
        a, boxes = blank_screens(a, SCREENS[key])
    im, fr = crop(a, boxes)
    im = defringe(enhance(defringe(im), K))
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"watch11/products/{key}.png", "w": im.width, "h": im.height, "screens": fr}
(ROOT / "public" / "watch11" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
