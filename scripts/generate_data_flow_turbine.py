"""Build a small animated GLB model for the portfolio's data-flow turbine."""

from __future__ import annotations

import json
import math
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "models" / "data-flow-turbine.glb"

materials = [
    {"name": "Midnight titanium", "pbrMetallicRoughness": {"baseColorFactor": [0.18, 0.25, 0.32, 1], "metallicFactor": 0.82, "roughnessFactor": 0.28}},
    {"name": "Brushed alloy", "pbrMetallicRoughness": {"baseColorFactor": [0.43, 0.54, 0.61, 1], "metallicFactor": 0.78, "roughnessFactor": 0.26}},
    {"name": "Rotor steel", "pbrMetallicRoughness": {"baseColorFactor": [0.35, 0.46, 0.54, 1], "metallicFactor": 0.78, "roughnessFactor": 0.24}},
    {"name": "Ion cyan", "pbrMetallicRoughness": {"baseColorFactor": [0.08, 0.68, 0.93, 1], "metallicFactor": 0.36, "roughnessFactor": 0.2}, "emissiveFactor": [0.04, 0.34, 0.72]},
    {"name": "Signal lime", "pbrMetallicRoughness": {"baseColorFactor": [0.57, 0.92, 0.16, 1], "metallicFactor": 0.28, "roughnessFactor": 0.2}, "emissiveFactor": [0.22, 0.52, 0.025]},
    {"name": "Cyan glass jacket", "alphaMode": "BLEND", "doubleSided": True, "pbrMetallicRoughness": {"baseColorFactor": [0.08, 0.55, 0.72, 0.28], "metallicFactor": 0.14, "roughnessFactor": 0.12}},
    {"name": "Lime glass jacket", "alphaMode": "BLEND", "doubleSided": True, "pbrMetallicRoughness": {"baseColorFactor": [0.38, 0.76, 0.15, 0.26], "metallicFactor": 0.12, "roughnessFactor": 0.13}},
    {"name": "Deep channel", "pbrMetallicRoughness": {"baseColorFactor": [0.015, 0.13, 0.2, 1], "metallicFactor": 0.32, "roughnessFactor": 0.18}},
]

binary = bytearray()
buffer_views: list[dict] = []
accessors: list[dict] = []
meshes: list[dict] = []
nodes: list[dict] = []
scene_roots: list[int] = []


def align4() -> None:
    while len(binary) % 4:
        binary.append(0)


def accessor(values: list[float] | list[int], component: int, kind: str, count: int, bounds: bool = False) -> int:
    align4()
    offset = len(binary)
    pack_code = "f" if component == 5126 else "H"
    binary.extend(struct.pack("<" + pack_code * len(values), *values))
    view_id = len(buffer_views)
    buffer_views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(binary) - offset})
    entry = {"bufferView": view_id, "componentType": component, "count": count, "type": kind}
    if bounds and kind == "VEC3":
        triples = list(zip(values[0::3], values[1::3], values[2::3]))
        entry["min"] = [min(p[i] for p in triples) for i in range(3)]
        entry["max"] = [max(p[i] for p in triples) for i in range(3)]
    accessors.append(entry)
    return len(accessors) - 1


