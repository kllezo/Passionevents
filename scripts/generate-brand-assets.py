"""
Regenerates every derived brand asset from the original files in /assets-source.

    python scripts/generate-brand-assets.py

Inputs (never modified):
  assets-source/passion-events-logo.webp   original supplied logo
  assets-source/founder-sai-tanush.jpg     founder portrait (credit: Phani Gogireddy / 24 Frames)

Outputs:
  public/brand/*        logo variants, OG image, manifest icons
  public/favicon*.png   browser icons, cropped from the floral ring (not the whole logo)
  public/favicon.ico
  public/apple-touch-icon.png
  public/media/founders/*
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-source"
PUB = ROOT / "public"
BRAND = PUB / "brand"
FOUNDERS = PUB / "media" / "founders"
BRAND.mkdir(parents=True, exist_ok=True)
FOUNDERS.mkdir(parents=True, exist_ok=True)

IVORY = (254, 249, 238)

logo = Image.open(SRC / "passion-events-logo.webp").convert("RGB")
W, H = logo.size  # 1993 x 2000 – proportions are preserved everywhere below

# 1. Logo on its original ivory ground --------------------------------------
for width in (1400, 640):
    h = round(H * width / W)
    logo.resize((width, h), Image.LANCZOS).save(BRAND / f"logo-{width}.webp", quality=90, method=6)
logo.resize((640, round(H * 640 / W)), Image.LANCZOS).save(BRAND / "logo-640.png", optimize=True)

# 2. Transparent logo (background knocked out by colour distance) -----------
rgba = logo.convert("RGBA")
px = rgba.load()
bg = IVORY
for y in range(H):
    for x in range(W):
        r, g, b, _ = px[x, y]
        d = ((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2) ** 0.5
        a = max(0.0, min(1.0, (d - 8) / 34))
        px[x, y] = (r, g, b, int(a * 255))
for width in (1400, 640, 320):
    h = round(H * width / W)
    rgba.resize((width, h), Image.LANCZOS).save(BRAND / f"logo-transparent-{width}.webp", quality=92, method=6)
rgba.resize((640, round(H * 640 / W)), Image.LANCZOS).save(BRAND / "logo-transparent-640.png", optimize=True)

# 3. Favicons – a crop of the floral ring that stays legible at 16px ---------
fav_crop = logo.crop((500, 420, 760, 680))           # coral blooms crossing the rose ring
touch_crop = logo.crop((430, 330, 900, 800))         # slightly wider for large icons

fav_crop.resize((16, 16), Image.LANCZOS).save(PUB / "favicon-16x16.png")
fav_crop.resize((32, 32), Image.LANCZOS).save(PUB / "favicon-32x32.png")
fav_crop.resize((256, 256), Image.LANCZOS).save(
    PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)


def rounded_icon(crop: Image.Image, size: int) -> Image.Image:
    """Floral crop inside a rose ring on ivory – used for touch + manifest icons."""
    canvas = Image.new("RGB", (size, size), IVORY)
    inner = crop.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    pad = round(size * 0.06)
    ImageDraw.Draw(mask).ellipse((pad, pad, size - pad, size - pad), fill=255)
    canvas.paste(inner, (0, 0), mask.filter(ImageFilter.GaussianBlur(size / 300)))
    ring = ImageDraw.Draw(canvas)
    ring.ellipse((pad, pad, size - pad, size - pad), outline=(191, 133, 146), width=max(2, size // 60))
    return canvas


rounded_icon(touch_crop, 180).save(PUB / "apple-touch-icon.png", optimize=True)
rounded_icon(touch_crop, 192).save(BRAND / "icon-192.png", optimize=True)
rounded_icon(touch_crop, 512).save(BRAND / "icon-512.png", optimize=True)

# 4. Open Graph image 1200x630 – full logo, centred, never distorted ---------
og = Image.new("RGB", (1200, 630), IVORY)
lh = 600
lw = round(W * lh / H)
og.paste(logo.resize((lw, lh), Image.LANCZOS), ((1200 - lw) // 2, 15))
og.save(BRAND / "og-passion-events.jpg", quality=88)

# Dark OG variant for Passion Live
og_live = Image.new("RGB", (1200, 630), (6, 6, 10))
glow = Image.new("RGB", (1200, 630), (0, 0, 0))
d = ImageDraw.Draw(glow)
d.ellipse((250, 120, 950, 820), fill=(110, 40, 210))
d.ellipse((520, 260, 1100, 760), fill=(255, 70, 30))
glow = glow.filter(ImageFilter.GaussianBlur(120))
og_live = Image.blend(og_live, glow, 0.55)
og_live.save(BRAND / "og-passion-live.jpg", quality=88)

# 5. Founder portrait ---------------------------------------------------------
portrait = Image.open(SRC / "founder-sai-tanush.jpg").convert("RGB")
for height in (1800, 900):
    w = round(portrait.width * height / portrait.height)
    portrait.resize((w, height), Image.LANCZOS).save(FOUNDERS / f"sai-tanush-{height}.webp", quality=86, method=6)

print("Brand assets generated.")
