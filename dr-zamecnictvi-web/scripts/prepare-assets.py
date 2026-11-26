"""Create local, compressed variants from the original project photos."""
from pathlib import Path
from PIL import Image, ImageOps
root = Path(__file__).resolve().parents[1]
total = 0
for path in (root / 'public/images').rglob('*'):
    if path.suffix.lower() not in ('.jpg', '.jpeg'):
        continue
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert('RGB')
        image.thumbnail((1600, 1600))
        output = path.with_suffix('.webp')
        image.save(output, 'WEBP', quality=84, method=6)
        total += output.stat().st_size
for directory in ['src']:
    for path in (root / directory).rglob('*'):
        if path.suffix not in ('.astro', '.ts'):
            continue
        text = path.read_text(encoding='utf-8-sig')
        import re
        text = re.sub(r'(/images/[^\s\"\'`<>]+)\.(?:jpg|jpeg)', r'\1.webp', text)
        path.write_text(text, encoding='utf-8')
print(f'Optimized photos: {total:,} bytes')