def add_mesh(name: str, vertices: list[tuple[float, float, float]], faces: list[tuple[int, int, int]], material: int, parent: int | None = None) -> int:
    positions: list[float] = []
    normals: list[float] = []
    indices: list[int] = []
    for face in faces:
        a, b, c = (vertices[i] for i in face)
        ab = (b[0] - a[0], b[1] - a[1], b[2] - a[2])
        ac = (c[0] - a[0], c[1] - a[1], c[2] - a[2])
        n = (ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0])
        length = math.sqrt(sum(v * v for v in n)) or 1
        n = tuple(v / length for v in n)
        for point in (a, b, c):
            positions.extend(point)
            normals.extend(n)
            indices.append(len(indices))
    pos_id = accessor(positions, 5126, "VEC3", len(positions) // 3, True)
    norm_id = accessor(normals, 5126, "VEC3", len(normals) // 3)
    idx_id = accessor(indices, 5123, "SCALAR", len(indices))
    mesh_id = len(meshes)
    meshes.append({"name": name, "primitives": [{"attributes": {"POSITION": pos_id, "NORMAL": norm_id}, "indices": idx_id, "material": material}]})
    node = {"name": name, "mesh": mesh_id}
    node_id = len(nodes)
    nodes.append(node)
    if parent is None:
        scene_roots.append(node_id)
    else:
        nodes[parent].setdefault("children", []).append(node_id)
    return node_id


def cylinder(radius: float, height: float, center: tuple[float, float, float], material: int, name: str, parent: int | None = None, segments: int = 32) -> int:
    cx, cy, cz = center
    verts = []
    for y in (cy - height / 2, cy + height / 2):
        for i in range(segments):
            a = 2 * math.pi * i / segments
            verts.append((cx + radius * math.cos(a), y, cz + radius * math.sin(a)))
    faces = []
    for i in range(segments):
        j = (i + 1) % segments
        faces.extend([(i, j, segments + j), (i, segments + j, segments + i), (0, j, (j + 1) % segments), (segments, segments + ((i + 1) % segments), segments + i)])
    return add_mesh(name, verts, faces, material, parent)


def cylinder_between(start: tuple[float, float, float], end: tuple[float, float, float], radius: float, material: int, name: str, segments: int = 20, parent: int | None = None) -> int:
    direction = tuple(end[i] - start[i] for i in range(3))
    length = math.sqrt(sum(v * v for v in direction))
    axis = tuple(v / length for v in direction)
    ref = (0, 1, 0) if abs(axis[1]) < 0.9 else (1, 0, 0)
    u = (axis[1] * ref[2] - axis[2] * ref[1], axis[2] * ref[0] - axis[0] * ref[2], axis[0] * ref[1] - axis[1] * ref[0])
    ul = math.sqrt(sum(v * v for v in u))
    u = tuple(v / ul for v in u)
    v = (axis[1] * u[2] - axis[2] * u[1], axis[2] * u[0] - axis[0] * u[2], axis[0] * u[1] - axis[1] * u[0])
    verts = []
    for point in (start, end):
        for i in range(segments):
            a = 2 * math.pi * i / segments
            verts.append(tuple(point[k] + radius * (math.cos(a) * u[k] + math.sin(a) * v[k]) for k in range(3)))
    faces = []
    for i in range(segments):
        j = (i + 1) % segments
        faces.extend([(i, j, segments + j), (i, segments + j, segments + i)])
    return add_mesh(name, verts, faces, material, parent)


def curved_tube(path: list[tuple[float, float, float]], radius: float, material: int, name: str, segments: int = 24) -> int:
    # Catmull-Rom samples keep the exposed feed and delivery lines smooth around bends.
    samples = []
    for i in range(len(path) - 1):
        p0, p1 = path[max(0, i - 1)], path[i]
        p2, p3 = path[i + 1], path[min(len(path) - 1, i + 2)]
        for step in range(6):
            t = step / 6
            t2, t3 = t * t, t * t * t
            samples.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2*p0[k] - 5*p1[k] + 4*p2[k] - p3[k]) * t2 + (-p0[k] + 3*p1[k] - 3*p2[k] + p3[k]) * t3) for k in range(3)))
    samples.append(path[-1])
    verts = []
    for i, point in enumerate(samples):
        before, after = samples[max(0, i - 1)], samples[min(len(samples) - 1, i + 1)]
        tangent = tuple(after[k] - before[k] for k in range(3))
        length = math.sqrt(sum(v * v for v in tangent)) or 1
        tangent = tuple(v / length for v in tangent)
        ref = (0, 0, 1) if abs(tangent[2]) < 0.9 else (0, 1, 0)
        u = (tangent[1] * ref[2] - tangent[2] * ref[1], tangent[2] * ref[0] - tangent[0] * ref[2], tangent[0] * ref[1] - tangent[1] * ref[0])
        ul = math.sqrt(sum(v * v for v in u)) or 1
        u = tuple(v / ul for v in u)
        v = (tangent[1] * u[2] - tangent[2] * u[1], tangent[2] * u[0] - tangent[0] * u[2], tangent[0] * u[1] - tangent[1] * u[0])
        for j in range(segments):
            angle = math.tau * j / segments
            verts.append(tuple(point[k] + radius * (math.cos(angle) * u[k] + math.sin(angle) * v[k]) for k in range(3)))
    faces = []
    for i in range(len(samples) - 1):
        for j in range(segments):
            a, b = i * segments + j, i * segments + (j + 1) % segments
            c, d = (i + 1) * segments + (j + 1) % segments, (i + 1) * segments + j
            faces.extend([(a, b, d), (b, c, d)])
    return add_mesh(name, verts, faces, material)


