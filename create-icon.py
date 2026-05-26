"""Generate a 256x256 .ico icon for CAE Mastery (no external deps)."""
import struct, math, os

def create_ico(path):
    size = 256
    cx = cy = size // 2
    r_outer = size // 2 - 8
    r_inner = size // 3

    pixels = []
    for y in range(size - 1, -1, -1):   # BMP = bottom-to-top
        for x in range(size):
            dx, dy = x - cx, y - cy
            dist = math.hypot(dx, dy)
            angle = math.degrees(math.atan2(dy, dx))

            # Background: #0f172a
            bg = (42, 23, 15, 0)   # BGRA

            # C-shape ring
            in_ring = r_inner < dist < r_outer
            is_gap  = -40 < angle < 40      # open on the right

            if dist < r_outer + 6:
                if in_ring and not is_gap:
                    # Blue → purple → pink gradient
                    t = ((angle + 180) / 360)
                    if t < 0.4:
                        tt = t / 0.4
                        r2 = int(96  + (167 - 96)  * tt)
                        g2 = int(165 + (139 - 165) * tt)
                        b2 = 250
                    else:
                        tt = (t - 0.4) / 0.6
                        r2 = int(167 + (244 - 167) * tt)
                        g2 = int(139 + (114 - 139) * tt)
                        b2 = int(250 + (182 - 250) * tt)
                    pixels += [b2, g2, r2, 255]
                else:
                    # Dark fill inside ring + background
                    pixels += [42, 23, 15, 255]
            else:
                pixels += [0, 0, 0, 0]   # transparent outside

    # BITMAPINFOHEADER (40 bytes), height * 2 for XOR + AND masks
    bih = struct.pack('<IiiHHIIiiII',
        40, size, size * 2, 1, 32, 0,
        size * size * 4, 0, 0, 0, 0)

    and_row = ((size + 31) // 32) * 4
    and_mask = b'\x00' * (and_row * size)

    img_data = bih + bytes(pixels) + and_mask

    # ICO header + single entry
    offset = 6 + 16
    ico  = struct.pack('<HHH', 0, 1, 1)
    ico += struct.pack('<BBBBHHII', 0, 0, 0, 0, 1, 32, len(img_data), offset)
    ico += img_data

    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(ico)
    print(f'Icon written to {path} ({len(ico)} bytes)')

create_ico('C:/Aprendizaje/Ingles/cae-mastery/build/icon.ico')
