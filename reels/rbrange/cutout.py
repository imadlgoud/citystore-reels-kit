"""Ray-Ban Meta range images -> assets/rbrange/products/ + public/rbrange/products/ (official Ray-Ban | Meta renders
supplied by City Store, transparent). Ray-Ban logos on the temples / lenses are the product's own branding.
- w3 / w3_lens / w3_angle: Wayfarer 3rd gen Matte Black Transitions = the processed renders from the Ray-Ban Meta reel
  (see reels/rbmeta/SOURCES.md: see-through lenses + lens mask for the Transitions tint), copied as-is.
- aviator: rb_aviator_black (578 px; glasses 427 px wide) -> enhanced 2.4x.
- w2: rb_wayfarer_shiny_black (900 px) = Wayfarer 2nd gen (dark lenses) -> cropped, defringe.
- headliner: rb_headliner_matte_black (562 px; glasses 431 px wide, polarized "P" mark) -> enhanced 2.4x.
NOT USED: rb_wayfarer_blue (blue Wayfarer): the VO names no colour for the 2nd gen, so only one Wayfarer 2nd gen is shown.
"""
import json, pathlib, shutil
import numpy as np
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "rbrange" / "products" / "src"
dst = ROOT / "assets" / "rbrange" / "products"
pub = ROOT / "public" / "rbrange" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "rbrange" / "data").mkdir(parents=True, exist_ok=True)


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
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2.0, percent=80, threshold=2))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb.putalpha(a)
    return rgb


def clean(name, k):
    im = Image.open(src / name).convert("RGBA")
    a = np.asarray(im).copy()
    a[..., 3] = np.where(a[..., 3] < 30, 0, a[..., 3])  # faint floor shadow
    rgb = a[..., :3].astype(int)
    haze = (a[..., 3] < 250) & (rgb.mean(-1) > 150) & (rgb.max(-1) - rgb.min(-1) < 30)  # pale semi-transparent shadow
    a[..., 3] = np.where(haze, 0, a[..., 3])
    im = Image.fromarray(a)
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    im = defringe(im)
    if k != 1:
        im = defringe(enhance(im, k))
    im.thumbnail((1000, 1000), Image.LANCZOS)
    return im


manifest = {}
for key, name in [("w3", "rb_w3_front_glass.png"), ("w3_lens", "rb_w3_front_lens.png"), ("w3_angle", "rb_w3_angle_glass.png")]:
    shutil.copy(src / name, dst / f"{key}.png"); shutil.copy(src / name, pub / f"{key}.png")
    im = Image.open(src / name)
    manifest[key] = {"src": f"rbrange/products/{key}.png", "w": im.width, "h": im.height}
for key, name, k in [("aviator", "rb_aviator_black.png", 2.4), ("w2", "rb_wayfarer_shiny_black.png", 1), ("headliner", "rb_headliner_matte_black.png", 2.4)]:
    im = clean(name, k)
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"rbrange/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "rbrange" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