def tapered_tube_x(x1: float, x2: float, radius1: float, radius2: float, center_y: float, material: int, name: str, segments: int = 40) -> int:
    verts = []
    for x, radius in ((x1, radius1), (x2, radius2)):
        for i in range(segments):
            a = math.tau * i / segments
            verts.append((x, center_y + radius * math.cos(a), radius * math.sin(a)))
    faces = []
    for i in range(segments):
        j = (i + 1) % segments
        faces.extend([(i, segments + i, segments + j), (i, segments + j, j)])
    return add_mesh(name, verts, faces, material)


def sphere(radius: float, center: tuple[float, float, float], material: int, name: str, parent: int | None = None, rings: int = 12, segments: int = 20) -> int:
    cx, cy, cz = center
    verts = []
    for r in range(rings + 1):
        phi = math.pi * r / rings
        for s in range(segments):
            theta = 2 * math.pi * s / segments
            verts.append((cx + radius * math.sin(phi) * math.cos(theta), cy + radius * math.cos(phi), cz + radius * math.sin(phi) * math.sin(theta)))
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
    return add_mesh(name, verts, faces, material, parent)


def torus(major: float, minor: float, y: float, material: int, name: str, parent: int | None = None, rings: int = 48, sides: int = 10) -> int:
    verts = []
    for i in range(rings):
        u = 2 * math.pi * i / rings
        for j in range(sides):
            v = 2 * math.pi * j / sides
            r = major + minor * math.cos(v)
            verts.append((r * math.cos(u), y + minor * math.sin(v), r * math.sin(u)))
    faces = []
    for i in range(rings):
        for j in range(sides):
            a = i * sides + j
            b = i * sides + (j + 1) % sides
            c = ((i + 1) % rings) * sides + (j + 1) % sides
            d = ((i + 1) % rings) * sides + j
            faces.extend([(a, b, d), (b, c, d)])
    return add_mesh(name, verts, faces, material, parent)


def torus_x(major: float, minor: float, x: float, center_y: float, center_z: float, material: int, name: str, parent: int | None = None, rings: int = 48, sides: int = 12) -> int:
    verts = []
    for i in range(rings):
        u = 2 * math.pi * i / rings
        for j in range(sides):
            v = 2 * math.pi * j / sides
            r = major + minor * math.cos(v)
            verts.append((x + minor * math.sin(v), center_y + r * math.cos(u), center_z + r * math.sin(u)))
    faces = []
    for i in range(rings):
        for j in range(sides):
            a = i * sides + j
            b = i * sides + (j + 1) % sides
            c = ((i + 1) % rings) * sides + (j + 1) % sides
            d = ((i + 1) % rings) * sides + j
            faces.extend([(a, d, b), (b, d, c)])
    return add_mesh(name, verts, faces, material, parent)


