"""Create a reusable, subtly animated translucent green bubble GLB and preview."""

from __future__ import annotations

import json
import math
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "models" / "poison-bubble.glb"
CLUSTER_OUT = ROOT / "public" / "models" / "poison-bubble-cluster.glb"
binary = bytearray()
views: list[dict] = []
accessors: list[dict] = []
meshes: list[dict] = []
nodes: list[dict] = []


def align4() -> None:
    binary.extend(b"\0" * ((-len(binary)) % 4))


def accessor(values: list[float] | list[int], component: int, kind: str, count: int, bounds: bool = False) -> int:
    align4()
    offset = len(binary)
    code = "f" if component == 5126 else "H"
    binary.extend(struct.pack("<" + code * len(values), *values))
    view_id = len(views)
    views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(binary) - offset})
    item = {"bufferView": view_id, "componentType": component, "count": count, "type": kind}
    if bounds and kind == "VEC3":
        triples = list(zip(values[0::3], values[1::3], values[2::3]))
        item["min"] = [min(p[i] for p in triples) for i in range(3)]
        item["max"] = [max(p[i] for p in triples) for i in range(3)]
    accessors.append(item)
    return len(accessors) - 1


def add_mesh(name: str, verts: list[tuple[float, float, float]], faces: list[tuple[int, int, int]], material: int, parent: int) -> int:
    positions: list[float] = []
    normals: list[float] = []
    indices: list[int] = []
    for face in faces:
        for index in face:
            point = verts[index]
            length = math.sqrt(sum(v * v for v in point)) or 1
            positions.extend(point)
            normals.extend(v / length for v in point)
            indices.append(len(indices))
    pos = accessor(positions, 5126, "VEC3", len(positions) // 3, True)
    norm = accessor(normals, 5126, "VEC3", len(normals) // 3)
    ind = accessor(indices, 5123, "SCALAR", len(indices))
    mesh_id = len(meshes)
    meshes.append({"name": name, "primitives": [{"attributes": {"POSITION": pos, "NORMAL": norm}, "indices": ind, "material": material}]})
    node_id = len(nodes)
    nodes.append({"name": name, "mesh": mesh_id})
    nodes[parent].setdefault("children", []).append(node_id)
    return node_id


def sphere_mesh(parent: int, material: int, name: str, rx: float = 0.82, ry: float = 0.82, rz: float = 0.82, rings: int = 32, segments: int = 64) -> None:
    verts = []
    for r in range(rings + 1):
        phi = math.pi * r / rings
        for s in range(segments):
            theta = math.tau * s / segments
            # Gentle shape variation gives the surface a soft, organic liquid feel.
            ripple = 1 + 0.012 * math.sin(3 * theta + 1.7 * phi) * math.sin(2 * phi)
            verts.append((rx * ripple * math.sin(phi) * math.cos(theta), ry * ripple * math.cos(phi), rz * ripple * math.sin(phi) * math.sin(theta)))
    faces = []
    for r in range(rings):
        for s in range(segments):
            a = r * segments + s
            b = r * segments + (s + 1) % segments
            c = (r + 1) * segments + (s + 1) % segments
            d = (r + 1) * segments + s
            if r:
                faces.append((a, b, d))
            if r < rings - 1:
                faces.append((b, c, d))
    add_mesh(name, verts, faces, material, parent)


def spherical_patch(parent: int, material: int, name: str, phi_range: tuple[float, float], theta_range: tuple[float, float], rows: int = 8, cols: int = 18) -> None:
    verts = []
    for r in range(rows + 1):
        phi = phi_range[0] + (phi_range[1] - phi_range[0]) * r / rows
        for c in range(cols + 1):
            theta = theta_range[0] + (theta_range[1] - theta_range[0]) * c / cols
            # Float the reflection imperceptibly above the skin to avoid z-fighting.
            radius = 0.831
            verts.append((radius * math.sin(phi) * math.cos(theta), radius * math.cos(phi), radius * math.sin(phi) * math.sin(theta)))
    faces = []
    for r in range(rows):
        for c in range(cols):
            a = r * (cols + 1) + c
            b, d = a + 1, a + cols + 1
            faces.extend(((a, b, d), (b, d + 1, d)))
    add_mesh(name, verts, faces, material, parent)


def build() -> dict:
    global binary
    nodes.append({"name": "Poison bubble · animated root", "children": []})
    # Green transparent shell, soft caustic tints, and narrow glossy reflections.
    materials = [
        {"name": "Translucent chartreuse glass", "alphaMode": "BLEND", "doubleSided": True,
         "pbrMetallicRoughness": {"baseColorFactor": [0.31, 0.72, 0.16, 0.31], "metallicFactor": 0.12, "roughnessFactor": 0.12},
         "extensions": {"KHR_materials_transmission": {"transmissionFactor": 0.62}, "KHR_materials_ior": {"ior": 1.34}, "KHR_materials_clearcoat": {"clearcoatFactor": 0.92, "clearcoatRoughnessFactor": 0.08}}},
        {"name": "Acid green reflected light", "alphaMode": "BLEND", "doubleSided": True,
         "pbrMetallicRoughness": {"baseColorFactor": [0.68, 1, 0.13, 0.62], "metallicFactor": 0.08, "roughnessFactor": 0.22}, "emissiveFactor": [0.14, 0.34, 0.015]},
        {"name": "Cool mint specular sheen", "alphaMode": "BLEND", "doubleSided": True,
         "pbrMetallicRoughness": {"baseColorFactor": [0.62, 1, 0.84, 0.74], "metallicFactor": 0.04, "roughnessFactor": 0.1}, "emissiveFactor": [0.06, 0.15, 0.09]},
        {"name": "Deep green caustic", "alphaMode": "BLEND", "doubleSided": True,
         "pbrMetallicRoughness": {"baseColorFactor": [0.045, 0.25, 0.07, 0.42], "metallicFactor": 0.16, "roughnessFactor": 0.19}},
    ]
    root = 0
    sphere_mesh(root, 0, "Thin translucent bubble skin")
    # Front-facing curved reflection patches make the clear shell legible on dark pages.
    spherical_patch(root, 2, "Long mintbox highlight", (0.48, 1.12), (0.88, 1.04), rows=12, cols=24)
    spherical_patch(root, 1, "Lime caustic crescent", (1.7, 2.12), (0.48, 2.62), rows=8, cols=22)
    spherical_patch(root, 3, "Deep emerald refraction", (2.05, 2.72), (0.78, 2.42), rows=10, cols=20)
    spherical_patch(root, 2, "Small liquid glint", (0.35, 0.53), (0.62, 0.82), rows=4, cols=8)

    # A gentle bob keeps the standalone bubble useful as an individual asset.
    time = accessor([0, 1.6, 3.2], 5126, "SCALAR", 3)
    translation = accessor([0, -0.08, 0, 0, 0.1, 0, 0, -0.08, 0], 5126, "VEC3", 3)
    rotation = accessor([0, 0, 0, 1, 0, 0.0784591, 0, 0.9969173, 0, 0, 0, 1], 5126, "VEC4", 3)
    return {
        "asset": {"version": "2.0", "generator": "Ashwin Sharma · procedural liquid bubble"},
        "extensionsUsed": ["KHR_materials_transmission", "KHR_materials_ior", "KHR_materials_clearcoat"],
        "scene": 0, "scenes": [{"name": "Single floating poison bubble", "nodes": [root]}], "nodes": nodes,
        "meshes": meshes, "materials": materials, "bufferViews": views, "accessors": accessors,
        "animations": [{"name": "Gentle bubble drift", "samplers": [
            {"input": time, "output": translation, "interpolation": "LINEAR"},
            {"input": time, "output": rotation, "interpolation": "LINEAR"}],
            "channels": [{"sampler": 0, "target": {"node": root, "path": "translation"}}, {"sampler": 1, "target": {"node": root, "path": "rotation"}}]}],
        "buffers": [{"byteLength": len(binary)}],
    }


def make_cluster(doc: dict) -> dict:
    template_meshes = [doc["nodes"][child]["mesh"] for child in doc["nodes"][0]["children"]]
    bubbles = [
        (-6.2, -0.4, 0.56, 0.00),
        (-4.05, 0.75, 0.34, 0.72),
        (-1.8, -0.7, 0.48, 1.44),
        (0.65, 0.55, 0.31, 2.16),
        (2.9, -0.3, 0.62, 2.88),
        (5.15, 0.8, 0.28, 3.60),
        (6.6, -0.65, 0.29, 4.32),
    ]
    roots = []
    for index, (x, z, scale, delay) in enumerate(bubbles):
        if index == 0:
            root_id = 0
            root = doc["nodes"][root_id]
        else:
            root_id = len(doc["nodes"])
            root = {"name": f"Floating poison bubble {index + 1}", "children": []}
            doc["nodes"].append(root)
            for mesh_id in template_meshes:
                child_id = len(doc["nodes"])
                doc["nodes"].append({"name": "Reusable translucent bubble surface", "mesh": mesh_id})
                root["children"].append(child_id)
        root["name"] = f"Floating poison bubble {index + 1}"
        root["translation"] = [x, -7.8, z]
        root["scale"] = [scale, scale, scale]
        roots.append((root_id, x, z, scale, delay))

    doc["scenes"][0]["nodes"] = [root[0] for root in roots]
    # Each bubble enters from below the frame, rises through it, then shrinks
    # away near the top. Staggered key times keep their motion unsynchronized.
    samplers = []
    channels = []
    for root_id, x, z, size, delay in roots:
        times = [delay + t for t in (0, 0.28, 3.8, 4.25, 4.55)]
        time_id = accessor(times, 5126, "SCALAR", len(times))
        positions = [x, -7.8, z, x, -6.8, z, x, 4.8, z, x, 5.5, z, x, 6.2, z]
        out_id = accessor(positions, 5126, "VEC3", len(times))
        position_sampler = len(samplers)
        samplers.append({"input": time_id, "output": out_id, "interpolation": "LINEAR"})
        channels.append({"sampler": position_sampler, "target": {"node": root_id, "path": "translation"}})

        scales = [0, 0, 0, size, size, size, size, size, size, size * 0.18, size * 0.18, size * 0.18, 0, 0, 0]
        scale_id = accessor(scales, 5126, "VEC3", len(times))
        scale_sampler = len(samplers)
        samplers.append({"input": time_id, "output": scale_id, "interpolation": "LINEAR"})
        channels.append({"sampler": scale_sampler, "target": {"node": root_id, "path": "scale"}})
    doc["animations"] = [{"name": "Bubbles rising and popping", "samplers": samplers, "channels": channels}]
    doc["scenes"][0]["name"] = "Subtle rising poison bubbles"
    return doc


def save_glb(doc: dict, output: Path = OUT) -> None:
    align4()
    doc["buffers"][0]["byteLength"] = len(binary)
    json_chunk = json.dumps(doc, separators=(",", ":")).encode("utf-8")
    json_chunk += b" " * ((-len(json_chunk)) % 4)
    total = 12 + 8 + len(json_chunk) + 8 + len(binary)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total))
        f.write(struct.pack("<II", len(json_chunk), 0x4E4F534A))
        f.write(json_chunk)
        f.write(struct.pack("<II", len(binary), 0x004E4942))
        f.write(binary)


