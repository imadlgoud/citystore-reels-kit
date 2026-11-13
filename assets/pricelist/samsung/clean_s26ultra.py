"""Remove the "S26 Ultra" overlay text from the S26 Ultra front screen: the screen's clean left half is mirrored onto
its right half (soft 14 px blend at the centre), then the image is trimmed. Output: public/pricelist/samsung/s26ultra.png"""
import pathlib
import numpy as np
from PIL import Image

D = pathlib.Path(__file__).resolve().parent
ROOT = D.parents[2]
a = np.asarray(Image.open(D / "src" / "galaxy_s26ultra_colours_TEXT_ON_SCREEN.png").convert("RGBA")).astype(np.float32)
rgb = a[..., :3]
row = rgb[330]
xs = [x for x in range(370, 600) if row[x].max() < 60]
sl, sr = max(x for x in xs if x < 480) + 1, min(x for x in xs if x > 480) - 1
c = (sl + sr) / 2
y0 = 124
y1 = max(y for y in range(124, 600) if rgb[y, int(c)].max() > 60) - 2  # bottom of the lit screen
for x in range(int(c) + 1, sr + 1):
    xm = int(round(2 * c - x))
    w = np.clip((x - c) / 14, 0, 1)
    rgb[y0:y1, x] = rgb[y0:y1, x] * (1 - w) + rgb[y0:y1, xm] * w
a[..., :3] = rgb
im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
al = im.getchannel("A").point(lambda v: 0 if v < 12 else v)
im.putalpha(al)
im = im.crop(al.getbbox())
im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
im.save(ROOT / "public" / "pricelist" / "samsung" / "s26ultra.png")
print("screen", sl, sr, "rows", y0, y1, im.size)