def box(center: tuple[float, float, float], size: tuple[float, float, float], material: int, name: str) -> int:
    cx, cy, cz = center
    sx, sy, sz = (v / 2 for v in size)
    verts = [(cx + x * sx, cy + y * sy, cz + z * sz) for x, y, z in (
        (-1, -1, -1), (1, -1, -1), (1, -1, 1), (-1, -1, 1),
        (-1, 1, -1), (1, 1, -1), (1, 1, 1), (-1, 1, 1),
    )]
    faces = [
        (0, 2, 1), (0, 3, 2), (4, 5, 6), (4, 6, 7),
        (0, 1, 5), (0, 5, 4), (1, 2, 6), (1, 6, 5),
        (2, 3, 7), (2, 7, 6), (3, 0, 4), (3, 4, 7),
    ]
    return add_mesh(name, verts, faces, material)


def blade_x(angle: float, parent: int | None, name: str, material: int = 2) -> int:
    # Airfoil section with chord, sweep, and twist changing along the radial span.
    stations = [(0.12, 0.2, -0.04, -0.03), (0.23, 0.26, 0.0, 0.02), (0.36, 0.22, 0.09, 0.12), (0.49, 0.13, 0.2, 0.24)]
    chord_steps = 5
    verts = []
    for side in (-1, 1):
        for radius, chord, sweep, twist in stations:
            for j in range(chord_steps):
                u = j / (chord_steps - 1)
                theta = angle + twist * (u - 0.38)
                x = sweep + chord * (u - 0.5)
                thickness = 0.012 + 0.055 * math.sin(math.pi * u) * (0.45 + radius)
                a = theta + side * thickness / (2 * radius)
                verts.append((x, radius * math.cos(a), radius * math.sin(a)))
    face_count = len(stations) * chord_steps
    faces = []
    for layer in range(2):
        base = layer * face_count
        for i in range(len(stations) - 1):
            for j in range(chord_steps - 1):
                a = base + i * chord_steps + j
                b, d = a + 1, a + chord_steps
                c = d + 1
                faces.extend([(a, b, d), (b, c, d)] if layer == 0 else [(a, d, b), (b, d, c)])
    # Close the leading edge, trailing edge, root, and blade tip.
    for i in range(len(stations) - 1):
        for j in (0, chord_steps - 1):
            a, b = i * chord_steps + j, (i + 1) * chord_steps + j
            faces.extend([(a, b, face_count + b), (a, face_count + b, face_count + a)])
    for i in (0, len(stations) - 1):
        for j in range(chord_steps - 1):
            a, b = i * chord_steps + j, i * chord_steps + j + 1
            faces.extend([(a, face_count + a, face_count + b), (a, face_count + b, b)])
    return add_mesh(name, verts, faces, material, parent)


def blade(angle: float, parent: int) -> int:
    # A swept, softly tapered blade with a little vertical thickness.
    points = []
    for y in (-0.045, 0.045):
        for radius, half_width, sweep in ((0.31, 0.11, 0.02), (0.88, 0.19, 0.13)):
            for side in (-1, 1):
                a = angle + sweep + side * half_width / radius
                points.append((radius * math.cos(a), y, radius * math.sin(a)))
    # lower and upper faces, then the four thin edge faces
    faces = [(0, 1, 3), (0, 3, 2), (4, 6, 7), (4, 7, 5), (0, 2, 6), (0, 6, 4), (1, 5, 7), (1, 7, 3), (0, 4, 5), (0, 5, 1), (2, 3, 7), (2, 7, 6)]
    return add_mesh("Swept turbine blade", points, faces, 2, parent)


def vec_animation(values: list[list[float]], times: list[float], components: int, kind: str) -> tuple[int, int]:
    input_id = accessor(times, 5126, "SCALAR", len(times))
    flat = [v for row in values for v in row]
    output_id = accessor(flat, 5126, kind, len(values))
    return input_id, output_id


