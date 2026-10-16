"""GoPro HERO10 Black (used unit) shop photos -> product-only cut-outs in assets/hero10/products/ + public/hero10/products/.

The supplied photos are City Store's own shots of the actual unit, held in hand in front of the shop backdrop.
The backdrop repeats the store logo, which contains an apple mark -> it must not appear (no Apple logo outside
official product photos), so every image is cut out to the PRODUCT ONLY: backdrop, hand, wristband and table are
all removed (GrabCut seeded with: outside the product box = background; skin, light backdrop, logo blue and wood =
background; very dark low-saturation pixels inside the box = product). Then: largest component, holes filled,
1 px erosion + feather, defringe, crop to alpha, and the usual enhance (Lanczos + unsharp + slight contrast).
"""
import json, pathlib
import numpy as np
import cv2
from scipy import ndimage
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
src = ROOT / "assets" / "hero10" / "products" / "src"
dst = ROOT / "assets" / "hero10" / "products"
pub = ROOT / "public" / "hero10" / "products"
pub.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "hero10" / "data").mkdir(parents=True, exist_ok=True)

# key: (source, product box x0, y0, x1, y1 in the 1280 px photo, upscale, options)
#   skin_hard: skin is definite background (fingers right under the battery)
#   fg_poly: polygon that is definitely product (the white tray inside the open case, which looks like backdrop)
#   bg_hard: light backdrop / logo pixels outside fg_poly are definite background
#   hull: the product is a convex box -> use the convex hull of the mask (clean straight edges)
#   poly: (open case, base only) traced outline of the case base; backdrop/table/hand touching it is removed
SLOTS = {
    "front": ("camera_front.webp", (390, 380, 1000, 865), 1.6, {}),
    "back": ("camera_back.webp", (425, 500, 1015, 900), 1.6, {}),
    "battery": ("battery.webp", (515, 515, 910, 975), 1.2, {"skin_hard": True, "hull": True}),
    "case": ("case_closed.webp", (280, 330, 1085, 955), 1.0, {"skin_hard": True}),
    "kit": ("case_open_kit.webp", (380, 480, 1240, 1145), 1.0, {"poly": [(392, 772), (1081, 486), (1150, 505), (1232, 800), (1205, 930), (575, 1140), (420, 1010), (384, 800)]}),
}


def product_mask(rgb, box, skin_hard=False, fg_poly=None, bg_hard=False, hull=False, poly=None):
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV).astype(np.float32)
    h, s, v = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255
    ycc = cv2.cvtColor(rgb, cv2.COLOR_RGB2YCrCb).astype(np.float32)
    cr, cb = ycc[..., 1], ycc[..., 2]
    skin = (cr > 135) & (cr < 180) & (cb > 80) & (cb < 130) & (v > 0.25)
    backdrop = (v > 0.62) & (s < 0.2)
    logo = (h > 215) & (h < 265) & (s > 0.35) & (v > 0.3)
    wood = (h > 15) & (h < 45) & (s > 0.18) & (v > 0.45)
    x0, y0, x1, y1 = box
    if poly:
        pm = np.zeros(rgb.shape[:2], np.uint8)
        cv2.fillPoly(pm, [np.array(poly, np.int32)], 1)
        fg = pm > 0
        # anything outside the black rim (backdrop, logo, table, hand) touching the traced outline is removed;
        # the cream tray sits inside the rim, so it never touches the outline
        bgish = ((v > 0.5) & (s < 0.2)) | logo | wood | skin
        lab, n = ndimage.label(bgish & fg)
        edge = fg & ~ndimage.binary_erosion(fg, iterations=3)
        touching = np.unique(lab[edge & (lab > 0)])
        fg &= ~ndimage.binary_dilation(np.isin(lab, touching), iterations=1)
        fg = ndimage.binary_opening(fg, iterations=9)  # also drops the backdrop edge line under the case
        lab, n = ndimage.label(fg)
        sizes = ndimage.sum(fg, lab, range(1, n + 1))
        fg = ndimage.binary_fill_holes(lab == (1 + int(np.argmax(sizes))))
        fg = ndimage.binary_erosion(fg, iterations=1)
        return ndimage.gaussian_filter(fg.astype(np.float32), 0.9)
    m = np.full(rgb.shape[:2], cv2.GC_BGD, np.uint8)
    m[y0:y1, x0:x1] = cv2.GC_PR_FGD
    inside = np.zeros_like(skin)
    inside[y0:y1, x0:x1] = True
    m[inside & (skin | backdrop | logo | wood)] = cv2.GC_PR_BGD
    m[inside & (v < 0.22) & (s < 0.35)] = cv2.GC_FGD
    if skin_hard:
        m[skin] = cv2.GC_BGD
    if fg_poly:
        poly = np.zeros(rgb.shape[:2], np.uint8)
        cv2.fillPoly(poly, [np.array(fg_poly, np.int32)], 1)
        if bg_hard:
            m[(poly == 0) & (backdrop | logo | wood | skin)] = cv2.GC_BGD
        m[poly > 0] = cv2.GC_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), m, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg = (m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)
    fg = ndimage.binary_opening(fg, iterations=2)
    lab, n = ndimage.label(fg)
    if n:
        sizes = ndimage.sum(fg, lab, range(1, n + 1))
        fg = lab == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_fill_holes(fg)
    if hull:
        pts = cv2.findNonZero(fg.astype(np.uint8))
        hm = np.zeros(fg.shape, np.uint8)
        cv2.fillConvexPoly(hm, cv2.convexHull(pts), 1)
        fg = hm > 0
    fg = ndimage.binary_erosion(fg, iterations=1)
    return ndimage.gaussian_filter(fg.astype(np.float32), 0.9)


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
    rgb = ImageEnhance.Contrast(rgb).enhance(1.05)
    rgb.putalpha(a)
    return rgb


manifest = {}
for key, (name, box, k, opts) in SLOTS.items():
    rgb = np.asarray(Image.open(src / name).convert("RGB"))
    alpha = product_mask(rgb, box, **opts)
    im = Image.fromarray(np.dstack([rgb, (alpha * 255).astype(np.uint8)]))
    im = defringe(im)
    im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    im = enhance(im, k) if k != 1 else im
    im.save(dst / f"{key}.png")
    im.save(pub / f"{key}.png")
    manifest[key] = {"src": f"hero10/products/{key}.png", "w": im.width, "h": im.height}
(ROOT / "public" / "hero10" / "data" / "products.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(json.dumps(manifest))
