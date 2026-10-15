"""E-reader images -> assets/readers/products/ + public/readers/products/.

- Kobo Libra Colour (White): transparent render, 800 px source -> device only ~560 px wide: enhanced
  (Lanczos x2.5 + unsharp + slight contrast). Screen shows an Italian sample page with colour highlights (kept:
  it demonstrates the colour screen; no English marketing text).
- Kindle Colorsoft (Black): transparent render (front + back). Spanish sample page with colour highlights (kept).
  Enhanced x1.5.
- Kindle Paperwhite 12th gen (Black): the render sits on an OPAQUE white background -> white connected to the
  image border is removed (flood fill), the edge is eroded 1 px and feathered to kill the white halo. Screen shows a
  book page ("CHAPTER 1"), not marketing text. Enhanced x1.8.
- Paperwhite in hand (lifestyle shot, sky background): kept as a rectangular photo for a rounded photo card;
  its curved white bottom edge is cropped off. Enhanced x1.5.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "readers" / "products" / "src"
dst = ROOT / "assets" / "readers" / "products"
pub = ROOT / "public" / "readers" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "readers" / "data").mkdir(parents=True, exist_ok=True)


def remove_white_bg(im, thr=190):
    """alpha = 0 for near-white / light-grey (floor shadow) pixels connected to the border; 1 px erosion + feather against halos"""
    a = np.asarray(im.convert("RGBA")).copy()
    white = a[..., :3].min(-1) >= thr
    lab, _ = ndimage.label(white)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fg = ndimage.binary_fill_holes(~bg)
    fg = ndimage.binary_erosion(fg, iterations=1)
    alpha = ndimage.gaussian_filter(fg.astype(np.float32), 0.7)
    a[..., 3] = np.clip(np.minimum(a[..., 3] / 255, alpha) * 255, 0, 255).astype(np.uint8)
    return Image.fromarray(a)


def defringe(im):
    """partially transparent edge pixels take the colour of the nearest opaque pixel (no light/dark halos)"""
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


def enhance(im, k):
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    a = im.getchannel("A")
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.2, percent=90, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


SLOTS = {
    # key: (file, white background to remove, upscale)
    "kobo": ("kobo_libra_colour_white.png", False, 2.5),
    "colorsoft": ("kindle_colorsoft_black.png", False, 1.5),
    "paperwhite": ("kindle_paperwhite12_black.png", True, 1.8),
}
manifest = {}
for key, (name, white_bg, k) in SLOTS.items():
    im = Image.open(src / name).convert("RGBA")
    if white_bg:
        im = remove_white_bg(im)
    im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    im = defringe(enhance(im, k))
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"readers/products/{key}.png", "w": im.width, "h": im.height}

# lifestyle photo: opaque rectangle, cut above the curved white bottom edge
hand = Image.open(src / "kindle_paperwhite12_hand.webp").convert("RGB")
hand = hand.crop((0, 0, hand.width, round(hand.height * 0.86)))
hand = hand.resize((round(hand.width * 1.5), round(hand.height * 1.5)), Image.LANCZOS)
hand = ImageEnhance.Contrast(hand.filter(ImageFilter.UnsharpMask(radius=2.0, percent=70, threshold=2))).enhance(1.03)
hand.save(dst / "hand.jpg", quality=92)
hand.save(pub / "hand.jpg", quality=92)
manifest["hand"] = {"src": "readers/products/hand.jpg", "w": hand.width, "h": hand.height}
(ROOT / "public" / "readers" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