def render_preview() -> Path:
    size = 900
    image = Image.new("RGBA", (size, size), (13, 17, 20, 255))
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((180, 160, 740, 720), fill=(80, 173, 42, 76))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    image.alpha_composite(glow)
    d = ImageDraw.Draw(image, "RGBA")
    cx, cy, r = 450, 415, 247
    # Soft shadow and a radial green glass body.
    d.ellipse((cx - r - 9, cy - r - 9, cx + r + 9, cy + r + 9), fill=(78, 182, 49, 12), outline=(157, 232, 92, 55), width=3)
    for n in range(80, 0, -1):
        rr = r * n / 80
        t = n / 80
        color = (int(20 + 27 * t), int(39 + 85 * t), int(28 + 30 * t), int(240 * t))
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=color)
    # Reflective crescent edge and broad curved specular streak.
    d.arc((cx - r + 8, cy - r + 8, cx + r - 8, cy + r - 8), 198, 318, fill=(204, 255, 157, 210), width=8)
    d.arc((cx - r + 15, cy - r + 15, cx + r - 15, cy + r - 15), 20, 155, fill=(130, 214, 75, 145), width=5)
    sheen = Image.new("RGBA", image.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sheen)
    sd.ellipse((cx - 135, cy - 184, cx - 8, cy - 82), fill=(152, 246, 200, 44))
    sd.arc((cx - 145, cy - 196, cx - 5, cy - 74), 198, 306, fill=(210, 255, 234, 230), width=11)
    sd.ellipse((cx - 98, cy - 168, cx - 58, cy - 132), fill=(220, 255, 237, 215))
    sheen = sheen.filter(ImageFilter.GaussianBlur(3))
    image.alpha_composite(sheen)
    # A few trapped bubbles suggest fluid depth without visual clutter.
    d = ImageDraw.Draw(image, "RGBA")
    for x, y, rad in ((cx + 122, cy - 32, 19), (cx + 80, cy + 88, 10), (cx - 114, cy + 116, 8)):
        d.ellipse((x - rad, y - rad, x + rad, y + rad), fill=(129, 217, 94, 68), outline=(190, 249, 155, 170), width=3)
        d.arc((x - rad + 3, y - rad + 3, x + rad - 3, y + rad - 3), 205, 290, fill=(227, 255, 203, 230), width=2)
    preview = OUT.with_suffix(".png")
    image.convert("RGB").save(preview)
    return preview


if __name__ == "__main__":
    bubble = build()
    save_glb(bubble)
    cluster = make_cluster(bubble)
    save_glb(cluster, CLUSTER_OUT)
    preview = render_preview()
    print(f"Created {OUT} ({OUT.stat().st_size:,} bytes)")
    print(f"Created {CLUSTER_OUT} ({CLUSTER_OUT.stat().st_size:,} bytes)")
    print(f"Rendered {preview}")
