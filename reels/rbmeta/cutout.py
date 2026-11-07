"""Ray-Ban Meta (Wayfarer Matte Black, Transitions) images -> assets/rbmeta/products/ + public/rbmeta/products/
(official Ray-Ban | Meta renders supplied by City Store, 1600 px, transparent background).
The clear lenses are rendered as opaque near-white glass, which would read as white panels on the blue background:
lens pixels (large enclosed near-white regions) get a glass alpha (whiter = more see-through), so the background shows
through like real clear lenses. The front view also gets a lens mask (front_lens.png) that the reel tints dark for the
Transitions effect.
- front: front view (rbmeta_front). - angle: three-quarter view (rbmeta_angle_right, Ray-Ban logo on the temple).
- side: three-quarter from the other side (rbmeta_angle_left). - case: the charging case, from rbmeta_box_contents.
SKIPPED: rbmeta_back (back view adds nothing) and, from rbmeta_box_contents, the box and the leaflets (English print:
"GET STARTED", "SAFETY & WARRANTY", prescription-lens leaflet) and the small cloth.
"""
import json, pathlib
import numpy as np
from scipy import ndimage
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "rbmeta" / "products" / "src"
dst = ROOT / "assets" / "rbmeta" / "products"
pub = ROOT / "public" / "rbmeta" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "rbmeta" / "data").mkdir(parents=True, exist_ok=True)


def defringe(im):
    a = np.asarray(im).astype(np.float32)
    solid = a[..., 3] >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    edge = (a[..., 3] > 0) & ~solid
    a[edge, :3] = a[iy[edge], ix[edge], :3]
    return Image.fromarray(a.astype(np.uint8))


def glassify(a):
    """returns (rgba with see-through lenses, lens mask 0..255)"""
    rgb = a[..., :3].astype(np.float32)
    v = rgb.mean(-1)
    sat = rgb.max(-1) - rgb.min(-1)
    cand = (a[..., 3] >= 250) & (v > 165) & (sat < 25)
    lab, n = ndimage.label(cand)
    sizes = ndimage.sum(cand, lab, range(1, n + 1))
    lens = np.isin(lab, 1 + np.flatnonzero(sizes > 4000))
    lens = ndimage.binary_closing(lens, iterations=3) & (a[..., 3] >= 250)
    lens = ndimage.binary_fill_holes(lens)
    soft = ndimage.gaussian_filter(lens.astype(np.float32), 1.2)
    vb = ndimage.gaussian_filter(v, 3)  # smoothed, so the lens gradient does not turn into speckle
    glass = 0.16 + 0.84 * np.clip((205 - vb) / 110, 0, 1)  # clear glass; darker things seen through it stay visible
    alpha = a[..., 3].astype(np.float32) * (1 - soft) + 255 * glass * soft
    # pale floor shadow / haze outside the lenses: drop it (frame highlights are darker than this)
    haze = (soft < 0.05) & (v > 190) & (sat < 25) & (a[..., 3] < 250)
    alpha[haze] = 0
    out = a.copy()
    out[..., 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    return out, (soft * 255).astype(np.uint8)


def tight_box(alpha):
    ys, xs = np.nonzero(alpha > 8)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


manifest = {}
for key, name in [("front", "rbmeta_front.png"), ("angle", "rbmeta_angle_right.webp"), ("side", "rbmeta_angle_left.webp")]:
    a = np.asarray(Image.open(src / name).convert("RGBA")).copy()
    a[..., 3] = np.where(a[..., 3] < 30, 0, a[..., 3])  # drop the faint floor shadow
    g, lens = glassify(a)
    bb = tight_box(a[..., 3])
    im = defringe(Image.fromarray(g).crop(bb))
    im.thumbnail((1000, 1000), Image.LANCZOS)
    im.save(dst / f"{key}.png"); im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"rbmeta/products/{key}.png", "w": im.width, "h": im.height}
    if key == "front":
        m = Image.fromarray(lens).crop(bb).resize(im.size, Image.LANCZOS)
        mask = Image.new("RGBA", im.size, (0, 0, 0, 0))
        mask.putalpha(m)
        mask.save(dst / "front_lens.png"); mask.save(pub / "front_lens.png")
        manifest["front_lens"] = {"src": "rbmeta/products/front_lens.png", "w": im.width, "h": im.height}
# charging case from the box-contents shot (the tan case in the middle-left)
a = np.asarray(Image.open(src / "rbmeta_box_contents.webp").convert("RGBA")).copy()
rgb = a[..., :3].astype(int)
tan = (a[..., 3] > 200) & (rgb[..., 0] > rgb[..., 2] + 30)
lab, n = ndimage.label(ndimage.binary_closing(tan, iterations=4))
sizes = ndimage.sum(tan, lab, range(1, n + 1))
case = ndimage.binary_fill_holes(lab == 1 + int(np.argmax(sizes)))
case = ndimage.binary_dilation(case, iterations=2)
a[..., 3] = np.where(case, 255, 0).astype(np.uint8)
im = Image.fromarray(a)
im.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(1)))
im = defringe(im.crop(tight_box(np.asarray(im.getchannel("A")))))
im.save(dst / "case.png"); im.save(pub / "case.png")
manifest["case"] = {"src": "rbmeta/products/case.png", "w": im.width, "h": im.height}
(ROOT / "public" / "rbmeta" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
