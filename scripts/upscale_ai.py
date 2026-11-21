"""AI upscale (EDSR x4, OpenCV dnn_superres) of a transparent product image.
Usage: python3 scripts/upscale_ai.py <src.png> <dst.png> [x0,y0,x1,y1 ...]
Optional rectangles (output px) are taken from a plain Lanczos x4 instead: EDSR can garble tiny print (e.g. "8K"
turning into "aK"), so keep the smooth version there.
RGB goes through EDSR x4 (composited on white first so the edges stay clean); the alpha channel is upscaled with
Lanczos and slightly tightened; then a light unsharp mask. Model: tools/models/EDSR_x4.pb (not committed; download
https://raw.githubusercontent.com/Saafke/EDSR_Tensorflow/master/models/EDSR_x4.pb). Needs opencv-contrib-python-headless."""
import sys, pathlib
import cv2, numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
src, dst = sys.argv[1], sys.argv[2]
keep = [tuple(int(v) for v in r.split(",")) for r in sys.argv[3:]]
im = Image.open(src).convert("RGBA")
a = im.getchannel("A").point(lambda v: 0 if v < 12 else v)
im.putalpha(a)
im = im.crop(a.getbbox())
bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
rgb = cv2.cvtColor(np.asarray(bg.convert("RGB")), cv2.COLOR_RGB2BGR)
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(str(ROOT / "tools" / "models" / "EDSR_x4.pb"))
sr.setModel("edsr", 4)
up = sr.upsample(rgb)
out = Image.fromarray(cv2.cvtColor(up, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
soft = bg.convert("RGB").resize(out.size, Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=50, threshold=2))
for r in keep:
    out.paste(soft.crop(r), r[:2])
alpha = im.getchannel("A").resize(out.size, Image.LANCZOS).point(lambda v: 0 if v < 40 else min(255, int(v * 1.08)))
out.putalpha(alpha)
out.save(dst)
print(dst, out.size)