def make_model() -> dict:
    # Low sculpted platform with a luminous guide line around its chamfered edge.
    box((0, 0.2, 0), (5.5, 0.4, 1.72), 0, "Machined display plinth")
    box((0, 0.42, 0), (4.9, 0.12, 1.38), 1, "Plinth top plate")
    box((0, 0.49, 0), (4.55, 0.06, 1.16), 0, "Inset instrument deck")
    for z in (-0.78, 0.78):
        cylinder_between((-2.48, 0.19, z), (2.48, 0.19, z), 0.022, 3 if z < 0 else 4, "Plinth luminous rail", segments=10)
    for x in (-1.18, 1.18):
        for z in (-0.43, 0.43):
            box((x, 0.61, z), (0.38, 0.28, 0.36), 0, "Shock mount")
            box((x, 0.76, z), (0.3, 0.16, 0.28), 1, "Raised machine saddle")

    axis_y = 1.02
    # Transparent feed and delivery channels, with separate cyan/lime streams inside.
    inlet_path = [(-3.25, 1.48, 0), (-2.82, 1.46, 0), (-2.48, 1.34, 0), (-2.18, 1.15, 0), (-1.78, axis_y, 0), (-1.35, axis_y, 0)]
    outlet_path = [(1.38, axis_y, 0), (1.92, axis_y, 0), (2.28, 1.08, 0), (2.62, 1.18, 0), (3.22, 1.18, 0)]
    # Flared bellmouth makes the intake read as an engineered air path.
    tapered_tube_x(-3.52, -3.2, 0.49, 0.34, 1.48, 0, "Machined intake bellmouth")
    torus_x(0.475, 0.035, -3.51, 1.48, 0, 1, "Intake rolled lip", rings=56, sides=12)
    torus_x(0.355, 0.022, -3.19, 1.48, 0, 3, "Intake inner seal", rings=48, sides=10)
    # Radial struts hold the inner flow cone while leaving the opening visible.
    for i in range(8):
        a = math.tau * i / 8
        cylinder_between((-3.17, 1.48 + 0.105 * math.cos(a), 0.105 * math.sin(a)),
                         (-3.17, 1.48 + 0.315 * math.cos(a + 0.12), 0.315 * math.sin(a + 0.12)),
                         0.018, 1, "Intake guide strut", segments=10)
    sphere(0.105, (-3.16, 1.48, 0), 2, "Intake flow cone", rings=10, segments=18)

    curved_tube(inlet_path, 0.34, 5, "Transparent cyan inlet")
    curved_tube(outlet_path, 0.34, 6, "Transparent lime outlet")
    tapered_tube_x(3.08, 3.4, 0.34, 0.46, 1.18, 0, "Expanded delivery nozzle")
    torus_x(0.445, 0.032, 3.38, 1.18, 0, 1, "Outlet rolled lip", rings=56, sides=12)
    curved_tube([(x, y + 0.115, z) for x, y, z in inlet_path], 0.062, 3, "Cyan data stream")
    curved_tube([(x, y - 0.11, z) for x, y, z in inlet_path], 0.048, 4, "Lime data stream")
    curved_tube(outlet_path, 0.085, 4, "Delivery beam")
    for i, x in enumerate((2.72, 2.98)):
        cylinder_between((x - 0.075, 1.1, 0.23), (x + 0.035, 1.18, 0.23), 0.018, 4, f"Output arrow upper {i + 1}", segments=8)
        cylinder_between((x + 0.035, 1.18, 0.23), (x - 0.075, 1.26, 0.23), 0.018, 4, f"Output arrow lower {i + 1}", segments=8)

    # Machine casing: alternating armor sleeves and open luminous inspection windows.
    cylinder_between((-1.72, axis_y, 0), (-1.14, axis_y, 0), 0.62, 0, "Inlet armor shell")
    cylinder_between((-1.14, axis_y, 0), (1.08, axis_y, 0), 0.53, 5, "Main glass processing tube")
    cylinder_between((1.08, axis_y, 0), (1.62, axis_y, 0), 0.62, 0, "Outlet armor shell")
    cylinder_between((-1.62, axis_y, 0), (-1.38, axis_y, 0), 0.37, 7, "Inlet inner channel", segments=28)
    cylinder_between((1.3, axis_y, 0), (1.56, axis_y, 0), 0.37, 7, "Outlet inner channel", segments=28)

    # Layered flanges and accent rings echo the industrial reference image.
    ring_specs = [(-1.73, 0.68, 1), (-1.57, 0.64, 3), (-1.16, 0.61, 1), (-0.98, 0.57, 3), (0.9, 0.58, 4), (1.1, 0.62, 1), (1.47, 0.64, 4), (1.64, 0.68, 1)]
    for idx, (x, radius, color) in enumerate(ring_specs):
        torus_x(radius, 0.048 if idx % 2 == 0 else 0.027, x, axis_y, 0, color, f"Layered flange {idx + 1}")
    for x in (-1.68, -1.14, 1.08, 1.58):
        torus_x(0.47, 0.018, x, axis_y, 0, 3, "Inner glass lip", rings=40, sides=8)

    # Small bolts sit around the flanges; short ribs give the armor a machined finish.
    for x in (-1.73, -1.16, 1.1, 1.64):
        for i in range(12):
            a = math.tau * i / 12
            y = axis_y + 0.665 * math.cos(a)
            z = 0.665 * math.sin(a)
            sphere(0.027, (x, y, z), 2 if i % 3 else 4, "Flange fastener", rings=6, segments=8)
    for i in range(16):
        a = math.tau * i / 16
        y, z = axis_y + 0.535 * math.cos(a), 0.535 * math.sin(a)
        cylinder_between((-0.9, y, z), (-0.66, y, z), 0.016, 1, "Inspection window rib", segments=8)

    # Exposed swept airfoils spin about the pipeline axis.
    rotor_id = len(nodes)
    nodes.append({"name": "Rotor assembly", "translation": [-0.28, axis_y, 0], "children": []})
    scene_roots.append(rotor_id)
    cylinder_between((-0.17, 0, 0), (0.17, 0, 0), 0.16, 1, "Rotor axle", parent=rotor_id)
    torus_x(0.43, 0.027, 0, 0, 0, 3, "Rotor safety rim", rotor_id, rings=40)
    cylinder_between((-0.2, 0, 0), (0.2, 0, 0), 0.11, 4, "Rotor signal core", parent=rotor_id, segments=24)
    for i in range(9):
        blade_x(i * math.tau / 9, rotor_id, f"Swept turbine airfoil {i + 1}")

    # A second, stationary row straightens the outgoing flow like an axial turbine stator.
    stator_id = len(nodes)
    nodes.append({"name": "Downstream stator row", "translation": [0.48, axis_y, 0], "children": []})
    scene_roots.append(stator_id)
    cylinder_between((-0.06, 0, 0), (0.06, 0, 0), 0.105, 1, "Stator hub", parent=stator_id, segments=24)
    torus_x(0.47, 0.018, 0, 0, 0, 4, "Stator tip indicator", stator_id, rings=40, sides=8)
    for i in range(7):
        blade_x((i + 0.5) * math.tau / 7, stator_id, f"Flow-straightening stator vane {i + 1}", material=1)

    # Segmented optical data packets pass through the housing and into the output.
    particle_nodes = []
    for i, color in enumerate((3, 4, 3)):
        start_x = (-2.9, -2.05, -1.72)[i]
        node_id = sphere(0.07, (0, 0, 0), color, f"Traveling data packet {i + 1}", rings=10, segments=16)
        nodes[node_id]["translation"] = [start_x, axis_y + (0.11 if i % 2 == 0 else -0.11), 0]
        particle_nodes.append(node_id)

    animation_samplers = []
    animation_channels = []
    spin_in, spin_out = vec_animation([[0, 0, 0, 1], [1, 0, 0, 0], [0, 0, 0, -1]], [0, 2, 4], 4, "VEC4")
    animation_samplers.append({"input": spin_in, "output": spin_out, "interpolation": "LINEAR"})
    animation_channels.append({"sampler": 0, "target": {"node": rotor_id, "path": "rotation"}})
    for node_id in particle_nodes:
        times = [0, 3]
        start_position = nodes[node_id]["translation"]
        positions = [start_position, [3.05, start_position[1], 0]]
        input_id, output_id = vec_animation(positions, times, 3, "VEC3")
        sampler_id = len(animation_samplers)
        animation_samplers.append({"input": input_id, "output": output_id, "interpolation": "LINEAR"})
        animation_channels.append({"sampler": sampler_id, "target": {"node": node_id, "path": "translation"}})

    return {
        "asset": {"version": "2.0", "generator": "Ashwin Sharma · procedural data-flow turbine"},
        "scene": 0,
        "scenes": [{"name": "Data Flow Turbine", "nodes": scene_roots}],
        "nodes": nodes,
        "meshes": meshes,
        "materials": materials,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(binary)}],
        "animations": [{"name": "Rotor and data flow", "samplers": animation_samplers, "channels": animation_channels}],
        "extras": {"description": "A horizontal industrial data pipeline with transparent cyan and lime channels, layered titanium flanges, an animated axial rotor, and moving data packets. Y-up axis; scale in meters."},
    }


def write_glb(document: dict) -> None:
    json_bytes = json.dumps(document, separators=(",", ":")).encode("utf-8")
    while len(json_bytes) % 4:
        json_bytes += b" "
    while len(binary) % 4:
        binary.append(0)
    document["buffers"][0]["byteLength"] = len(binary)
    json_bytes = json.dumps(document, separators=(",", ":")).encode("utf-8")
    while len(json_bytes) % 4:
        json_bytes += b" "
    total_length = 12 + 8 + len(json_bytes) + 8 + len(binary)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("wb") as file:
        file.write(struct.pack("<4sII", b"glTF", 2, total_length))
        file.write(struct.pack("<II", len(json_bytes), 0x4E4F534A))
        file.write(json_bytes)
        file.write(struct.pack("<II", len(binary), 0x004E4942))
        file.write(binary)


def render_preview() -> Path:
    """Rasterize a small shaded preview from the same GLB triangles."""
    blob = OUTPUT.read_bytes()
    json_size = struct.unpack_from("<I", blob, 12)[0]
    document = json.loads(blob[20:20 + json_size])
    bin_header = 20 + json_size
    bin_size = struct.unpack_from("<I", blob, bin_header)[0]
    raw = memoryview(blob)[bin_header + 8:bin_header + 8 + bin_size]

    def read_accessor(accessor_id: int) -> list[float] | list[int]:
        entry = document["accessors"][accessor_id]
        view = document["bufferViews"][entry["bufferView"]]
        start = view.get("byteOffset", 0) + entry.get("byteOffset", 0)
        count = entry["count"]
        kind = entry["type"]
        width = {"SCALAR": 1, "VEC3": 3, "VEC4": 4}[kind]
        code = {5123: "H", 5126: "f"}[entry["componentType"]]
        return list(struct.unpack_from("<" + code * count * width, raw, start))

    parent_of: dict[int, int] = {}
    for idx, node in enumerate(document["nodes"]):
        for child in node.get("children", []):
            parent_of[child] = idx

    angle = 0.62
    rotation = ((1, 0, 0), (0, math.cos(angle), -math.sin(angle)), (0, math.sin(angle), math.cos(angle)))

    def transform_for(node_id: int) -> tuple[list[list[float]], list[float]]:
        node = document["nodes"][node_id]
        if node_id in parent_of:
            parent_matrix, parent_offset = transform_for(parent_of[node_id])
        else:
            parent_matrix, parent_offset = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0, 0, 0]
        local_matrix = rotation if node.get("name") == "Rotor assembly" else [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
        local_offset = node.get("translation", [0, 0, 0])
        matrix = [[sum(parent_matrix[r][k] * local_matrix[k][c] for k in range(3)) for c in range(3)] for r in range(3)]
        offset = [parent_offset[r] + sum(parent_matrix[r][k] * local_offset[k] for k in range(3)) for r in range(3)]
        return matrix, offset

    target = (0.0, 1.0, 0.0)
    camera = (3.2, 3.2, 6.8)
    forward_raw = tuple(target[i] - camera[i] for i in range(3))
    fl = math.sqrt(sum(v * v for v in forward_raw))
    forward = tuple(v / fl for v in forward_raw)
    right_raw = (-forward[2], 0.0, forward[0])
    rl = math.sqrt(sum(v * v for v in right_raw))
    right = tuple(v / rl for v in right_raw)
    up = (right[1] * forward[2] - right[2] * forward[1], right[2] * forward[0] - right[0] * forward[2], right[0] * forward[1] - right[1] * forward[0])
    light_raw = (-0.5, 0.75, 0.55)
    ll = math.sqrt(sum(v * v for v in light_raw))
    light = tuple(v / ll for v in light_raw)

    width, height = 1200, 760
    image = Image.new("RGBA", (width, height), (15, 18, 23, 255))
    atmosphere = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    atmosphere_draw = ImageDraw.Draw(atmosphere)
    atmosphere_draw.ellipse((190, 65, 1040, 700), fill=(30, 104, 99, 58))
    atmosphere = atmosphere.filter(ImageFilter.GaussianBlur(105))
    image.alpha_composite(atmosphere)
    shadow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse((190, 580, 1030, 735), fill=(0, 0, 0, 155))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))
    image.alpha_composite(shadow)
    image = image.convert("RGB")
    grid = ImageDraw.Draw(image)
    for x in range(45, width, 54):
        grid.line((x, 0, x, height), fill=(22, 26, 32), width=1)
    for y in range(40, height, 54):
        grid.line((0, y, width, y), fill=(22, 26, 32), width=1)
    draw = ImageDraw.Draw(image, "RGBA")
    scale = 148
    triangles = []
    for node_id, node in enumerate(document["nodes"]):
        if "mesh" not in node:
            continue
        matrix, offset = transform_for(node_id)
        mesh = document["meshes"][node["mesh"]]
        for primitive in mesh["primitives"]:
            positions = read_accessor(primitive["attributes"]["POSITION"])
            normals = read_accessor(primitive["attributes"]["NORMAL"])
            indices = read_accessor(primitive["indices"])
            material = document["materials"][primitive["material"]]
            rgba = material["pbrMetallicRoughness"]["baseColorFactor"]
            base = tuple(round(255 * max(0, min(1, component))) for component in rgba[:3])
            alpha = round(255 * max(0, min(1, rgba[3])))
            emissive = material.get("emissiveFactor", [0, 0, 0])
            for i in range(0, len(indices), 3):
                pts, transformed_normals, depths = [], [], []
                for idx in indices[i:i + 3]:
                    p = positions[idx * 3:idx * 3 + 3]
                    world = [sum(matrix[r][k] * p[k] for k in range(3)) + offset[r] for r in range(3)]
                    relative = [world[k] - target[k] for k in range(3)]
                    px = width / 2 + sum(relative[k] * right[k] for k in range(3)) * scale
                    py = height * 0.58 - sum(relative[k] * up[k] for k in range(3)) * scale
                    pts.append((px, py))
                    depths.append(sum(relative[k] * forward[k] for k in range(3)))
                    n = normals[idx * 3:idx * 3 + 3]
                    transformed_normals.append(tuple(sum(matrix[r][k] * n[k] for k in range(3)) for r in range(3)))
                normal = tuple(sum(n[k] for n in transformed_normals) / 3 for k in range(3))
                nl = math.sqrt(sum(v * v for v in normal)) or 1
                diffuse = max(0.0, sum(normal[k] * light[k] for k in range(3)) / nl)
                shade = min(1.25, 0.56 + 0.8 * diffuse + max(emissive) * 0.3)
                color = (*tuple(min(255, round(c * shade)) for c in base), alpha)
                triangles.append((sum(depths) / 3, pts, color))
    for _, pts, color in sorted(triangles, key=lambda triangle: triangle[0], reverse=True):
        draw.polygon(pts, fill=color)
    preview = OUTPUT.with_suffix(".png")
    image.resize((1200, 760), Image.Resampling.LANCZOS).save(preview)
    return preview


if __name__ == "__main__":
    write_glb(make_model())
    print(f"Created {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")
    preview = render_preview()
    print(f"Rendered {preview}")
