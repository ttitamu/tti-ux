// AUTO-GENERATED from app/utils/tuxArchitectureMap.ts by scripts/build-map-runtime.mjs — DO NOT EDIT.
// SPDX-License-Identifier: Apache-2.0 (adapts MIT geometry/graph routines; see app/utils/tuxArchitectureMap.ts)
// SOURCE-SHA256: 8b4d759246ea1abf4ad4d65632b795f39d79daf953b0802f9ebb4ed9eddede1e
export const LOD_THRESHOLDS = {
    resources: 0.65,
    packages: 1.25,
};
export function resolveSemanticLoD(zoom, override = "auto") {
    if (override !== "auto")
        return override;
    if (zoom < LOD_THRESHOLDS.resources)
        return "executive";
    if (zoom < LOD_THRESHOLDS.packages)
        return "resources";
    return "packages";
}
export function getNodeDimensionsForLoD(node, lod) {
    if (lod === "executive") {
        return { width: 340, height: 198 };
    }
    if (lod === "resources") {
        const resourceRows = Math.ceil(Math.max(1, node.resources.length) / 2);
        return {
            width: 372,
            height: 196 + resourceRows * 48,
        };
    }
    const resourceRows = Math.ceil(Math.max(1, node.resources.length) / 2);
    const pkgRows = Math.max(1, node.packages.length);
    return {
        width: 408,
        height: 226 + resourceRows * 48 + pkgRows * 30,
    };
}
export function screenToWorld(screenX, screenY, viewport) {
    const safeZoom = Math.max(0.05, viewport.zoom);
    return {
        x: (screenX - viewport.x) / safeZoom,
        y: (screenY - viewport.y) / safeZoom,
    };
}
export function worldToScreen(worldX, worldY, viewport) {
    return {
        x: worldX * viewport.zoom + viewport.x,
        y: worldY * viewport.zoom + viewport.y,
    };
}
export function zoomAroundScreenPoint(viewport, nextZoom, focalScreenX, focalScreenY, minZoom = 0.25, maxZoom = 2.5) {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, nextZoom));
    const worldBefore = screenToWorld(focalScreenX, focalScreenY, viewport);
    return {
        x: focalScreenX - worldBefore.x * clampedZoom,
        y: focalScreenY - worldBefore.y * clampedZoom,
        zoom: Number(clampedZoom.toFixed(4)),
    };
}
export function getBoundsOfRects(rects) {
    if (rects.length === 0) {
        return { x: 0, y: 0, width: 800, height: 600 };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const r of rects) {
        if (r.x < minX)
            minX = r.x;
        if (r.y < minY)
            minY = r.y;
        if (r.x + r.width > maxX)
            maxX = r.x + r.width;
        if (r.y + r.height > maxY)
            maxY = r.y + r.height;
    }
    return {
        x: minX,
        y: minY,
        width: Math.max(1, maxX - minX),
        height: Math.max(1, maxY - minY),
    };
}
export function getViewportForBounds(bounds, containerWidth, containerHeight, minZoom = 0.25, maxZoom = 2.0, padding = 0.14) {
    const safeW = Math.max(1, containerWidth * (1 - padding * 2));
    const safeH = Math.max(1, containerHeight * (1 - padding * 2));
    const xZoom = safeW / Math.max(1, bounds.width);
    const yZoom = safeH / Math.max(1, bounds.height);
    const zoom = Math.max(minZoom, Math.min(maxZoom, Math.min(xZoom, yZoom)));
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    return {
        x: Math.round(containerWidth / 2 - centerX * zoom),
        y: Math.round(containerHeight / 2 - centerY * zoom),
        zoom: Number(zoom.toFixed(3)),
    };
}
const HANDLE_DIRECTIONS = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    top: { x: 0, y: -1 },
    bottom: { x: 0, y: 1 },
};
function ptDistance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}
function isCollinearBetween(a, b, c) {
    return ((a.x === b.x && b.x === c.x && (b.y - a.y) * (c.y - b.y) >= 0) ||
        (a.y === b.y && b.y === c.y && (b.x - a.x) * (c.x - b.x) >= 0));
}
function getRoundedBend(a, b, c, size) {
    const bendSize = Math.min(ptDistance(a, b) / 2, ptDistance(b, c) / 2, size);
    const { x, y } = b;
    if ((a.x === x && x === c.x) || (a.y === y && y === c.y) || bendSize < 0.5) {
        return `L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    if (a.y === y) {
        const xDir = a.x < c.x ? -1 : 1;
        const yDir = a.y < c.y ? 1 : -1;
        return `L ${(x + bendSize * xDir).toFixed(1)},${y.toFixed(1)} Q ${x.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y + bendSize * yDir).toFixed(1)}`;
    }
    const xDir = a.x < c.x ? 1 : -1;
    const yDir = a.y < c.y ? -1 : 1;
    return `L ${x.toFixed(1)},${(y + bendSize * yDir).toFixed(1)} Q ${x.toFixed(1)},${y.toFixed(1)} ${(x + bendSize * xDir).toFixed(1)},${y.toFixed(1)}`;
}
export function getSmoothStepEdgePath(params) {
    const { sourceX, sourceY, sourcePosition = "right", targetX, targetY, targetPosition = "left", borderRadius = 10, offset = 24, } = params;
    const source = { x: sourceX, y: sourceY };
    const target = { x: targetX, y: targetY };
    const sourceDir = HANDLE_DIRECTIONS[sourcePosition];
    const targetDir = HANDLE_DIRECTIONS[targetPosition];
    const sourceGapped = {
        x: source.x + sourceDir.x * offset,
        y: source.y + sourceDir.y * offset,
    };
    const targetGapped = {
        x: target.x + targetDir.x * offset,
        y: target.y + targetDir.y * offset,
    };
    const isHorizontal = sourcePosition === "left" || sourcePosition === "right";
    const dirAccessor = isHorizontal ? "x" : "y";
    const currDir = dirAccessor === "x"
        ? sourceGapped.x < targetGapped.x
            ? 1
            : -1
        : sourceGapped.y < targetGapped.y
            ? 1
            : -1;
    let points = [];
    let labelX = (source.x + target.x) / 2;
    let labelY = (source.y + target.y) / 2;
    if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
        const centerX = (sourceGapped.x + targetGapped.x) / 2;
        const centerY = (sourceGapped.y + targetGapped.y) / 2;
        labelX = centerX;
        labelY = centerY;
        const verticalSplit = [
            { x: centerX, y: sourceGapped.y },
            { x: centerX, y: targetGapped.y },
        ];
        const horizontalSplit = [
            { x: sourceGapped.x, y: centerY },
            { x: targetGapped.x, y: centerY },
        ];
        if (sourceDir[dirAccessor] === currDir) {
            points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
        }
        else {
            points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
        }
    }
    else {
        const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
        const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
        if (dirAccessor === "x") {
            points = sourceDir.x === currDir ? targetSource : sourceTarget;
        }
        else {
            points = sourceDir.y === currDir ? sourceTarget : targetSource;
        }
        labelX = points[0].x;
        labelY = points[0].y;
    }
    const rawSeq = [source, sourceGapped, ...points, targetGapped, target];
    const pathPoints = [];
    for (const pt of rawSeq) {
        const [a, b] = pathPoints.slice(-2);
        if (a && b && isCollinearBetween(a, b, pt)) {
            pathPoints.pop();
        }
        pathPoints.push(pt);
    }
    let path = `M${pathPoints[0].x.toFixed(1)} ${pathPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < pathPoints.length - 1; i++) {
        path += getRoundedBend(pathPoints[i - 1], pathPoints[i], pathPoints[i + 1], borderRadius);
    }
    const last = pathPoints[pathPoints.length - 1];
    path += `L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
    return { path, labelX, labelY };
}
export function getBezierEdgePath(params) {
    const { sourceX, sourceY, sourcePosition = "right", targetX, targetY, targetPosition = "left", curvature = 0.28, } = params;
    const ctrlOffset = (dist) => dist >= 0 ? 0.5 * dist : curvature * 25 * Math.sqrt(-dist);
    const getControl = (pos, x1, y1, x2, y2) => {
        switch (pos) {
            case "left":
                return [x1 - ctrlOffset(x1 - x2), y1];
            case "right":
                return [x1 + ctrlOffset(x2 - x1), y1];
            case "top":
                return [x1, y1 - ctrlOffset(y1 - y2)];
            case "bottom":
                return [x1, y1 + ctrlOffset(y2 - y1)];
        }
    };
    const [scx, scy] = getControl(sourcePosition, sourceX, sourceY, targetX, targetY);
    const [tcx, tcy] = getControl(targetPosition, targetX, targetY, sourceX, sourceY);
    const labelX = sourceX * 0.125 + scx * 0.375 + tcx * 0.375 + targetX * 0.125;
    const labelY = sourceY * 0.125 + scy * 0.375 + tcy * 0.375 + targetY * 0.125;
    return {
        path: `M${sourceX.toFixed(1)},${sourceY.toFixed(1)} C${scx.toFixed(1)},${scy.toFixed(1)} ${tcx.toFixed(1)},${tcy.toFixed(1)} ${targetX.toFixed(1)},${targetY.toFixed(1)}`,
        labelX,
        labelY,
    };
}
export function getStraightEdgePath(params) {
    const { sourceX, sourceY, targetX, targetY } = params;
    return {
        path: `M${sourceX.toFixed(1)},${sourceY.toFixed(1)} L${targetX.toFixed(1)},${targetY.toFixed(1)}`,
        labelX: (sourceX + targetX) / 2,
        labelY: (sourceY + targetY) / 2,
    };
}
export function resolveOptimalEdgeAnchors(sourceRect, targetRect) {
    const scx = sourceRect.x + sourceRect.width / 2;
    const scy = sourceRect.y + sourceRect.height / 2;
    const tcx = targetRect.x + targetRect.width / 2;
    const tcy = targetRect.y + targetRect.height / 2;
    const dx = tcx - scx;
    const dy = tcy - scy;
    if (Math.abs(dx) >= Math.abs(dy) * 0.75) {
        if (dx >= 0) {
            return {
                sourceX: sourceRect.x + sourceRect.width,
                sourceY: scy,
                sourcePosition: "right",
                targetX: targetRect.x,
                targetY: tcy,
                targetPosition: "left",
            };
        }
        return {
            sourceX: sourceRect.x,
            sourceY: scy,
            sourcePosition: "left",
            targetX: targetRect.x + targetRect.width,
            targetY: tcy,
            targetPosition: "right",
        };
    }
    if (dy >= 0) {
        return {
            sourceX: scx,
            sourceY: sourceRect.y + sourceRect.height,
            sourcePosition: "bottom",
            targetX: tcx,
            targetY: targetRect.y,
            targetPosition: "top",
        };
    }
    return {
        sourceX: scx,
        sourceY: sourceRect.y,
        sourcePosition: "top",
        targetX: tcx,
        targetY: targetRect.y + targetRect.height,
        targetPosition: "bottom",
    };
}
export function computeMapAutoLayout(nodes, edges, lod = "resources") {
    const result = new Map();
    if (nodes.length === 0)
        return result;
    const inDegree = new Map();
    const adj = new Map();
    for (const n of nodes) {
        inDegree.set(n.id, 0);
        adj.set(n.id, []);
    }
    for (const e of edges) {
        if (adj.has(e.source) && inDegree.has(e.target)) {
            adj.get(e.source).push(e.target);
            inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
        }
    }
    const computedTiers = new Map();
    const queue = [];
    for (const n of nodes) {
        if (typeof n.tier === "number") {
            computedTiers.set(n.id, n.tier);
        }
        else if ((inDegree.get(n.id) ?? 0) === 0) {
            computedTiers.set(n.id, 0);
            queue.push(n.id);
        }
    }
    if (queue.length === 0) {
        for (const n of nodes) {
            if (!computedTiers.has(n.id)) {
                computedTiers.set(n.id, 0);
                queue.push(n.id);
            }
        }
    }
    while (queue.length > 0) {
        const curr = queue.shift();
        const currTier = computedTiers.get(curr) ?? 0;
        for (const next of adj.get(curr) ?? []) {
            const nextNode = nodes.find((n) => n.id === next);
            if (nextNode && typeof nextNode.tier === "number") {
                computedTiers.set(next, nextNode.tier);
            }
            else if (!computedTiers.has(next) || (computedTiers.get(next) ?? 0) < currTier + 1) {
                if ((currTier + 1) <= 5) {
                    computedTiers.set(next, currTier + 1);
                    queue.push(next);
                }
            }
        }
    }
    const columns = new Map();
    for (const n of nodes) {
        const t = computedTiers.get(n.id) ?? 0;
        if (!columns.has(t))
            columns.set(t, []);
        columns.get(t).push(n);
    }
    const sortedTiers = [...columns.keys()].sort((a, b) => a - b);
    const colGap = 590;
    const rowGap = 86;
    for (let colIdx = 0; colIdx < sortedTiers.length; colIdx++) {
        const tierKey = sortedTiers[colIdx];
        const colNodes = columns.get(tierKey);
        let cursorY = 80;
        for (const node of colNodes) {
            const dims = getNodeDimensionsForLoD(node, lod);
            const x = node.position?.x ?? 80 + colIdx * colGap;
            const y = node.position?.y ?? cursorY;
            result.set(node.id, {
                x,
                y,
                width: dims.width,
                height: dims.height,
            });
            cursorY = y + dims.height + rowGap;
        }
    }
    return result;
}
const emittedArchitectureDeprecations = new Set();
function warnArchitectureDeprecatedOnce(fnName, replacementHint) {
    if (emittedArchitectureDeprecations.has(fnName))
        return;
    emittedArchitectureDeprecations.add(fnName);
    console.warn(`[@tti/tti-ux-diagrams] ${fnName}() is deprecated. ${replacementHint}`);
}
export function resetArchitectureDeprecationWarnings() {
    emittedArchitectureDeprecations.clear();
}
export function computeDependencyBlastRadius(rootNodeId, edges) {
    warnArchitectureDeprecatedOnce("computeDependencyBlastRadius", "Use computeLinkBlastRadius() or queryArchitectureImpact() instead.");
    const upstreamNodeIds = new Set();
    const downstreamNodeIds = new Set();
    const activeEdgeIds = new Set();
    const downQueue = [rootNodeId];
    const visitedDown = new Set([rootNodeId]);
    while (downQueue.length > 0) {
        const curr = downQueue.shift();
        for (const e of edges) {
            if (e.source === curr) {
                activeEdgeIds.add(e.id);
                if (!visitedDown.has(e.target)) {
                    visitedDown.add(e.target);
                    downstreamNodeIds.add(e.target);
                    downQueue.push(e.target);
                }
            }
        }
    }
    const upQueue = [rootNodeId];
    const visitedUp = new Set([rootNodeId]);
    while (upQueue.length > 0) {
        const curr = upQueue.shift();
        for (const e of edges) {
            if (e.target === curr) {
                activeEdgeIds.add(e.id);
                if (!visitedUp.has(e.source)) {
                    visitedUp.add(e.source);
                    upstreamNodeIds.add(e.source);
                    upQueue.push(e.source);
                }
            }
        }
    }
    const activeNodeIds = new Set([
        rootNodeId,
        ...upstreamNodeIds,
        ...downstreamNodeIds,
    ]);
    return {
        activeNodeIds,
        upstreamNodeIds,
        downstreamNodeIds,
        activeEdgeIds,
    };
}
function vecAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
function vecSub(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}
function vecMul(a, s) {
    return [a[0] * s, a[1] * s];
}
function vecPerp(a) {
    return [a[1], -a[0]];
}
function vecLen(a) {
    return Math.hypot(a[0], a[1]);
}
function vecUni(a) {
    const l = vecLen(a);
    return l > 0.0001 ? [a[0] / l, a[1] / l] : [0, 0];
}
function vecLerp(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
export function getSvgPathFromStrokeOutline(points, closed = true) {
    const len = points.length;
    if (len < 4)
        return "";
    let a = points[0];
    let b = points[1];
    const c = points[2];
    const avg = (n1, n2) => ((n1 + n2) / 2).toFixed(1);
    let result = `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${b[0].toFixed(1)},${b[1].toFixed(1)} ${avg(b[0], c[0])},${avg(b[1], c[1])} T`;
    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += `${avg(a[0], b[0])},${avg(a[1], b[1])} `;
    }
    if (closed) {
        result += "Z";
    }
    return result.trim();
}
export function getSmoothedFreehandSvgPath(rawPoints, options = {}) {
    const { size = 8, thinning = 0.45, streamline = 0.5, simulatePressure = true, radiusMapper, } = options;
    if (rawPoints.length === 0 || size <= 0)
        return "";
    if (rawPoints.length === 1) {
        const p = rawPoints[0];
        const r = size / 2;
        const circlePts = [];
        for (let i = 0; i < 12; i++) {
            const theta = (i / 12) * Math.PI * 2;
            circlePts.push([p.x + Math.cos(theta) * r, p.y + Math.sin(theta) * r]);
        }
        return getSvgPathFromStrokeOutline(circlePts, true);
    }
    const t = 0.15 + (1 - streamline) * 0.85;
    const streamlined = [
        { pt: [rawPoints[0].x, rawPoints[0].y], dist: 0, raw: rawPoints[0] },
    ];
    for (let i = 1; i < rawPoints.length; i++) {
        const prev = streamlined[streamlined.length - 1].pt;
        const currRaw = rawPoints[i];
        const isLast = i === rawPoints.length - 1;
        const nextPt = isLast
            ? [currRaw.x, currRaw.y]
            : vecLerp(prev, [currRaw.x, currRaw.y], t);
        const d = vecLen(vecSub(nextPt, prev));
        if (d < 0.5 && !isLast)
            continue;
        streamlined.push({ pt: nextPt, dist: d, raw: currRaw });
    }
    if (streamlined.length < 2) {
        const first = streamlined[0];
        streamlined.push({
            pt: [first.pt[0] + 1, first.pt[1] + 1],
            dist: 1.4,
            raw: first.raw,
        });
    }
    const leftPts = [];
    const rightPts = [];
    let prevPressure = 0.35;
    const total = streamlined.length;
    for (let i = 0; i < total; i++) {
        const curr = streamlined[i];
        const prev = streamlined[Math.max(0, i - 1)];
        const next = streamlined[Math.min(total - 1, i + 1)];
        const dir = vecUni(vecSub(next.pt, prev.pt));
        const normal = vecPerp(dir);
        let radius;
        if (radiusMapper) {
            radius = Math.max(0.2, radiusMapper(i, total, curr.raw));
        }
        else {
            let pressure = curr.raw.pressure ?? 0.5;
            if (simulatePressure) {
                const sp = Math.min(1, curr.dist / size);
                const rp = Math.min(1, 1 - sp);
                pressure = Math.min(1, prevPressure + (rp - prevPressure) * (sp * 0.275));
                prevPressure = pressure;
            }
            radius = size * (0.5 - thinning * (0.5 - pressure));
        }
        leftPts.push(vecSub(curr.pt, vecMul(normal, radius)));
        rightPts.push(vecAdd(curr.pt, vecMul(normal, radius)));
    }
    const outline = [...leftPts, ...rightPts.reverse()];
    return getSvgPathFromStrokeOutline(outline, true);
}
export function getLaserPointerSvgPath(points, nowMs, baseSize = 7, decayMs = 950, maxTailPoints = 48) {
    const active = points.filter((p) => nowMs - (p.timestamp ?? nowMs) < decayMs);
    if (active.length < 2)
        return "";
    return getSmoothedFreehandSvgPath(active, {
        size: baseSize,
        streamline: 0.42,
        radiusMapper: (idx, total, pt) => {
            const age = nowMs - (pt.timestamp ?? nowMs);
            const timeFactor = Math.max(0, 1 - age / decayMs);
            const tailDist = total - 1 - idx;
            const lengthFactor = Math.max(0, 1 - tailDist / maxTailPoints);
            const easeOut = (x) => 1 - Math.pow(1 - x, 2);
            return baseSize * Math.min(easeOut(timeFactor), easeOut(lengthFactor));
        },
    });
}
export const TUX_MAP_ELEMENT_KIND_LABELS = {
    person: "Person",
    system: "Software system",
    container: "Container",
    database: "Container: database",
    storage: "Container: storage",
    component: "Component",
    folder: "folder",
    file: "file",
    function: "function",
    class: "class",
    constant: "constant",
    module: "file",
    schema: "Data schema / index",
    symbol: "function",
    route: "HTTP route",
    external: "External system",
    resource: "Deployment node",
};
export const TUX_MAP_SCHEMA = "tux-map/1";
export const GRID_METRICS = {
    CW: 212,
    CH: 128,
    GX: 84,
    GY: 56,
    PAD: 28,
    MH: 60,
    NW: 210,
    NH: 92,
};
const WIRE_LABEL_H = 17;
const WIRE_LABEL_GAP = 4;
const WIRE_LABEL_CHARS = [16, 10, 6];
export function shortWireLabel(text, max = 16) {
    const chars = Array.from(text.trim());
    if (chars.length <= max)
        return chars.join("");
    const head = chars.slice(0, max - 1).join("");
    const cut = /\s/u.test(chars[max - 1]) ? head : head.replace(/\s+\S*$/u, "");
    const words = cut.replace(/[^\p{L}\p{N})\]]+$/u, "");
    return `${words || head.trimEnd()}…`;
}
export function gridCellToPx(at) {
    const { CW, CH, GX, GY, PAD } = GRID_METRICS;
    return {
        x: PAD + at[0] * (CW + GX),
        y: PAD + 30 + at[1] * (CH + GY),
    };
}
export function roundOrthogonalCorners(pts) {
    if (pts.length === 0)
        return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i];
        const a = pts[i - 1];
        const b = pts[i + 1];
        const r = Math.min(9, Math.hypot(p[0] - a[0], p[1] - a[1]) / 2, Math.hypot(b[0] - p[0], b[1] - p[1]) / 2);
        const u = [
            p[0] - Math.sign(p[0] - a[0]) * r,
            p[1] - Math.sign(p[1] - a[1]) * r,
        ];
        const w = [
            p[0] + Math.sign(b[0] - p[0]) * r,
            p[1] + Math.sign(b[1] - p[1]) * r,
        ];
        d += ` L${u[0]},${u[1]} Q${p[0]},${p[1]} ${w[0]},${w[1]}`;
    }
    const e = pts[pts.length - 1];
    return `${d} L${e[0]},${e[1]}`;
}
function simplifyOrthogonalPoints(raw) {
    if (raw.length <= 2)
        return raw;
    const dedup = [raw[0]];
    for (let i = 1; i < raw.length; i++) {
        const prev = dedup[dedup.length - 1];
        const cur = raw[i];
        if (Math.abs(cur[0] - prev[0]) < 0.01 && Math.abs(cur[1] - prev[1]) < 0.01)
            continue;
        dedup.push(cur);
    }
    if (dedup.length <= 2)
        return dedup;
    const out = [dedup[0]];
    for (let i = 1; i < dedup.length - 1; i++) {
        const a = out[out.length - 1];
        const b = dedup[i];
        const c = dedup[i + 1];
        const sameX = Math.abs(a[0] - b[0]) < 0.01 && Math.abs(b[0] - c[0]) < 0.01;
        const sameY = Math.abs(a[1] - b[1]) < 0.01 && Math.abs(b[1] - c[1]) < 0.01;
        if (sameX || sameY)
            continue;
        out.push(b);
    }
    out.push(dedup[dedup.length - 1]);
    return out;
}
function mergeNumericBands(spans) {
    if (spans.length === 0)
        return [];
    const sorted = spans.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const merged = [[sorted[0][0], sorted[0][1]]];
    for (let i = 1; i < sorted.length; i++) {
        const cur = sorted[i];
        const last = merged[merged.length - 1];
        if (cur[0] <= last[1] + 1) {
            if (cur[1] > last[1])
                last[1] = cur[1];
        }
        else {
            merged.push([cur[0], cur[1]]);
        }
    }
    return merged;
}
function stubPairCrossings(u, cu, v, cv) {
    if (cu === cv)
        return 2;
    let c = 0;
    if (u.startDir !== 0 && v.spanLo + 0.5 < u.startPos && u.startPos < v.spanHi - 0.5) {
        if ((u.startDir === -1 && cv < cu) || (u.startDir === 1 && cv > cu))
            c++;
    }
    if (u.endDir !== 0 && v.spanLo + 0.5 < u.endPos && u.endPos < v.spanHi - 0.5) {
        if ((u.endDir === -1 && cv < cu) || (u.endDir === 1 && cv > cu))
            c++;
    }
    if (v.startDir !== 0 && u.spanLo + 0.5 < v.startPos && v.startPos < u.spanHi - 0.5) {
        if ((v.startDir === -1 && cu < cv) || (v.startDir === 1 && cu > cv))
            c++;
    }
    if (v.endDir !== 0 && u.spanLo + 0.5 < v.endPos && v.endPos < u.spanHi - 0.5) {
        if ((v.endDir === -1 && cu < cv) || (v.endDir === 1 && cu > cv))
            c++;
    }
    return c;
}
function assignCorridorLanes(gapLo, gapHi, reqs) {
    if (reqs.length === 0)
        return;
    const gap = gapHi - gapLo;
    const sorted = reqs
        .slice()
        .sort((a, b) => a.spanLo - b.spanLo ||
        a.startDir + a.endDir - (b.startDir + b.endDir) ||
        b.spanHi - a.spanHi);
    const components = [];
    let curComp = [sorted[0]];
    let compMaxHi = sorted[0].spanHi;
    for (let i = 1; i < sorted.length; i++) {
        const r = sorted[i];
        if (r.spanLo > compMaxHi + 0.5) {
            components.push(curComp);
            curComp = [r];
            compMaxHi = r.spanHi;
        }
        else {
            curComp.push(r);
            if (r.spanHi > compMaxHi)
                compMaxHi = r.spanHi;
        }
    }
    components.push(curComp);
    for (const comp of components) {
        const m = comp.length;
        if (m === 1) {
            comp[0].apply(Number(((gapLo + gapHi) / 2).toFixed(2)));
            continue;
        }
        const colours = new Array(m).fill(-1);
        const overlaps = Array.from({ length: m }, () => []);
        for (let i = 0; i < m; i++) {
            for (let j = i + 1; j < m; j++) {
                if (Math.max(comp[i].spanLo, comp[j].spanLo) <= Math.min(comp[i].spanHi, comp[j].spanHi) + 0.5) {
                    overlaps[i].push(j);
                    overlaps[j].push(i);
                }
            }
        }
        let numColours = 0;
        for (let i = 0; i < m; i++) {
            const used = new Set();
            for (const nb of overlaps[i]) {
                if (colours[nb] >= 0)
                    used.add(colours[nb]);
            }
            let c = 0;
            while (used.has(c))
                c++;
            colours[i] = c;
            if (c + 1 > numColours)
                numColours = c + 1;
        }
        if (numColours > 1 && numColours <= 48) {
            for (let pass = 0; pass < 2; pass++) {
                for (let i = 0; i < m; i++) {
                    const used = new Set();
                    for (const nb of overlaps[i])
                        used.add(colours[nb]);
                    let bestC = colours[i];
                    let bestCost = 0;
                    for (const nb of overlaps[i]) {
                        bestCost += stubPairCrossings(comp[i], bestC, comp[nb], colours[nb]);
                    }
                    if (bestCost === 0)
                        continue;
                    for (let c = 0; c < numColours; c++) {
                        if (c === bestC || used.has(c))
                            continue;
                        let cost = 0;
                        for (const nb of overlaps[i]) {
                            cost += stubPairCrossings(comp[i], c, comp[nb], colours[nb]);
                        }
                        if (cost < bestCost) {
                            bestCost = cost;
                            bestC = c;
                        }
                    }
                    colours[i] = bestC;
                }
            }
            for (let c1 = 0; c1 < numColours; c1++) {
                for (let c2 = c1 + 1; c2 < numColours; c2++) {
                    let before = 0;
                    let after = 0;
                    for (let i = 0; i < m; i++) {
                        const ci = colours[i];
                        const nci = ci === c1 ? c2 : ci === c2 ? c1 : ci;
                        for (const j of overlaps[i]) {
                            if (j <= i)
                                continue;
                            const cj = colours[j];
                            const ncj = cj === c1 ? c2 : cj === c2 ? c1 : cj;
                            if (ci !== c1 && ci !== c2 && cj !== c1 && cj !== c2)
                                continue;
                            before += stubPairCrossings(comp[i], ci, comp[j], cj);
                            after += stubPairCrossings(comp[i], nci, comp[j], ncj);
                        }
                    }
                    if (after < before) {
                        for (let i = 0; i < m; i++) {
                            if (colours[i] === c1)
                                colours[i] = c2;
                            else if (colours[i] === c2)
                                colours[i] = c1;
                        }
                    }
                }
            }
        }
        const usable = Math.max(0, gap - 12);
        const step = numColours <= 1 ? 0 : Math.min(11, usable / (numColours - 1));
        const start = (gapLo + gapHi) / 2 - (step * (numColours - 1)) / 2;
        const minAllowed = gap >= 12 ? gapLo + 6 : gapLo;
        const maxAllowed = gap >= 12 ? gapHi - 6 : gapHi;
        for (let i = 0; i < m; i++) {
            const rawCoord = start + colours[i] * step;
            const clamped = Math.max(minAllowed, Math.min(maxAllowed, rawCoord));
            comp[i].apply(Number(clamped.toFixed(2)));
        }
    }
}
export function routeGridWires(rels, rects, els) {
    const { GX, GY } = GRID_METRICS;
    const elById = new Map();
    for (const e of els)
        elById.set(e.id, e);
    const isOutsideCard = (id, r) => {
        const el = elById.get(id);
        return Boolean(r.mini || r.side || el?.mini || el?.side);
    };
    const outsideSideOf = (id, r) => r.side || elById.get(id)?.side;
    const CELL_W = 256;
    const CELL_H = 192;
    const cardBucket = new Map();
    const placedBucket = new Map();
    const addBoxToBucket = (bucket, idx, x, y, w, h) => {
        const gx0 = Math.floor(x / CELL_W);
        const gx1 = Math.floor((x + w) / CELL_W);
        const gy0 = Math.floor(y / CELL_H);
        const gy1 = Math.floor((y + h) / CELL_H);
        for (let gx = gx0; gx <= gx1; gx++) {
            for (let gy = gy0; gy <= gy1; gy++) {
                const key = `${gx},${gy}`;
                let arr = bucket.get(key);
                if (!arr) {
                    arr = [];
                    bucket.set(key, arr);
                }
                arr.push(idx);
            }
        }
    };
    const placed = [];
    const pushPlacedBox = (b) => {
        const idx = placed.length;
        placed.push(b);
        addBoxToBucket(placedBucket, idx, b.x, b.y, b.w, b.h);
    };
    const cardEntries = [];
    for (const k of Object.keys(rects)) {
        const r = rects[k];
        if (!r.bound) {
            const ci = cardEntries.length;
            cardEntries.push([k, r]);
            addBoxToBucket(cardBucket, ci, r.x, r.y, r.w, r.h);
            pushPlacedBox({ x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 });
        }
    }
    const cardCount = placed.length;
    const colBands = mergeNumericBands(cardEntries.map(([, r]) => [r.x, r.x + r.w]));
    const vGaps = [];
    if (colBands.length > 0) {
        const leftOuterLo = Math.max(2, colBands[0][0] - GX);
        if (colBands[0][0] - leftOuterLo >= 14) {
            vGaps.push({ key: "v_outer_l", lo: leftOuterLo, hi: colBands[0][0] });
        }
        for (let i = 0; i < colBands.length - 1; i++) {
            if (colBands[i + 1][0] - colBands[i][1] >= 12) {
                vGaps.push({ key: `v_${i}`, lo: colBands[i][1], hi: colBands[i + 1][0] });
            }
        }
        const lastCol = colBands[colBands.length - 1];
        vGaps.push({ key: "v_outer_r", lo: lastCol[1], hi: lastCol[1] + GX });
    }
    const innerCardEntries = cardEntries.filter(([id, r]) => !isOutsideCard(id, r));
    const rowSource = innerCardEntries.length > 0 ? innerCardEntries : cardEntries;
    const rowBands = mergeNumericBands(rowSource.map(([, r]) => [r.y, r.y + r.h]));
    const hGaps = [];
    if (rowBands.length > 0) {
        const topLo = Math.max(2, rowBands[0][0] - GY);
        if (rowBands[0][0] - topLo >= 14) {
            hGaps.push({ key: "h_top", lo: topLo, hi: rowBands[0][0] });
        }
        for (let i = 0; i < rowBands.length - 1; i++) {
            if (rowBands[i + 1][0] - rowBands[i][1] >= 12) {
                hGaps.push({ key: `h_${i}`, lo: rowBands[i][1], hi: rowBands[i + 1][0] });
            }
        }
        const lastRow = rowBands[rowBands.length - 1];
        hGaps.push({ key: "h_bot", lo: lastRow[1], hi: lastRow[1] + GY });
    }
    const vGapRightOf = (r) => {
        const edge = r.x + r.w;
        let best = null;
        for (const g of vGaps) {
            if (g.lo >= edge - 1 && (!best || g.lo < best.lo))
                best = g;
        }
        return best ?? { key: `vr_${Math.round(edge)}`, lo: edge, hi: edge + GX };
    };
    const vGapLeftOf = (r) => {
        const edge = r.x;
        let best = null;
        for (const g of vGaps) {
            if (g.hi <= edge + 1 && (!best || g.hi > best.hi))
                best = g;
        }
        return best ?? { key: `vl_${Math.round(edge)}`, lo: Math.max(2, edge - GX), hi: edge };
    };
    const hGapBelow = (r) => {
        const edge = r.y + r.h;
        let best = null;
        for (const g of hGaps) {
            if (g.lo >= edge - 1 && (!best || g.lo < best.lo))
                best = g;
        }
        return best ?? { key: `hb_${Math.round(edge)}`, lo: edge, hi: edge + GY };
    };
    const hGapAbove = (r) => {
        const edge = r.y;
        let best = null;
        for (const g of hGaps) {
            if (g.hi <= edge + 1 && (!best || g.hi > best.hi))
                best = g;
        }
        return best ?? { key: `ht_${Math.round(edge)}`, lo: Math.max(2, edge - GY), hi: edge };
    };
    function segHitsRect(x0, y0, x1, y1, r) {
        const minX = Math.min(x0, x1);
        const maxX = Math.max(x0, x1);
        const minY = Math.min(y0, y1);
        const maxY = Math.max(y0, y1);
        return maxX > r.x + 0.5 && minX < r.x + r.w - 0.5 && maxY > r.y + 0.5 && minY < r.y + r.h - 0.5;
    }
    function stubMovesOutward(port, next, sideChar) {
        if (sideChar === "r")
            return next[0] >= port[0] - 0.01 && Math.abs(next[1] - port[1]) < 0.01;
        if (sideChar === "l")
            return next[0] <= port[0] + 0.01 && Math.abs(next[1] - port[1]) < 0.01;
        if (sideChar === "b")
            return next[1] >= port[1] - 0.01 && Math.abs(next[0] - port[0]) < 0.01;
        return next[1] <= port[1] + 0.01 && Math.abs(next[0] - port[0]) < 0.01;
    }
    function polyIsClean(pts, a, s0, b, s1) {
        if (pts.length < 2)
            return false;
        if (!a.bound && !stubMovesOutward(pts[0], pts[1], s0))
            return false;
        if (!b.bound && !stubMovesOutward(pts[pts.length - 1], pts[pts.length - 2], s1))
            return false;
        const lastSeg = pts.length - 2;
        for (let i = 0; i <= lastSeg; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            const gx0 = Math.floor(Math.min(p0[0], p1[0]) / CELL_W);
            const gx1 = Math.floor(Math.max(p0[0], p1[0]) / CELL_W);
            const gy0 = Math.floor(Math.min(p0[1], p1[1]) / CELL_H);
            const gy1 = Math.floor(Math.max(p0[1], p1[1]) / CELL_H);
            for (let gx = gx0; gx <= gx1; gx++) {
                for (let gy = gy0; gy <= gy1; gy++) {
                    const indices = cardBucket.get(`${gx},${gy}`);
                    if (!indices)
                        continue;
                    for (let ii = 0; ii < indices.length; ii++) {
                        const r = cardEntries[indices[ii]][1];
                        if (i === 0 && r === a)
                            continue;
                        if (i === lastSeg && r === b)
                            continue;
                        if (segHitsRect(p0[0], p0[1], p1[0], p1[1], r))
                            return false;
                    }
                }
            }
        }
        return true;
    }
    const paths = [];
    const ports = {};
    for (const rel of rels) {
        const a = hasOwn(rects, rel.from) ? rects[rel.from] : undefined;
        const b = hasOwn(rects, rel.to) ? rects[rel.to] : undefined;
        if (a && b) {
            paths.push({ rel, a, b, s: ["r", "l"], pts: [] });
        }
    }
    const maxCardRight = colBands.length > 0 ? colBands[colBands.length - 1][1] : 680;
    function side(fromId, a, toId, b) {
        if (a.bound)
            return b.x > a.x + a.w / 2 ? ["r", "l"] : ["l", "r"];
        if (b.bound)
            return a.x < b.x ? ["r", "l"] : ["l", "r"];
        if (isOutsideCard(fromId, a) || isOutsideCard(toId, b)) {
            const acx = a.x + a.w / 2;
            const bcx = b.x + b.w / 2;
            if (Math.abs(bcx - acx) > 1) {
                return bcx > acx ? ["r", "l"] : ["l", "r"];
            }
            const aSide = outsideSideOf(fromId, a) ?? outsideSideOf(toId, b);
            if (aSide === "out" || acx > maxCardRight / 2)
                return ["l", "l"];
            return ["r", "r"];
        }
        const ac = a.c ?? 0;
        const ar = a.r ?? 0;
        const bc = b.c ?? 0;
        const br = b.r ?? 0;
        if (ac === bc) {
            if (Math.abs(ar - br) > 1) {
                const hasRightCol = colBands.length > 1 && a.x + a.w < colBands[colBands.length - 1][0] - 1;
                return hasRightCol || colBands.length <= 1 ? ["r", "r"] : ["l", "l"];
            }
            return br > ar ? ["b", "t"] : ["t", "b"];
        }
        if (Math.abs(br - ar) >= 2 && Math.abs(bc - ac) <= 1) {
            return br > ar ? ["b", "t"] : ["t", "b"];
        }
        return bc > ac ? ["r", "l"] : ["l", "r"];
    }
    paths.forEach((p, idx) => {
        p.s = side(p.rel.from, p.a, p.rel.to, p.b);
        const entries = [
            [p.rel.from, p.s[0], p.b, "fa"],
            [p.rel.to, p.s[1], p.a, "fb"],
        ];
        for (const x of entries) {
            const k = `${x[0]}\u0000${x[1]}`;
            if (!ports[k])
                ports[k] = [];
            ports[k].push({
                p,
                key: x[3],
                o: x[1] === "l" || x[1] === "r" ? x[2].y + x[2].h / 2 : x[2].x + x[2].w / 2,
                tie: x[1] === "l" || x[1] === "r" ? x[2].x + idx * 0.001 : x[2].y + idx * 0.001,
            });
        }
    });
    for (const k of Object.keys(ports)) {
        const list = ports[k].sort((u, v) => u.o - v.o || u.tie - v.tie);
        const total = list.length;
        list.forEach((x, j) => {
            x.p[x.key] = total === 1 ? 0.5 : 0.16 + (j / (total - 1)) * 0.68;
        });
    }
    function at(r, s, f = 0.5) {
        if (s === "l")
            return [r.x, Number((r.y + r.h * f).toFixed(2))];
        if (s === "r")
            return [r.x + r.w, Number((r.y + r.h * f).toFixed(2))];
        if (s === "t")
            return [Number((r.x + r.w * f).toFixed(2)), r.y];
        return [Number((r.x + r.w * f).toFixed(2)), r.y + r.h];
    }
    const gapRegistry = new Map();
    const registerLane = (band, req) => {
        let entry = gapRegistry.get(band.key);
        if (!entry) {
            entry = { band, reqs: [] };
            gapRegistry.set(band.key, entry);
        }
        entry.reqs.push(req);
    };
    for (const p of paths) {
        const { a, b, s } = p;
        if (a.bound || b.bound) {
            const n = a.bound ? b : a;
            const y = Number((n.y + n.h * ((a.bound ? p.fb : p.fa) ?? 0.5)).toFixed(2));
            const P = a.bound ? [s[0] === "r" ? a.x + a.w : a.x, y] : at(a, s[0], p.fa);
            const Q = b.bound ? [s[1] === "l" ? b.x : b.x + b.w, y] : at(b, s[1], p.fb);
            p.pts = [P, Q];
            continue;
        }
        const P = at(a, s[0], p.fa);
        const Q = at(b, s[1], p.fb);
        if ((s[0] === "r" && s[1] === "r") || (s[0] === "l" && s[1] === "l")) {
            const vg = s[0] === "r" ? vGapRightOf(a.x + a.w >= b.x + b.w ? a : b) : vGapLeftOf(a.x <= b.x ? a : b);
            const midX = (vg.lo + vg.hi) / 2;
            const pts = [P, [midX, P[1]], [midX, Q[1]], Q];
            p.pts = pts;
            const stubDir = s[0] === "r" ? -1 : 1;
            registerLane(vg, {
                spanLo: Math.min(P[1], Q[1]),
                spanHi: Math.max(P[1], Q[1]),
                startPos: P[1],
                endPos: Q[1],
                startDir: stubDir,
                endDir: stubDir,
                apply: (cx) => {
                    pts[1][0] = cx;
                    pts[2][0] = cx;
                },
            });
            continue;
        }
        if (s[0] === "b" || s[0] === "t") {
            const down = s[0] === "b";
            const hgPrimary = down ? hGapBelow(a) : hGapAbove(a);
            const midY = (hgPrimary.lo + hgPrimary.hi) / 2;
            const simplePts = [P, [P[0], midY], [Q[0], midY], Q];
            if (polyIsClean(simplePts, a, s[0], b, s[1])) {
                p.pts = simplePts;
                registerLane(hgPrimary, {
                    spanLo: Math.min(P[0], Q[0]),
                    spanHi: Math.max(P[0], Q[0]),
                    startPos: P[0],
                    endPos: Q[0],
                    startDir: down ? -1 : 1,
                    endDir: down ? 1 : -1,
                    apply: (cy) => {
                        simplePts[1][1] = cy;
                        simplePts[2][1] = cy;
                    },
                });
            }
            else {
                const hgA = down ? hGapBelow(a) : hGapAbove(a);
                const hgB = down ? hGapAbove(b) : hGapBelow(b);
                const vgCandidates = [
                    b.x < a.x ? vGapLeftOf(a) : vGapRightOf(a),
                    b.x < a.x ? vGapRightOf(b) : vGapLeftOf(b),
                    ...vGaps,
                ];
                let chosenVg = vgCandidates[0];
                const y1Init = (hgA.lo + hgA.hi) / 2;
                const y2Init = (hgB.lo + hgB.hi) / 2;
                for (const vg of vgCandidates) {
                    const xInit = (vg.lo + vg.hi) / 2;
                    const testPts = [
                        P,
                        [P[0], y1Init],
                        [xInit, y1Init],
                        [xInit, y2Init],
                        [Q[0], y2Init],
                        Q,
                    ];
                    if (polyIsClean(testPts, a, s[0], b, s[1])) {
                        chosenVg = vg;
                        break;
                    }
                }
                const xInit = (chosenVg.lo + chosenVg.hi) / 2;
                const detourPts = [
                    P,
                    [P[0], y1Init],
                    [xInit, y1Init],
                    [xInit, y2Init],
                    [Q[0], y2Init],
                    Q,
                ];
                p.pts = detourPts;
                registerLane(hgA, {
                    spanLo: Math.min(P[0], xInit),
                    spanHi: Math.max(P[0], xInit),
                    startPos: P[0],
                    endPos: xInit,
                    startDir: down ? -1 : 1,
                    endDir: y2Init >= y1Init ? 1 : -1,
                    apply: (cy) => {
                        detourPts[1][1] = cy;
                        detourPts[2][1] = cy;
                    },
                });
                registerLane(chosenVg, {
                    spanLo: Math.min(y1Init, y2Init),
                    spanHi: Math.max(y1Init, y2Init),
                    startPos: y1Init,
                    endPos: y2Init,
                    startDir: P[0] <= xInit ? -1 : 1,
                    endDir: Q[0] <= xInit ? -1 : 1,
                    apply: (cx) => {
                        detourPts[2][0] = cx;
                        detourPts[3][0] = cx;
                    },
                });
                registerLane(hgB, {
                    spanLo: Math.min(xInit, Q[0]),
                    spanHi: Math.max(xInit, Q[0]),
                    startPos: xInit,
                    endPos: Q[0],
                    startDir: y2Init >= y1Init ? -1 : 1,
                    endDir: down ? 1 : -1,
                    apply: (cy) => {
                        detourPts[3][1] = cy;
                        detourPts[4][1] = cy;
                    },
                });
            }
            continue;
        }
        const dir = s[0] === "r" ? 1 : -1;
        const vgStart = dir > 0 ? vGapRightOf(a) : vGapLeftOf(a);
        const vgEnd = dir > 0 ? vGapLeftOf(b) : vGapRightOf(b);
        const betweenVGaps = vGaps.filter((g) => dir > 0 ? g.lo >= a.x + a.w - 1 && g.hi <= b.x + 1 : g.hi <= a.x + 1 && g.lo >= b.x + b.w - 1);
        let singleVGap = null;
        if (vgStart.key === vgEnd.key) {
            const gx = (vgStart.lo + vgStart.hi) / 2;
            if (polyIsClean([P, [gx, P[1]], [gx, Q[1]], Q], a, s[0], b, s[1])) {
                singleVGap = vgStart;
            }
        }
        if (!singleVGap && betweenVGaps.length > 0) {
            const targetMidX = (P[0] + Q[0]) / 2;
            const orderedVGaps = betweenVGaps
                .slice()
                .sort((u, v) => Math.abs((u.lo + u.hi) / 2 - targetMidX) - Math.abs((v.lo + v.hi) / 2 - targetMidX));
            for (const vg of orderedVGaps) {
                const loX = vg.hi - vg.lo >= 12 ? vg.lo + 6 : (vg.lo + vg.hi) / 2;
                const hiX = vg.hi - vg.lo >= 12 ? vg.hi - 6 : (vg.lo + vg.hi) / 2;
                if (polyIsClean([P, [loX, P[1]], [loX, Q[1]], Q], a, s[0], b, s[1]) &&
                    polyIsClean([P, [hiX, P[1]], [hiX, Q[1]], Q], a, s[0], b, s[1])) {
                    singleVGap = vg;
                    break;
                }
            }
        }
        if (singleVGap) {
            const gx = (singleVGap.lo + singleVGap.hi) / 2;
            const zPts = [P, [gx, P[1]], [gx, Q[1]], Q];
            p.pts = zPts;
            registerLane(singleVGap, {
                spanLo: Math.min(P[1], Q[1]),
                spanHi: Math.max(P[1], Q[1]),
                startPos: P[1],
                endPos: Q[1],
                startDir: dir > 0 ? -1 : 1,
                endDir: dir > 0 ? 1 : -1,
                apply: (cx) => {
                    zPts[1][0] = cx;
                    zPts[2][0] = cx;
                },
            });
            continue;
        }
        const targetMidY = (P[1] + Q[1]) / 2;
        const orderedHGaps = hGaps
            .slice()
            .sort((u, v) => {
            const uMid = (u.lo + u.hi) / 2;
            const vMid = (v.lo + v.hi) / 2;
            const minPQ = Math.min(P[1], Q[1]);
            const maxPQ = Math.max(P[1], Q[1]);
            const uBetween = uMid >= minPQ - 8 && uMid <= maxPQ + 8 ? 0 : 1;
            const vBetween = vMid >= minPQ - 8 && vMid <= maxPQ + 8 ? 0 : 1;
            return uBetween - vBetween || Math.abs(uMid - targetMidY) - Math.abs(vMid - targetMidY);
        });
        const x1Init = (vgStart.lo + vgStart.hi) / 2;
        const x2Init = (vgEnd.lo + vgEnd.hi) / 2;
        let chosenHGap = orderedHGaps[0] ?? hGapBelow(a);
        for (const hg of orderedHGaps) {
            const loY = hg.hi - hg.lo >= 12 ? hg.lo + 6 : (hg.lo + hg.hi) / 2;
            const hiY = hg.hi - hg.lo >= 12 ? hg.hi - 6 : (hg.lo + hg.hi) / 2;
            if (polyIsClean([P, [x1Init, P[1]], [x1Init, loY], [x2Init, loY], [x2Init, Q[1]], Q], a, s[0], b, s[1]) &&
                polyIsClean([P, [x1Init, P[1]], [x1Init, hiY], [x2Init, hiY], [x2Init, Q[1]], Q], a, s[0], b, s[1])) {
                chosenHGap = hg;
                break;
            }
        }
        const ygInit = (chosenHGap.lo + chosenHGap.hi) / 2;
        const doglegPts = [
            P,
            [x1Init, P[1]],
            [x1Init, ygInit],
            [x2Init, ygInit],
            [x2Init, Q[1]],
            Q,
        ];
        p.pts = doglegPts;
        registerLane(vgStart, {
            spanLo: Math.min(P[1], ygInit),
            spanHi: Math.max(P[1], ygInit),
            startPos: P[1],
            endPos: ygInit,
            startDir: dir > 0 ? -1 : 1,
            endDir: x2Init >= x1Init ? 1 : -1,
            apply: (cx) => {
                doglegPts[1][0] = cx;
                doglegPts[2][0] = cx;
            },
        });
        registerLane(chosenHGap, {
            spanLo: Math.min(x1Init, x2Init),
            spanHi: Math.max(x1Init, x2Init),
            startPos: x1Init,
            endPos: x2Init,
            startDir: P[1] <= ygInit ? -1 : 1,
            endDir: Q[1] <= ygInit ? -1 : 1,
            apply: (cy) => {
                doglegPts[2][1] = cy;
                doglegPts[3][1] = cy;
            },
        });
        registerLane(vgEnd, {
            spanLo: Math.min(ygInit, Q[1]),
            spanHi: Math.max(ygInit, Q[1]),
            startPos: ygInit,
            endPos: Q[1],
            startDir: x2Init >= x1Init ? -1 : 1,
            endDir: dir > 0 ? 1 : -1,
            apply: (cx) => {
                doglegPts[3][0] = cx;
                doglegPts[4][0] = cx;
            },
        });
    }
    for (const { band, reqs } of gapRegistry.values()) {
        assignCorridorLanes(band.lo, band.hi, reqs);
    }
    const wires = [];
    const portClash = (cand) => {
        let clash = 0;
        const gx0 = Math.floor(cand.x / CELL_W);
        const gx1 = Math.floor((cand.x + cand.w) / CELL_W);
        const gy0 = Math.floor(cand.y / CELL_H);
        const gy1 = Math.floor((cand.y + cand.h) / CELL_H);
        for (let gx = gx0; gx <= gx1; gx++) {
            for (let gy = gy0; gy <= gy1; gy++) {
                const hits = placedBucket.get(`${gx},${gy}`);
                if (!hits)
                    continue;
                for (let hi = 0; hi < hits.length; hi++) {
                    const qi = hits[hi];
                    const q = placed[qi];
                    if (cand.x < q.x + q.w && cand.x + cand.w > q.x && cand.y < q.y + q.h && cand.y + cand.h > q.y) {
                        if (qi < cardCount)
                            return 2;
                        clash = 1;
                    }
                }
            }
        }
        return clash;
    };
    const jobs = [];
    paths.forEach((p, idx) => {
        const pts = simplifyOrthogonalPoints(p.pts);
        const isViolating = Boolean(p.rel.violations?.length);
        const planned = p.rel.status === "planned";
        wires.push({
            id: `w-${idx}-${p.rel.from}-${p.rel.to}`,
            from: p.rel.from,
            to: p.rel.to,
            d: roundOrthogonalCorners(pts),
            planned,
            ...(isViolating ? { violating: true } : {}),
        });
        const text = p.rel.label || (planned ? "Planned" : "");
        if (!text || pts.length < 2)
            return;
        const tech = p.rel.tech || "";
        const full = tech ? `${text} [${tech}]` : text;
        const ends = [];
        if (!p.a.bound)
            ends.push({ end: "from", side: p.s[0], at: pts[0] });
        if (!p.b.bound)
            ends.push({ end: "to", side: p.s[1], at: pts[pts.length - 1] });
        jobs.push({ idx, order: jobs.length, rank: isViolating ? 0 : planned ? 2 : 1, rel: p.rel, text, tech: false, full, ends, pts });
        if (tech && ends.length === 2) {
            jobs.push({ idx, order: jobs.length, rank: isViolating ? 0 : 3, rel: p.rel, text: tech, tech: true, full, ends: [ends[1]], pts });
        }
    });
    const byRank = jobs.slice().sort((u, v) => u.rank - v.rank || u.order - v.order);
    for (const job of byRank) {
        const isViolating = Boolean(job.rel.violations?.length);
        let box = null;
        let hidden = null;
        let short = "";
        let end;
        search: for (const e of job.ends) {
            let last = "";
            for (const chars of WIRE_LABEL_CHARS) {
                const s = shortWireLabel(job.text, chars);
                if (s === last)
                    continue;
                last = s;
                const w = Math.round(job.tech ? (s.length + 2) * 5.5 + 18 : (s.length + (isViolating ? 2 : 0)) * 6.1 + 18);
                const across = e.side === "l" || e.side === "r";
                for (const beside of [0, 1, -1, 2, -2]) {
                    const off = Math.abs(beside) > 1 ? WIRE_LABEL_H / 2 : 1;
                    const cand = across
                        ? {
                            x: e.side === "r" ? e.at[0] + WIRE_LABEL_GAP : e.at[0] - WIRE_LABEL_GAP - w,
                            y: e.at[1] + (beside > 0 ? off : beside < 0 ? -off - WIRE_LABEL_H : -WIRE_LABEL_H / 2),
                            w,
                            h: WIRE_LABEL_H,
                        }
                        : {
                            x: e.at[0] + (beside > 0 ? off + 2 : beside < 0 ? -off - 2 - w : -w / 2),
                            y: e.side === "b" ? e.at[1] + WIRE_LABEL_GAP : e.at[1] - WIRE_LABEL_GAP - WIRE_LABEL_H,
                            w,
                            h: WIRE_LABEL_H,
                        };
                    if (!Number.isFinite(cand.x + cand.y))
                        break;
                    cand.x = Number(cand.x.toFixed(2));
                    cand.y = Number(cand.y.toFixed(2));
                    const clash = portClash(cand);
                    if (clash === 0) {
                        box = cand;
                        short = s;
                        end = e;
                        break search;
                    }
                    if (clash === 1 && !hidden)
                        hidden = { box: cand, short: s, end: e };
                }
            }
        }
        const forced = !box;
        if (box)
            pushPlacedBox(box);
        else if (hidden) {
            box = hidden.box;
            short = hidden.short;
            end = hidden.end;
        }
        else if (!job.tech) {
            let best = 0;
            let bestLen = -1;
            for (let i = 0; i < job.pts.length - 1; i++) {
                const len = Math.abs(job.pts[i + 1][0] - job.pts[i][0]) + Math.abs(job.pts[i + 1][1] - job.pts[i][1]);
                if (len > bestLen) {
                    bestLen = len;
                    best = i;
                }
            }
            short = shortWireLabel(job.text, WIRE_LABEL_CHARS[WIRE_LABEL_CHARS.length - 1]);
            const w = Math.round(short.length * 6.1 + 18);
            box = {
                x: (job.pts[best][0] + job.pts[best + 1][0]) / 2 - w / 2,
                y: (job.pts[best][1] + job.pts[best + 1][1]) / 2 - WIRE_LABEL_H / 2,
                w,
                h: WIRE_LABEL_H,
            };
        }
        if (!box)
            continue;
        job.out = {
            id: `lbl-${job.idx}${job.tech ? "t" : ""}-${job.rel.from}-${job.rel.to}`,
            from: job.rel.from,
            to: job.rel.to,
            x: Number(box.x.toFixed(2)),
            y: Number(box.y.toFixed(2)),
            w: box.w,
            h: box.h,
            t1: job.tech ? "" : short,
            t2: job.tech ? short : "",
            forced,
            full: job.full,
            ...(end ? { end: end.end, side: end.side } : {}),
            ...(job.rel.status === "planned" ? { planned: true } : {}),
            ...(isViolating ? { violating: true } : {}),
        };
    }
    const labels = [];
    for (const job of jobs)
        if (job.out)
            labels.push(job.out);
    return { wires, labels };
}
export function routeDeploymentWires(links, rects, selectedId = "*") {
    if (!selectedId)
        return [];
    const routeAll = selectedId === "*";
    const wires = [];
    const cardRects = Object.entries(rects).filter(([, r]) => !r.bound);
    function hitsAnyCard(x0, y0, x1, y1, ignoreIdA, ignoreIdB) {
        const minX = Math.min(x0, x1);
        const maxX = Math.max(x0, x1);
        const minY = Math.min(y0, y1);
        const maxY = Math.max(y0, y1);
        for (const [id, r] of cardRects) {
            if (id === ignoreIdA || id === ignoreIdB)
                continue;
            if (maxX > r.x + 1 && minX < r.x + r.w - 1 && maxY > r.y + 1 && minY < r.y + r.h - 1) {
                return true;
            }
        }
        return false;
    }
    function polyHits(pts, fromId, toId) {
        const lastSeg = pts.length - 2;
        for (let i = 0; i <= lastSeg; i++) {
            const igA = i === 0 ? fromId : null;
            const igB = i === lastSeg ? toId : null;
            if (hitsAnyCard(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], igA, igB)) {
                return true;
            }
        }
        return false;
    }
    const xBands = mergeNumericBands(cardRects.map(([, r]) => [r.x, r.x + r.w]));
    const yBands = mergeNumericBands(cardRects.map(([, r]) => [r.y, r.y + r.h]));
    const xCorridors = [];
    if (xBands.length > 0) {
        xCorridors.push(Math.max(6, xBands[0][0] - 20));
        for (let i = 0; i < xBands.length - 1; i++) {
            if (xBands[i + 1][0] - xBands[i][1] >= 10) {
                xCorridors.push(Math.round((xBands[i][1] + xBands[i + 1][0]) / 2));
            }
        }
        xCorridors.push(xBands[xBands.length - 1][1] + 20);
    }
    const yCorridors = [];
    if (yBands.length > 0) {
        yCorridors.push(Math.max(6, yBands[0][0] - 18));
        for (let i = 0; i < yBands.length - 1; i++) {
            if (yBands[i + 1][0] - yBands[i][1] >= 10) {
                yCorridors.push(Math.round((yBands[i][1] + yBands[i + 1][0]) / 2));
            }
        }
        yCorridors.push(yBands[yBands.length - 1][1] + 18);
    }
    for (const [, r] of cardRects) {
        xCorridors.push(r.x - 8, r.x + r.w + 8);
        yCorridors.push(r.y - 7, r.y + r.h + 7);
    }
    const activeLinks = links.filter((r) => hasOwn(rects, r.from) &&
        hasOwn(rects, r.to) &&
        rects[r.from] &&
        rects[r.to] &&
        (routeAll || r.from === selectedId || r.to === selectedId));
    const portsBySide = new Map();
    const portFraction = new Map();
    activeLinks.forEach((r, idx) => {
        const a = rects[r.from];
        const b = rects[r.to];
        const right = b.x >= a.x + a.w;
        const left = b.x + b.w <= a.x;
        const down = b.y > a.y;
        const fromSide = right ? "r" : left ? "l" : down ? "b" : "t";
        const toSide = right ? "l" : left ? "r" : down ? "t" : "b";
        const kFrom = `${r.from}:${fromSide}`;
        const kTo = `${r.to}:${toSide}`;
        if (!portsBySide.has(kFrom))
            portsBySide.set(kFrom, []);
        if (!portsBySide.has(kTo))
            portsBySide.set(kTo, []);
        portsBySide.get(kFrom).push({
            linkIdx: idx,
            end: "from",
            otherCoord: fromSide === "l" || fromSide === "r" ? b.y + b.h / 2 : b.x + b.w / 2,
        });
        portsBySide.get(kTo).push({
            linkIdx: idx,
            end: "to",
            otherCoord: toSide === "l" || toSide === "r" ? a.y + a.h / 2 : a.x + a.w / 2,
        });
    });
    for (const [, list] of portsBySide.entries()) {
        list.sort((u, v) => u.otherCoord - v.otherCoord);
        const total = list.length;
        list.forEach((item, j) => {
            const frac = total === 1 ? 0.5 : 0.18 + (j / (total - 1)) * 0.64;
            portFraction.set(`${item.linkIdx}:${item.end}`, frac);
        });
    }
    activeLinks.forEach((r, idx) => {
        const a = rects[r.from];
        const b = rects[r.to];
        const right = b.x >= a.x + a.w;
        const left = b.x + b.w <= a.x;
        const fa = portFraction.get(`${idx}:from`) ?? 0.5;
        const fb = portFraction.get(`${idx}:to`) ?? 0.5;
        const laneShift = ((idx % 5) - 2) * 3;
        let chosenPts = null;
        if (right || left) {
            const P = [right ? a.x + a.w : a.x, Math.round(a.y + a.h * fa)];
            const Q = [right ? b.x : b.x + b.w, Math.round(b.y + b.h * fb)];
            const midX = Math.round((P[0] + Q[0]) / 2 + laneShift);
            const xCands = [
                midX,
                ...xCorridors
                    .filter((vx) => (right ? vx > P[0] + 4 && vx < Q[0] - 4 : vx < P[0] - 4 && vx > Q[0] + 4))
                    .map((vx) => vx + laneShift)
                    .sort((u, v) => Math.abs(u - midX) - Math.abs(v - midX)),
            ];
            for (const vx of xCands) {
                const cand = [P, [vx, P[1]], [vx, Q[1]], Q];
                if (!polyHits(cand, r.from, r.to)) {
                    chosenPts = cand;
                    break;
                }
            }
            if (!chosenPts) {
                const vx1 = right ? a.x + a.w + 8 + ((idx % 3) - 1) * 2 : a.x - 8 + ((idx % 3) - 1) * 2;
                const vx2 = right ? b.x - 8 + ((idx % 3) - 1) * 2 : b.x + b.w + 8 + ((idx % 3) - 1) * 2;
                const midY = (P[1] + Q[1]) / 2;
                const sortedY = yCorridors
                    .slice()
                    .sort((u, v) => Math.abs(u - midY) - Math.abs(v - midY));
                for (const baseY of sortedY) {
                    const hy = baseY + ((idx % 3) - 1) * 2;
                    const cand = [P, [vx1, P[1]], [vx1, hy], [vx2, hy], [vx2, Q[1]], Q];
                    if (!polyHits(cand, r.from, r.to)) {
                        chosenPts = cand;
                        break;
                    }
                }
                if (!chosenPts) {
                    const goBelow = b.y >= a.y;
                    const Pbot = [Math.round(a.x + a.w * fa), goBelow ? a.y + a.h : a.y];
                    for (const baseY of sortedY) {
                        const hy = baseY + ((idx % 3) - 1) * 2;
                        if (goBelow ? hy <= Pbot[1] + 2 : hy >= Pbot[1] - 2)
                            continue;
                        const cand = [Pbot, [Pbot[0], hy], [vx2, hy], [vx2, Q[1]], Q];
                        if (!polyHits(cand, r.from, r.to)) {
                            chosenPts = cand;
                            break;
                        }
                    }
                    if (!chosenPts) {
                        const yg = (goBelow ? a.y + a.h + 9 : a.y - 9) + ((idx % 3) - 1) * 3;
                        const gx = right ? Math.max(a.x + a.w + 10, b.x - 18) : Math.min(a.x - 10, b.x + b.w + 18);
                        chosenPts = [Pbot, [Pbot[0], yg], [gx, yg], [gx, Q[1]], Q];
                    }
                }
            }
        }
        else {
            const down = b.y > a.y;
            const P2 = [Math.round(a.x + a.w * fa), down ? a.y + a.h : a.y];
            const Q2 = [Math.round(b.x + b.w * fb), down ? b.y : b.y + b.h];
            const midY = Math.round((P2[1] + Q2[1]) / 2 + laneShift);
            const directV = [P2, [P2[0], midY], [Q2[0], midY], Q2];
            if (!polyHits(directV, r.from, r.to)) {
                chosenPts = directV;
            }
            else {
                const targetX = a.x + a.w / 2;
                const sortedX = xCorridors
                    .slice()
                    .sort((u, v) => Math.abs(u - targetX) - Math.abs(v - targetX));
                const hy1 = down ? a.y + a.h + 7 : a.y - 7;
                const hy2 = down ? b.y - 7 : b.y + b.h + 7;
                for (const baseX of sortedX) {
                    const vx = baseX + ((idx % 3) - 1) * 2;
                    const cand = [P2, [P2[0], hy1], [vx, hy1], [vx, hy2], [Q2[0], hy2], Q2];
                    if (!polyHits(cand, r.from, r.to)) {
                        chosenPts = cand;
                        break;
                    }
                }
                if (!chosenPts)
                    chosenPts = directV;
            }
        }
        wires.push({
            id: `dw-${idx}-${r.from}-${r.to}`,
            from: r.from,
            to: r.to,
            d: roundOrthogonalCorners(simplifyOrthogonalPoints(chosenPts)),
            planned: r.state === "planned",
        });
    });
    return wires;
}
export function buildLevelModelFromLegacyNodes(nodes, edges, zones = []) {
    const level1Elements = [
        {
            id: "p-researchers",
            kind: "person",
            name: "Product Users & Analysts",
            desc: "Use web applications, dashboards, and APIs to analyze data and collaborate.",
            at: [0, 0],
        },
        {
            id: "p-ops",
            kind: "person",
            name: "Platform & SRE Leads",
            desc: "Operate cloud environments, deployment pipelines, and security policies.",
            at: [0, 1],
        },
        {
            id: "s-ecosystem",
            kind: "system",
            name: "Enterprise Cloud Platform",
            tech: `${nodes.length} Core Services`,
            desc: "Unified application architecture spanning web portals, APIs, and managed data stores.",
            at: [2, 0],
            zoom: 2,
        },
        {
            id: "x-tamu-sso",
            kind: "external",
            name: "Identity Provider (SSO)",
            desc: "Federated OIDC single sign-on and role group directory.",
            at: [4, 0],
        },
        {
            id: "x-txdot",
            kind: "external",
            name: "External Telemetry Feeds",
            desc: "Real-time partner data streams and webhook integrations.",
            at: [4, 1],
        },
    ];
    const level1Rels = [
        { from: "p-researchers", to: "s-ecosystem", label: "Uses portals & API", tech: "HTTPS 443" },
        { from: "p-ops", to: "s-ecosystem", label: "Operates & monitors", tech: "HTTPS" },
        { from: "s-ecosystem", to: "x-tamu-sso", label: "Signs users in", tech: "OIDC / SCIM" },
        { from: "x-txdot", to: "s-ecosystem", label: "Streams partner feeds", tech: "TLS / gRPC" },
    ];
    const colCounts = new Map();
    const level2Elements = [
        { id: "p-researchers", ref: true, at: [0, 0] },
        { id: "p-ops", ref: true, at: [0, 1] },
    ];
    const level3 = {};
    const deployGroups = zones.length > 0
        ? zones.map((z) => ({ id: z.id, zone: "cloud-prod", title: z.label, rg: z.sublabel }))
        : [{ id: "rg-default", zone: "cloud-prod", title: "Production Cloud Region" }];
    const deployNodes = [];
    const deployLinks = [];
    nodes.forEach((n, idx) => {
        const tierCol = (typeof n.tier === "number" ? n.tier : idx % 3) + 1;
        const rowIdx = colCounts.get(tierCol) ?? 0;
        colCounts.set(tierCol, rowIdx + 1);
        const hostIds = n.resources
            .filter((r) => r.kind !== "person")
            .map((r) => r.id);
        level2Elements.push({
            id: n.id,
            kind: n.id.includes("data") || n.id.includes("db") ? "database" : "container",
            name: n.name,
            tech: n.division || n.code,
            desc: n.summary,
            status: n.status === "pending" ? "planned" : n.status === "warning" ? "paused" : "live",
            at: [tierCol, rowIdx],
            deployed: hostIds,
            live: {
                state: n.status === "ok" ? "running" : "inactive",
                version: n.packages[0]?.version,
            },
        });
        level3[n.id] = n.packages.map((p, pIdx) => ({
            id: `${n.id}-pkg-${pIdx}`,
            kind: "component",
            name: p.name,
            tech: `${p.scope ?? "npm"} · v${p.version}${p.port ? ` :${p.port}` : ""}`,
            desc: `Package dependency (${p.scope ?? "external"}) consumed by ${n.name}.`,
        }));
        for (const r of n.resources) {
            if (r.kind === "person")
                continue;
            if (!deployNodes.some((dn) => dn.id === r.id)) {
                deployNodes.push({
                    id: r.id,
                    group: n.zoneId || deployGroups[0].id,
                    kind: r.kind,
                    title: r.name,
                    role: `${r.spec || r.role || "Compute resource"} supporting ${n.name}.`,
                    status: "now",
                    hosts: [n.id],
                    facts: {
                        type: r.kind.toUpperCase(),
                        size: r.spec || "Standard",
                    },
                });
            }
        }
    });
    const level2Rels = [
        { from: "p-researchers", to: nodes[0]?.id ?? "", label: "Uses", tech: "HTTPS 443" },
        ...edges.map((e) => ({
            from: e.source,
            to: e.target,
            label: e.label || "Calls",
            tech: e.protocol,
        })),
    ].filter((r) => r.to);
    return {
        schema: TUX_MAP_SCHEMA,
        generatedAt: new Date().toISOString(),
        level1: { elements: level1Elements, rels: level1Rels },
        level2: { boundary: "s-ecosystem", elements: level2Elements, rels: level2Rels },
        level3,
        level4: { groups: deployGroups, nodes: deployNodes, links: deployLinks, neighbors: [] },
    };
}
export const TUX_MAP_QUIET_LINK_KINDS = new Set(["mentions"]);
export const TUX_MAP_LINK_STRENGTH_ORDER = [
    "calls",
    "handled-by",
    "sends",
    "reads",
    "denies",
    "forks",
    "copies-logic-of",
    "reads-format",
    "imports",
    "runs",
    "sources",
    "generates",
    "copies",
    "stamps",
    "suppresses",
    "provenance",
    "tests",
    "checks",
    "uses",
    "loads",
    "routes",
    "links",
    "mentions",
];
const LINK_STRENGTH_RANK = new Map(TUX_MAP_LINK_STRENGTH_ORDER.map((k, i) => [k, i]));
export const TUX_MAP_LINK_KIND_LABELS = {
    imports: "imports it",
    calls: "calls it",
    "handled-by": "is handled by it",
    sends: "sends to it",
    reads: "reads it",
    denies: "denies it",
    runs: "runs it",
    sources: "sources it",
    copies: "copies it",
    "copies-logic-of": "copies logic from it",
    forks: "forks it",
    "reads-format": "reads its format",
    generates: "generates from it",
    stamps: "stamps or builds it",
    provenance: "records provenance for it",
    loads: "loads it",
    uses: "reads or ships it",
    checks: "CI checks it",
    tests: "tests it",
    suppresses: "suppresses findings in it",
    routes: "routes to it",
    links: "links to it",
    mentions: "mentions it",
};
const MAX_TREE_DEPTH = 64;
const QUAL_OWNER_REPO_NODE_ID_RE = /^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+):([cfsdpr]):(.*)$/;
const LEGACY_NODE_ID_RE = /^([cfsdpr]):(.*)$/;
const BARE_REPO_NODE_ID_RE = /^([A-Za-z0-9_.-]{2,}):([cfsdpr]):(.*)$/;
const SPLIT_NODE_ID_MEMO = new Map();
export function splitNodeId(nid) {
    if (typeof nid !== "string" || !nid) {
        return { repo: null, kind: null, rest: "" };
    }
    let out = SPLIT_NODE_ID_MEMO.get(nid);
    if (!out) {
        if (SPLIT_NODE_ID_MEMO.size > 65535)
            SPLIT_NODE_ID_MEMO.clear();
        SPLIT_NODE_ID_MEMO.set(nid, (out = splitNodeIdUncached(nid)));
    }
    return out;
}
function splitNodeIdUncached(nid) {
    if (nid.startsWith("p:pkg:") || nid.startsWith("s:pkg:") || nid.startsWith("r:")) {
        return { repo: "", kind: nid[0], rest: nid.slice(2) };
    }
    const mQual = QUAL_OWNER_REPO_NODE_ID_RE.exec(nid);
    if (mQual) {
        return { repo: mQual[1], kind: mQual[2], rest: mQual[3] };
    }
    const mLeg = LEGACY_NODE_ID_RE.exec(nid);
    if (mLeg) {
        return { repo: "", kind: mLeg[1], rest: mLeg[2] };
    }
    const mBare = BARE_REPO_NODE_ID_RE.exec(nid);
    if (mBare) {
        return { repo: mBare[1], kind: mBare[2], rest: mBare[3] };
    }
    return { repo: null, kind: null, rest: nid };
}
export function isKindNodeId(nid, kind) {
    const { kind: k } = splitNodeId(nid);
    if (!k)
        return false;
    if (typeof kind === "string")
        return k === kind;
    if (kind instanceof Set)
        return kind.has(k);
    return kind.includes(k);
}
export function stripNodeKindPrefix(nid) {
    if (typeof nid !== "string" || !nid)
        return "";
    const { kind, rest } = splitNodeId(nid);
    if (!kind)
        return nid;
    if ((kind === "p" || kind === "s") && rest.startsWith("pkg:"))
        return rest.slice(4);
    return rest;
}
export function deriveLinkId(link, seenCounts) {
    const base = `${link.kind || "uses"}:${link.from}->${link.to}`;
    if (!seenCounts)
        return base;
    const n = (seenCounts.get(base) ?? 0) + 1;
    seenCounts.set(base, n);
    return n === 1 ? base : `${base}#${n}`;
}
export function plainElementKindLabel(elOrKind, opts = {}) {
    if (!elOrKind)
        return "element";
    if (typeof elOrKind === "string") {
        return hasOwn(TUX_MAP_ELEMENT_KIND_LABELS, elOrKind)
            ? TUX_MAP_ELEMENT_KIND_LABELS[elOrKind]
            : elOrKind;
    }
    const id = typeof elOrKind.id === "string" ? elOrKind.id : "";
    const kind = elOrKind.kind || "";
    const name = typeof elOrKind.name === "string" ? elOrKind.name : "";
    const tech = typeof elOrKind.tech === "string" ? elOrKind.tech : "";
    const hasPath = opts.hasSourcePath ?? Boolean(elOrKind.source?.path);
    if (kind === "folder" ||
        isKindNodeId(id, "d") ||
        (kind === "module" && !hasPath && (name.endsWith("/") || /\bfolder\b/i.test(tech)))) {
        return "folder";
    }
    if (kind === "file" || isKindNodeId(id, "f") || (kind === "module" && hasPath)) {
        return "file";
    }
    if (kind === "class")
        return "class";
    if (kind === "constant")
        return "constant";
    if (kind === "function")
        return "function";
    if (kind === "symbol" || isKindNodeId(id, "s")) {
        if (/\bclass\b/i.test(tech))
            return "class";
        if (!name.endsWith("()") && /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name)) {
            return "class";
        }
        return "function";
    }
    return (hasOwn(TUX_MAP_ELEMENT_KIND_LABELS, kind) && TUX_MAP_ELEMENT_KIND_LABELS[kind]) || kind || "element";
}
export function elementTypeLabel(el, opts = {}) {
    const kind = plainElementKindLabel(el);
    const tech = typeof el?.tech === "string" ? el.tech.trim() : "";
    if (!tech)
        return kind;
    const sep = opts.separator ?? " · ";
    const lead = new RegExp(`^${kind.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}_])\\s*(?:[·:|,;/\u2013\u2014-]\\s*)*`, "iu");
    const rest = tech.replace(lead, "").trim();
    if (!rest)
        return kind;
    return `${kind}${sep}${rest}`;
}
export const TUX_MAP_BLAST_LINK_CLASS_LABELS = {
    contract: "contracts (routes, code imports)",
    runtime: "calls and uses",
    "type-only": "type-only imports",
    "artifact-stamp": "build stamps",
    "build-exec": "build-time steps",
    verification: "tests and checks",
    prose: "docs that mention it",
    "page-link": "page links",
};
const REFACTOR_WALK = {
    follows: ["contract", "runtime", "type-only", "page-link"],
    stops: ["artifact-stamp", "build-exec", "verification", "prose"],
    skips: [],
};
export const TUX_MAP_BLAST_INTENTS = [
    {
        id: "default",
        label: "General",
        description: "Any change: everything that depends on it, through every link.",
        follows: ["contract", "runtime", "type-only", "artifact-stamp", "build-exec", "verification", "page-link"],
        stops: ["prose"],
        skips: [],
    },
    {
        id: "patch",
        label: "Body patch",
        description: "An edit inside a body that keeps its signature, types and build: what calls or routes to it.",
        follows: ["contract", "runtime"],
        stops: ["artifact-stamp", "verification", "prose"],
        skips: ["type-only", "build-exec", "page-link"],
    },
    {
        id: "refactor",
        label: "Refactor",
        description: "A change to a signature or type that callers see: what calls it or imports its types.",
        ...REFACTOR_WALK,
    },
    {
        id: "cut",
        label: "Cut / remove",
        description: "Removing it: the cards Refactor lights, and the result also names what could go with it.",
        ...REFACTOR_WALK,
    },
    {
        id: "supply-chain",
        label: "Supply chain",
        description: "A new version of a dependency, image or package: what runs, builds or ships it.",
        follows: ["contract", "runtime"],
        stops: ["artifact-stamp", "build-exec", "verification"],
        skips: ["type-only", "prose", "page-link"],
    },
];
export const TUX_MAP_VALID_BLAST_INTENTS = new Set(TUX_MAP_BLAST_INTENTS.map((d) => d.id));
const VALID_LINK_COUPLINGS = new Set([
    "contract",
    "runtime",
    "type-only",
    "artifact-stamp",
    "build-exec",
    "verification",
    "prose",
]);
const VALID_LINK_PHASES = new Set([
    "prod-runtime",
    "client-bundle",
    "build-exec",
    "ci-test",
    "doc-only",
]);
function isPlainRecord(val) {
    return val != null && typeof val === "object" && !Array.isArray(val);
}
function asObjArray(val) {
    if (!Array.isArray(val))
        return [];
    return val.filter((item) => item != null && typeof item === "object" && !Array.isArray(item));
}
const NON_PROSE_LINK_KINDS = new Set([
    "calls",
    "handled-by",
    "sends",
    "reads",
    "denies",
    "imports",
    "runs",
    "sources",
    "copies",
    "copies-logic-of",
    "forks",
    "reads-format",
    "generates",
    "stamps",
    "provenance",
    "tests",
    "checks",
    "suppresses",
    "loads",
    "routes",
    "uses",
    "links",
]);
const NON_TYPE_ONLY_LINK_KINDS = new Set([
    "calls",
    "handled-by",
    "sends",
    "reads",
    "denies",
    "runs",
    "sources",
    "copies",
    "copies-logic-of",
    "forks",
    "reads-format",
    "generates",
    "stamps",
    "provenance",
    "tests",
    "checks",
    "suppresses",
    "loads",
    "routes",
    "links",
]);
const NON_AUX_CO_CUT_KINDS = new Set([
    "system",
    "container",
    "database",
    "storage",
    "component",
    "resource",
    "person",
    "external",
    "route",
    "folder",
]);
const NON_PROD_HOST_COUPLINGS = new Set([
    "verification",
    "artifact-stamp",
    "build-exec",
    "prose",
    "type-only",
]);
export function hasOwn(obj, key) {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}
export function setOwnProp(obj, key, value) {
    if (key === "__proto__") {
        Object.defineProperty(obj, key, {
            value,
            writable: true,
            enumerable: true,
            configurable: true,
        });
    }
    else {
        obj[key] = value;
    }
}
const SURROGATE_RE = /[\uD800-\uDFFF]/;
export function cmpCodepoint(a, b) {
    if (a === b)
        return 0;
    if (!SURROGATE_RE.test(a) && !SURROGATE_RE.test(b))
        return a < b ? -1 : 1;
    let ia = 0;
    let ib = 0;
    while (ia < a.length && ib < b.length) {
        const ca = a.codePointAt(ia);
        const cb = b.codePointAt(ib);
        if (ca !== cb)
            return ca - cb;
        ia += ca > 0xffff ? 2 : 1;
        ib += cb > 0xffff ? 2 : 1;
    }
    return a.length - b.length;
}
function linkStrengthRank(kind) {
    return LINK_STRENGTH_RANK.get(kind || "") ?? TUX_MAP_LINK_STRENGTH_ORDER.length;
}
export function compareBlastLinks(a, b) {
    return (linkStrengthRank(a.kind) - linkStrengthRank(b.kind) ||
        cmpCodepoint(a.from, b.from) ||
        cmpCodepoint(a.to, b.to) ||
        cmpCodepoint(a.at ?? "", b.at ?? ""));
}
export function inferLinkCoupling(link) {
    const k = link.kind || "";
    if (link.coupling && VALID_LINK_COUPLINGS.has(link.coupling)) {
        const c = link.coupling;
        const spoofedProse = c === "prose" && NON_PROSE_LINK_KINDS.has(k);
        const spoofedTypeOnly = c === "type-only" && NON_TYPE_ONLY_LINK_KINDS.has(k);
        const spoofedRouteLoadContract = (k === "routes" || k === "denies" || k === "handled-by" || k === "links" || k === "loads") &&
            c !== "contract" &&
            c !== "runtime";
        const spoofedNonStopAux = !link.stop &&
            (k === "calls" ||
                k === "handled-by" ||
                k === "sends" ||
                k === "reads" ||
                k === "forks" ||
                k === "copies-logic-of" ||
                k === "reads-format" ||
                k === "runs" ||
                k === "uses" ||
                k === "imports" ||
                k === "sources") &&
            (c === "build-exec" || c === "verification" || c === "artifact-stamp");
        const spoofedCallsBuildStamp = (k === "calls" ||
            k === "handled-by" ||
            k === "sends" ||
            k === "reads" ||
            k === "forks" ||
            k === "copies-logic-of" ||
            k === "reads-format") &&
            (c === "build-exec" || c === "artifact-stamp");
        if (!spoofedProse &&
            !spoofedTypeOnly &&
            !spoofedRouteLoadContract &&
            !spoofedNonStopAux &&
            !spoofedCallsBuildStamp) {
            return c;
        }
    }
    if (k === "mentions")
        return "prose";
    if (k === "tests" || k === "checks" || k === "suppresses" || k === "provenance")
        return "verification";
    if (k === "stamps" || k === "generates" || k === "copies")
        return "artifact-stamp";
    if (k === "routes" ||
        k === "denies" ||
        k === "handled-by" ||
        k === "links" ||
        k === "forks" ||
        k === "copies-logic-of" ||
        k === "reads-format") {
        return "contract";
    }
    if (k === "loads" || k === "uses" || k === "sends")
        return "runtime";
    if (k === "imports" || k === "sources" || k === "reads")
        return link.stop ? "verification" : "contract";
    if (k === "calls" || k === "runs")
        return link.stop ? "verification" : "runtime";
    return link.stop ? "verification" : "runtime";
}
export function inferLinkPhase(link) {
    const c = inferLinkCoupling(link);
    const k = link.kind || "";
    if (link.phase && VALID_LINK_PHASES.has(link.phase)) {
        const spoofedDocOnly = link.phase === "doc-only" && c !== "prose" && k !== "mentions";
        const spoofedNonProdRuntime = (c === "runtime" || c === "contract") &&
            (link.phase === "ci-test" || link.phase === "build-exec" || link.phase === "doc-only");
        if (!spoofedDocOnly && !spoofedNonProdRuntime) {
            return link.phase;
        }
    }
    if (c === "prose" || k === "mentions")
        return "doc-only";
    if (c === "verification" || k === "tests" || k === "checks")
        return "ci-test";
    if (c === "build-exec")
        return "build-exec";
    if (c === "artifact-stamp" || k === "stamps" || k === "loads" || k === "links")
        return "client-bundle";
    return "prod-runtime";
}
export function classifyBlastLink(link, hop, intent = "default", quietSeedOnly = true, kinds) {
    if (!TUX_MAP_VALID_BLAST_INTENTS.has(intent)) {
        throw new RangeError(`Invalid blast intent '${String(intent)}'; expected one of: default, patch, refactor, cut, supply-chain.`);
    }
    const k = link.kind || "uses";
    if (kinds && !kinds.has(k))
        return "skip";
    const isQuiet = TUX_MAP_QUIET_LINK_KINDS.has(link.kind || "");
    if (quietSeedOnly && isQuiet && hop > 0)
        return "skip";
    if (intent === "default") {
        if (isQuiet)
            return link.stop === false && !quietSeedOnly ? "spread" : "stop";
        return link.stop ? "stop" : "spread";
    }
    const c = inferLinkCoupling(link);
    const p = inferLinkPhase(link);
    if (intent === "patch") {
        if (k === "links" || c === "type-only" || c === "build-exec")
            return "skip";
        if (c === "prose")
            return hop === 0 || !quietSeedOnly ? "stop" : "skip";
        if (c === "artifact-stamp" || c === "verification" || link.stop)
            return "stop";
        return "spread";
    }
    if (intent === "refactor" || intent === "cut") {
        if (c === "prose")
            return hop === 0 || !quietSeedOnly ? "stop" : "skip";
        if (c === "type-only")
            return "spread";
        if (c === "build-exec" || c === "artifact-stamp" || c === "verification" || link.stop)
            return "stop";
        return "spread";
    }
    if (k === "links" || c === "prose" || c === "type-only" || p === "doc-only")
        return "skip";
    if (p === "build-exec" || c === "build-exec")
        return "stop";
    if (c === "artifact-stamp" || k === "stamps")
        return "stop";
    if (p === "ci-test" || c === "verification")
        return "stop";
    return link.stop ? "stop" : "spread";
}
function isLevel3Focus(id, model) {
    if (!isPlainRecord(model?.level3) || !hasOwn(model.level3, id) || !Array.isArray(model.level3[id])) {
        return false;
    }
    return model.level3[id].length > 0 || !isPlainRecord(model.subgraphs) || !hasOwn(model.subgraphs, id);
}
export function resolveModelRawLinks(model) {
    if (!model || typeof model !== "object")
        return [];
    const stopKinds = Array.isArray(model.stopKinds)
        ? new Set(model.stopKinds.filter((k) => typeof k === "string" && Boolean(k)))
        : null;
    const direct = asObjArray(model.links);
    const tiers = isPlainRecord(model.linkTiers) ? model.linkTiers : null;
    const tierSpread = tiers ? asObjArray(tiers.spread) : [];
    const tierStop = tiers ? asObjArray(tiers.stop) : [];
    if (tierSpread.length === 0 && tierStop.length === 0 && !stopKinds) {
        return direct.filter((l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to));
    }
    const out = [];
    const seen = new Set();
    const pushLink = (l, defaultStop) => {
        if (typeof l.from !== "string" || !l.from || typeof l.to !== "string" || !l.to)
            return;
        const kind = l.kind || "uses";
        const resolvedStop = l.stop !== undefined
            ? l.stop
            : defaultStop !== undefined
                ? defaultStop
                : stopKinds?.has(kind)
                    ? true
                    : undefined;
        const key = `${l.from}\u0000${l.to}\u0000${kind}\u0000${l.at ?? ""}\u0000${resolvedStop ? "1" : "0"}`;
        if (seen.has(key))
            return;
        seen.add(key);
        if (resolvedStop !== undefined && l.stop !== resolvedStop) {
            out.push({ ...l, stop: resolvedStop });
        }
        else {
            out.push(l);
        }
    };
    for (const l of direct)
        pushLink(l);
    for (const l of tierSpread)
        pushLink(l, false);
    for (const l of tierStop)
        pushLink(l, true);
    return out;
}
const MAP_SHAPE_SCHEMA = {
    type: "object",
    properties: { "schema": { "const": "tux-map/1" }, "generatedAt": { "type": "string" }, "issueBaseUrl": { "type": "string" }, "sourceBaseUrl": { "type": "string" }, "level1": { "type": "object", "properties": { "title": { "type": "string" }, "summary": { "type": "string" }, "elements": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelElement" } }, "rels": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelRel" } } }, "required": ["elements", "rels"] }, "level2": { "type": "object", "properties": { "title": { "type": "string" }, "summary": { "type": "string" }, "boundary": { "type": "string" }, "elements": { "type": "array", "items": { "anyOf": [{ "$ref": "#/$defs/TuxMapLevelElement" }, { "$ref": "#/$defs/TuxMapLevelRef" }] } }, "rels": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelRel" } } }, "required": ["boundary", "elements", "rels"] }, "level3": { "type": "object", "additionalProperties": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelElement" } } }, "level4": { "type": "object", "properties": { "title": { "type": "string" }, "summary": { "type": "string" }, "zones": { "type": "array", "items": { "$ref": "#/$defs/TuxMapDeploymentZone" } }, "centerTitle": { "type": "string" }, "groups": { "type": "array", "items": { "$ref": "#/$defs/TuxMapDeploymentGroup" } }, "nodes": { "type": "array", "items": { "$ref": "#/$defs/TuxMapDeploymentNode" } }, "links": { "type": "array", "items": { "$ref": "#/$defs/TuxMapDeploymentLink" } }, "neighbors": { "type": "array", "items": { "$ref": "#/$defs/TuxMapNeighborResource" } } }, "required": ["groups", "nodes", "links"] }, "subgraphs": { "type": "object", "additionalProperties": { "$ref": "#/$defs/TuxMapSubgraph" } }, "links": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLink" } }, "linkTiers": { "type": "object", "properties": { "spread": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLink" } }, "stop": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLink" } } } }, "stopKinds": { "type": "array", "items": { "type": "string" } }, "aliases": { "type": "object", "additionalProperties": { "type": "string" } }, "routes": { "type": "array", "items": { "$ref": "#/$defs/TuxMapRouteEntry" } } },
    required: ["level1", "level2", "level3", "level4"],
    $defs: {
        TuxMapDeploymentGroup: { "type": "object", "properties": { "id": { "type": "string" }, "zone": { "type": "string" }, "title": { "type": "string" }, "rg": { "type": "string" } }, "required": ["id", "zone", "title"] },
        TuxMapDeploymentLink: { "type": "object", "properties": { "from": { "type": "string" }, "to": { "type": "string" }, "label": { "type": "string" }, "kind": { "type": "string" }, "state": { "type": "string", "enum": ["planned", "now"] } }, "required": ["from", "to"] },
        TuxMapDeploymentNode: { "type": "object", "properties": { "id": { "type": "string" }, "zone": { "type": "string" }, "group": { "type": "string" }, "kind": { "type": "string" }, "title": { "type": "string" }, "role": { "type": "string" }, "status": { "type": "string", "enum": ["planned", "neighbor", "now"] }, "placement": { "type": "string" }, "hosts": { "type": "array", "items": { "type": "string" } }, "deps": { "type": "array", "items": { "type": "string" } }, "roadmap": { "type": "array", "items": { "type": "number" } }, "source": { "$ref": "#/$defs/TuxMapSourceRef" }, "diff": { "$ref": "#/$defs/TuxMapDiffInfo" }, "children": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelElement" } }, "childRels": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelRel" } }, "subgraphRef": { "type": "string" }, "facts": { "type": "object", "properties": { "type": { "type": "string" }, "size": { "type": "string" }, "sku": { "type": "string" }, "version": { "type": "string" }, "nodes": { "type": "number" }, "ingress": { "type": "string" }, "images": { "type": "array", "items": { "type": "string" } }, "rules": { "type": "array", "items": { "$ref": "#/$defs/TuxMapFirewallRule" } } } } }, "required": ["id", "kind", "title", "role"] },
        TuxMapDeploymentZone: { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" }, "column": { "type": "string", "enum": ["left", "right", "center"] }, "planned": { "type": "boolean" }, "zones": { "type": "array", "items": { "type": "string" } } }, "required": ["id", "title"] },
        TuxMapDiffInfo: { "type": "object", "properties": { "changeType": { "type": "string", "enum": ["added", "modified", "deleted"] }, "filesChanged": { "type": "number" }, "summary": { "type": "string" } }, "required": ["changeType"] },
        TuxMapElementKind: { "type": "string", "enum": ["symbol", "function", "person", "system", "container", "database", "storage", "component", "folder", "file", "class", "constant", "module", "schema", "route", "external", "resource"] },
        TuxMapElementLiveInfo: { "type": "object", "properties": { "state": { "type": "string", "enum": ["running", "active", "present", "success", "inactive", "declared-not-installed", "failed", "unknown"] }, "total": { "type": "number" }, "running": { "type": "number" }, "version": { "type": "string" }, "update": { "type": "string" }, "updates": { "type": "number" }, "severity": { "type": "string" }, "newer_major": { "type": "string" }, "unit": { "type": "string" }, "findings": { "type": "string" }, "last_run": { "type": "object", "properties": { "result": { "type": "string" }, "at": { "type": "string" } }, "required": ["result"] } } },
        TuxMapElementStatus: { "type": "string", "enum": ["live", "paused", "planned", "neighbor"] },
        TuxMapFirewallRule: { "type": "object", "properties": { "direction": { "type": "string", "enum": ["in", "out"] }, "access": { "type": "string", "enum": ["allow", "deny"] }, "ports": { "type": "array", "items": { "type": "string" } }, "from": { "type": "array", "items": { "type": "string" } } }, "required": ["direction", "access", "ports", "from"] },
        TuxMapLevelElement: { "type": "object", "properties": { "id": { "type": "string" }, "kind": { "$ref": "#/$defs/TuxMapElementKind" }, "name": { "type": "string" }, "tech": { "type": "string" }, "desc": { "type": "string" }, "status": { "$ref": "#/$defs/TuxMapElementStatus" }, "at": { "type": "array", "prefixItems": [{ "type": "number" }, { "type": "number" }], "minItems": 2, "maxItems": 2 }, "px": { "type": "array", "prefixItems": [{ "type": "number" }, { "type": "number" }, { "type": "number" }], "minItems": 3, "maxItems": 3 }, "ref": { "type": "boolean" }, "zoom": { "type": "number" }, "parent": { "type": "string" }, "side": { "type": "string", "enum": ["in", "out"] }, "mini": { "type": "boolean" }, "next": { "type": "number" }, "runs": { "anyOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }] }, "deployed": { "anyOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }] }, "roadmap": { "type": "array", "items": { "type": "number" } }, "live": { "$ref": "#/$defs/TuxMapElementLiveInfo" }, "source": { "$ref": "#/$defs/TuxMapSourceRef" }, "diff": { "$ref": "#/$defs/TuxMapDiffInfo" }, "children": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelElement" } }, "childRels": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelRel" } }, "subgraphRef": { "type": "string" }, "vendoredCopies": { "type": "array", "items": { "type": "string" } }, "isVendoredCopy": { "type": "boolean" }, "vendoredFrom": { "type": "string" } }, "required": ["id", "name"] },
        TuxMapLevelRef: { "type": "object", "properties": { "live": { "$ref": "#/$defs/TuxMapElementLiveInfo" }, "kind": { "$ref": "#/$defs/TuxMapElementKind" }, "name": { "type": "string" }, "tech": { "type": "string" }, "desc": { "type": "string" }, "status": { "$ref": "#/$defs/TuxMapElementStatus" }, "at": { "type": "array", "prefixItems": [{ "type": "number" }, { "type": "number" }], "minItems": 2, "maxItems": 2 }, "px": { "type": "array", "prefixItems": [{ "type": "number" }, { "type": "number" }, { "type": "number" }], "minItems": 3, "maxItems": 3 }, "zoom": { "type": "number" }, "parent": { "type": "string" }, "side": { "type": "string", "enum": ["in", "out"] }, "mini": { "type": "boolean" }, "next": { "type": "number" }, "runs": { "anyOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }] }, "deployed": { "anyOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }] }, "roadmap": { "type": "array", "items": { "type": "number" } }, "source": { "$ref": "#/$defs/TuxMapSourceRef" }, "diff": { "$ref": "#/$defs/TuxMapDiffInfo" }, "children": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelElement" } }, "childRels": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelRel" } }, "subgraphRef": { "type": "string" }, "vendoredCopies": { "type": "array", "items": { "type": "string" } }, "isVendoredCopy": { "type": "boolean" }, "vendoredFrom": { "type": "string" }, "id": { "type": "string" }, "ref": { "const": true } }, "required": ["id", "ref"] },
        TuxMapLevelRel: { "type": "object", "properties": { "from": { "type": "string" }, "to": { "type": "string" }, "label": { "type": "string" }, "tech": { "type": "string" }, "status": { "$ref": "#/$defs/TuxMapElementStatus" }, "roadmap": { "type": "array", "items": { "type": "number" } }, "violations": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLinkViolation" } } }, "required": ["from", "to"] },
        TuxMapLink: { "type": "object", "properties": { "from": { "type": "string" }, "to": { "type": "string" }, "kind": { "type": "string" }, "label": { "type": "string" }, "stop": { "type": "boolean" }, "at": { "type": "string" }, "sites": { "type": "array", "items": { "type": "number" } }, "coupling": { "$ref": "#/$defs/TuxMapLinkCoupling" }, "phase": { "$ref": "#/$defs/TuxMapLinkPhase" }, "violations": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLinkViolation" } } }, "required": ["from", "to"] },
        TuxMapLinkCoupling: { "type": "string", "enum": ["contract", "runtime", "type-only", "artifact-stamp", "build-exec", "verification", "prose"] },
        TuxMapLinkPhase: { "type": "string", "enum": ["build-exec", "prod-runtime", "client-bundle", "ci-test", "doc-only"] },
        TuxMapLinkViolation: { "type": "object", "properties": { "rule": { "type": "string" }, "message": { "type": "string" }, "fix": { "type": "string" }, "severity": { "type": "string", "enum": ["error", "warning"] } }, "required": ["rule"] },
        TuxMapNeighborResource: { "type": "object", "properties": { "name": { "type": "string" }, "type": { "type": "string" }, "resourceGroup": { "type": "string" }, "reason": { "type": "string" } }, "required": ["name", "type", "resourceGroup", "reason"] },
        TuxMapRouteEntry: { "type": "object", "properties": { "method": { "type": "string" }, "pattern": { "type": "string" }, "handler": { "type": "string" }, "framework": { "type": "string" } }, "required": ["pattern", "handler"] },
        TuxMapSourceRef: { "type": "object", "properties": { "repo": { "type": "string" }, "path": { "type": "string" }, "lineRange": { "type": "array", "prefixItems": [{ "type": "number" }, { "type": "number" }], "minItems": 2, "maxItems": 2 }, "symbol": { "type": "string" }, "signature": { "type": "string" }, "hash": { "type": "string" }, "moduleHash": { "type": "string" }, "commitSha": { "type": "string" }, "url": { "type": "string" } }, "required": ["path"] },
        TuxMapSubgraph: { "type": "object", "properties": { "stratum": { "type": "string" }, "summary": { "type": "string" }, "elements": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelElement" } }, "rels": { "type": "array", "items": { "$ref": "#/$defs/TuxMapLevelRel" } } }, "required": ["elements"] },
    },
};
const jsonPointerToken = (key) => key.replace(/~/g, "~0").replace(/\//g, "~1");
const MAP_SHAPE_DROP = Symbol("drop");
const MAP_SHAPE_REPAIRS = new WeakMap();
const mapShapePath = (trail) => {
    let out = "";
    for (const t of trail)
        out += `/${typeof t === "number" ? t : jsonPointerToken(t)}`;
    return out;
};
const MAP_SHAPE_REFS = new Map();
function resolveMapShapeSchema(schema) {
    const ref = schema.$ref;
    if (ref === undefined)
        return schema;
    let s = MAP_SHAPE_REFS.get(ref);
    if (!s) {
        s = schema;
        while (s.$ref !== undefined) {
            const name = s.$ref.slice("#/$defs/".length);
            const defs = MAP_SHAPE_SCHEMA.$defs;
            s = defs && hasOwn(defs, name) ? defs[name] : {};
        }
        MAP_SHAPE_REFS.set(ref, s);
    }
    return s;
}
function fitsMapShapeScalar(value, schema) {
    const type = schema.type;
    return ((type === "string" || type === "number" || type === "boolean") &&
        typeof value === type &&
        schema.enum === undefined &&
        schema.const === undefined);
}
function addMapShapeFinding(walk, code, schema, found, count = 1, path) {
    const list = (walk.findings ??= []);
    for (const f of list) {
        if (f.schema === schema && f.code === code) {
            f.count += count;
            return;
        }
    }
    list.push({ code, schema, path: path ?? mapShapePath(walk.trail), found, count });
}
function describeMapShapeValue(value) {
    if (value === null)
        return "null";
    if (Array.isArray(value))
        return `a list of ${value.length}`;
    if (typeof value === "string")
        return `"${value.slice(0, 64)}"`;
    if (typeof value === "number" || typeof value === "boolean")
        return String(value);
    return typeof value === "object" ? "an object" : `a ${typeof value}`;
}
function describeMapShapeSchema(schema) {
    const s = resolveMapShapeSchema(schema);
    if (s.anyOf)
        return [...new Set(s.anyOf.map(describeMapShapeSchema))].join(" or ");
    if (s.const !== undefined)
        return JSON.stringify(s.const);
    if (s.enum)
        return `one of ${s.enum.map((v) => `"${v}"`).join(", ")}`;
    if (s.type === "array")
        return s.minItems !== undefined ? `a list of ${s.minItems}` : "a list";
    if (s.type === "object")
        return "an object";
    if (s.type === "boolean")
        return "true or false";
    return s.type ? `a ${s.type}` : "any value";
}
function isMapShapeType(value, schema) {
    if (schema.const !== undefined)
        return value === schema.const;
    switch (schema.type) {
        case "object":
            return isPlainRecord(value);
        case "array":
            return Array.isArray(value);
        case undefined:
            return true;
        default:
            return typeof value === schema.type;
    }
}
function checkMapShape(value, given, walk) {
    const schema = resolveMapShapeSchema(given);
    if (schema.anyOf) {
        const fits = schema.anyOf.map(resolveMapShapeSchema).filter((s) => isMapShapeType(value, s));
        if (fits.length === 0) {
            addMapShapeFinding(walk, "invalid-type", schema, describeMapShapeValue(value));
            return MAP_SHAPE_DROP;
        }
        if (fits.length === 1)
            return checkMapShape(value, fits[0], walk);
        let best;
        let bestCount = 0;
        let bestFixed = value;
        for (const branch of fits) {
            const trial = { trail: walk.trail, findings: null };
            const fixed = checkMapShape(value, branch, trial);
            if (!trial.findings)
                return value;
            const count = trial.findings.reduce((n, f) => n + f.count, 0);
            if (!best || count < bestCount) {
                best = trial;
                bestCount = count;
                bestFixed = fixed;
            }
        }
        for (const f of best.findings)
            addMapShapeFinding(walk, f.code, f.schema, f.found, f.count, f.path);
        return bestFixed;
    }
    if (!isMapShapeType(value, schema)) {
        addMapShapeFinding(walk, "invalid-type", schema, describeMapShapeValue(value));
        return MAP_SHAPE_DROP;
    }
    if (schema.enum) {
        if (!schema.enum.includes(value)) {
            const last = walk.trail[walk.trail.length - 1];
            addMapShapeFinding(walk, last === "kind" ? "unknown-kind" : "unknown-enum-value", schema, describeMapShapeValue(value));
        }
        return value;
    }
    const trail = walk.trail;
    if (schema.type === "object") {
        const obj = value;
        const props = schema.properties;
        if (schema.required && props) {
            for (const key of schema.required) {
                if (obj[key] === undefined || obj[key] === null) {
                    trail.push(key);
                    addMapShapeFinding(walk, "missing-field", props[key], "nothing");
                    trail.pop();
                }
            }
        }
        const rest = schema.additionalProperties;
        let copy;
        const keys = Object.keys(obj);
        for (let k = 0; k < keys.length; k++) {
            const key = keys[k];
            const v = obj[key];
            if (v === undefined || v === null)
                continue;
            const sub = props && hasOwn(props, key) ? props[key] : rest;
            if (!sub)
                continue;
            if (fitsMapShapeScalar(v, sub))
                continue;
            trail.push(key);
            const fixed = checkMapShape(v, sub, walk);
            trail.pop();
            if (fixed === v)
                continue;
            copy ??= { ...obj };
            if (fixed === MAP_SHAPE_DROP)
                delete copy[key];
            else
                setOwnProp(copy, key, fixed);
        }
        return copy ?? obj;
    }
    if (schema.type === "array") {
        const list = value;
        if ((schema.minItems !== undefined && list.length < schema.minItems) ||
            (schema.maxItems !== undefined && list.length > schema.maxItems)) {
            addMapShapeFinding(walk, "invalid-type", schema, describeMapShapeValue(value));
            return MAP_SHAPE_DROP;
        }
        const prefix = schema.prefixItems;
        const items = schema.items;
        if (!prefix && !items)
            return value;
        let copy;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const sub = prefix && i < prefix.length ? prefix[i] : items;
            let fixed = item;
            if (sub && !fitsMapShapeScalar(item, sub)) {
                trail.push(i);
                fixed = checkMapShape(item, sub, walk);
                trail.pop();
            }
            if (fixed !== item) {
                if (prefix)
                    return MAP_SHAPE_DROP;
                copy ??= list.slice(0, i);
            }
            if (copy && fixed !== MAP_SHAPE_DROP)
                copy.push(fixed);
        }
        return copy ?? list;
    }
    return value;
}
function collectMapShapeFindings(model, cache) {
    const all = { trail: [], findings: null };
    const part = (value, schema, trail) => {
        const keyed = cache && typeof value === "object" && value !== null ? value : undefined;
        const kept = keyed && cache.get(keyed);
        let findings;
        let fixed;
        if (kept && kept.path === mapShapePath(trail)) {
            findings = kept.findings;
            fixed = kept.fixed;
        }
        else {
            const walk = { trail, findings: null };
            fixed = checkMapShape(value, schema, walk);
            findings = walk.findings;
            if (keyed)
                cache.set(keyed, { path: mapShapePath(trail), findings, fixed });
        }
        if (findings)
            for (const f of findings)
                addMapShapeFinding(all, f.code, f.schema, f.found, f.count, f.path);
        return fixed;
    };
    let copy;
    const props = MAP_SHAPE_SCHEMA.properties ?? {};
    for (const key of Object.keys(props)) {
        if (key === "schema" || !hasOwn(model, key))
            continue;
        const value = model[key];
        if (value === undefined || value === null)
            continue;
        if (/^level[1-4]$/.test(key) && !isPlainRecord(value))
            continue;
        const entries = key === "subgraphs" && isPlainRecord(value) ? props[key].additionalProperties : undefined;
        let fixed = value;
        if (entries) {
            let sgCopy;
            for (const sgKey of Object.keys(value)) {
                const sg = value[sgKey];
                if (sg === undefined || sg === null)
                    continue;
                const fixedSg = part(sg, entries, [key, sgKey]);
                if (fixedSg === sg)
                    continue;
                if (!sgCopy) {
                    sgCopy = Object.create(null);
                    for (const [k, v] of Object.entries(value))
                        setOwnProp(sgCopy, k, v);
                }
                if (fixedSg === MAP_SHAPE_DROP)
                    delete sgCopy[sgKey];
                else
                    setOwnProp(sgCopy, sgKey, fixedSg);
            }
            if (sgCopy)
                fixed = sgCopy;
        }
        else {
            fixed = part(value, props[key], [key]);
        }
        if (fixed === value)
            continue;
        copy ??= { ...model };
        if (fixed === MAP_SHAPE_DROP)
            delete copy[key];
        else
            setOwnProp(copy, key, fixed);
    }
    return { findings: all.findings ?? [], fixed: copy ?? model };
}
function mapShapeWarning(f) {
    const more = f.count > 1 ? ` (and ${f.count - 1} more like it)` : "";
    const expected = describeMapShapeSchema(f.schema);
    let message;
    if (f.code === "missing-field") {
        message =
            resolveMapShapeSchema(f.schema).type === "array"
                ? `Architecture model has no '${f.path}'${more}; it is read as an empty list.`
                : `Architecture model has no '${f.path}'${more}, which the schema requires; the map fills in what it can.`;
    }
    else if (f.code === "invalid-type") {
        message = `Architecture model has ${f.found} at '${f.path}'${more} where the schema has ${expected}; it is left out.`;
    }
    else if (f.code === "unknown-kind") {
        message = `Architecture model has the kind ${f.found} at '${f.path}'${more}, which this release has no label for; it is shown under that name.`;
    }
    else {
        message = `Architecture model has ${f.found} at '${f.path}'${more}; this release knows ${expected}.`;
    }
    return { code: f.code, message, path: f.path, ...(f.count > 1 ? { count: f.count } : {}) };
}
export function validateMapModel(model) {
    return validateMapModelKeepingShape(model);
}
function validateMapModelKeepingShape(model, shapeCache) {
    const issues = [];
    const duplicateSet = new Set();
    const cycleSet = new Set();
    const unknownSet = new Set();
    if (!isPlainRecord(model)) {
        return {
            valid: false,
            issues: [{ code: "missing-level", message: "Model must be a non-null object." }],
            warnings: [],
            duplicateIds: [],
            cycleIds: [],
            unknownEnds: [],
        };
    }
    for (const reqKey of ["level1", "level2", "level3", "level4"]) {
        if (!isPlainRecord(model[reqKey])) {
            issues.push({
                code: "missing-level",
                message: `Missing required '${reqKey}' section on architecture model.`,
            });
        }
    }
    const warnings = [];
    if (["level1", "level2", "level3", "level4"].some((k) => hasOwn(model, k))) {
        const found = model.schema;
        if (found === undefined || found === null) {
            warnings.push({
                code: "missing-schema",
                message: `Architecture model has no 'schema' field; expected "${TUX_MAP_SCHEMA}". It is read as "${TUX_MAP_SCHEMA}".`,
            });
        }
        else if (found !== TUX_MAP_SCHEMA) {
            const shown = typeof found === "string" ? `"${found.slice(0, 64)}"` : `a ${typeof found}`;
            warnings.push({
                code: "unknown-schema",
                message: `Architecture model declares schema ${shown}; this release supports "${TUX_MAP_SCHEMA}". It is read as "${TUX_MAP_SCHEMA}", best effort.`,
            });
        }
    }
    const shape = collectMapShapeFindings(model, shapeCache);
    for (const f of shape.findings)
        warnings.push(mapShapeWarning(f));
    const m = model;
    const knownIds = new Set();
    const seenPrimaryIds = new Set();
    const rawEdges = [];
    const reservedSeen = new Set();
    const isReservedStageId = (id) => id === "@bound" || id.startsWith("@more-");
    const noteDef = (id, parentId) => {
        if (!id)
            return;
        if (isReservedStageId(id) && !reservedSeen.has(id)) {
            reservedSeen.add(id);
            issues.push({
                code: "reserved-id",
                message: `Element id '${id}' collides with reserved internal stage identifier.`,
                nodeId: id,
            });
        }
        knownIds.add(id);
        if (seenPrimaryIds.has(id)) {
            if (!duplicateSet.has(id)) {
                duplicateSet.add(id);
                issues.push({
                    code: "duplicate-id",
                    message: `Duplicate element id '${id}'.`,
                    nodeId: id,
                });
            }
        }
        else {
            seenPrimaryIds.add(id);
        }
        if (parentId)
            rawEdges.push([id, parentId]);
    };
    const walkKids = (pid, rawKids, depth) => {
        const kids = asObjArray(rawKids);
        if (kids.length === 0)
            return;
        if (depth > MAX_TREE_DEPTH) {
            issues.push({
                code: "max-depth-exceeded",
                message: `Element '${pid}' exceeds maximum tree depth (${MAX_TREE_DEPTH}).`,
                nodeId: pid,
            });
            return;
        }
        kids.forEach((k, idx) => {
            const id = (typeof k.id === "string" && k.id) || `${pid}/${idx}`;
            noteDef(id, pid);
            if (Array.isArray(k.children) && k.children.length > 0) {
                walkKids(id, k.children, depth + 1);
            }
        });
    };
    const l1 = isPlainRecord(m.level1) ? m.level1 : undefined;
    const l2 = isPlainRecord(m.level2) ? m.level2 : undefined;
    const l3 = isPlainRecord(m.level3) ? m.level3 : undefined;
    const l4 = isPlainRecord(m.level4) ? m.level4 : undefined;
    if (l1) {
        for (const e of asObjArray(l1.elements)) {
            if (typeof e.id !== "string" || !e.id)
                continue;
            noteDef(e.id);
            if (Array.isArray(e.children) && e.children.length > 0)
                walkKids(e.id, e.children, 1);
        }
    }
    if (l2) {
        if (typeof l2.boundary === "string" && l2.boundary)
            knownIds.add(l2.boundary);
        for (const e of asObjArray(l2.elements)) {
            if (typeof e.id !== "string" || !e.id)
                continue;
            knownIds.add(e.id);
            if (e.ref)
                continue;
            if (!seenPrimaryIds.has(e.id)) {
                seenPrimaryIds.add(e.id);
            }
            else if (!asObjArray(l1?.elements).some((x) => x.id === e.id)) {
                if (!duplicateSet.has(e.id)) {
                    duplicateSet.add(e.id);
                    issues.push({
                        code: "duplicate-id",
                        message: `Duplicate element id '${e.id}'.`,
                        nodeId: e.id,
                    });
                }
            }
            if (Array.isArray(e.children) && e.children.length > 0)
                walkKids(e.id, e.children, 1);
        }
    }
    if (l3) {
        for (const [cid, kids] of Object.entries(l3)) {
            if (cid)
                knownIds.add(cid);
            walkKids(cid, kids, 1);
        }
    }
    if (l4) {
        for (const g of asObjArray(l4.groups)) {
            if (typeof g.id === "string" && g.id)
                knownIds.add(g.id);
        }
        for (const n of asObjArray(l4.nodes)) {
            if (typeof n.id !== "string" || !n.id)
                continue;
            noteDef(n.id);
            if (Array.isArray(n.children) && n.children.length > 0)
                walkKids(n.id, n.children, 1);
        }
    }
    const subgraphOwners = collectSubgraphOwners(m);
    if (isPlainRecord(m.subgraphs)) {
        for (const [key, sg] of Object.entries(m.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const owner = subgraphOwners.get(key) ?? key;
            if (key)
                knownIds.add(key);
            if (owner)
                knownIds.add(owner);
            const kids = asObjArray(sg.elements);
            kids.forEach((k, idx) => {
                const id = (typeof k.id === "string" && k.id) || `${owner}/${idx}`;
                if (knownIds.has(id)) {
                    rawEdges.push([id, owner]);
                    if (!duplicateSet.has(id) && id !== owner) {
                        duplicateSet.add(id);
                        issues.push({
                            code: "duplicate-id",
                            message: `Duplicate element id '${id}'.`,
                            nodeId: id,
                        });
                    }
                }
                else {
                    noteDef(id, owner);
                }
                if (Array.isArray(k.children) && k.children.length > 0)
                    walkKids(id, k.children, 1);
            });
        }
    }
    const parentsByChild = new Map();
    for (const [c, p] of rawEdges) {
        if (!c || !p)
            continue;
        let arr = parentsByChild.get(c);
        if (!arr) {
            arr = [];
            parentsByChild.set(c, arr);
        }
        if (!arr.includes(p))
            arr.push(p);
    }
    const state = new Map();
    for (const startId of parentsByChild.keys()) {
        if ((state.get(startId) ?? 0) !== 0)
            continue;
        const stack = [{ id: startId, nextIdx: 0 }];
        const onStack = new Set([startId]);
        state.set(startId, 1);
        while (stack.length > 0) {
            if (stack.length > MAX_TREE_DEPTH + 1) {
                const deepId = stack[0].id;
                issues.push({
                    code: "max-depth-exceeded",
                    message: `Parent chain from '${deepId}' exceeds maximum depth (${MAX_TREE_DEPTH}).`,
                    nodeId: deepId,
                });
                stack.pop();
                continue;
            }
            const top = stack[stack.length - 1];
            const ps = parentsByChild.get(top.id) ?? [];
            if (top.nextIdx >= ps.length) {
                state.set(top.id, 2);
                onStack.delete(top.id);
                stack.pop();
                continue;
            }
            const nextParent = ps[top.nextIdx++];
            if (onStack.has(nextParent)) {
                if (!cycleSet.has(nextParent)) {
                    cycleSet.add(nextParent);
                    issues.push({
                        code: "parent-cycle",
                        message: `Parent cycle detected involving '${top.id}' -> '${nextParent}'.`,
                        nodeId: top.id,
                        targetId: nextParent,
                    });
                }
                cycleSet.add(top.id);
            }
            else if ((state.get(nextParent) ?? 0) === 0 && parentsByChild.has(nextParent)) {
                state.set(nextParent, 1);
                onStack.add(nextParent);
                stack.push({ id: nextParent, nextIdx: 0 });
            }
        }
    }
    const checkEnd = (endId, ownerId, code) => {
        if (typeof endId !== "string" || !endId) {
            issues.push({
                code,
                message: `Empty endpoint on ${code === "unknown-link-end" ? "link" : "relationship"} from '${ownerId}'.`,
                nodeId: ownerId,
            });
            return;
        }
        if (!knownIds.has(endId)) {
            if (!unknownSet.has(endId)) {
                unknownSet.add(endId);
                issues.push({
                    code,
                    message: `Unknown ${code === "unknown-link-end" ? "link" : "relationship"} endpoint '${endId}'.`,
                    nodeId: ownerId,
                    targetId: endId,
                });
            }
        }
    };
    for (const r of asObjArray(l1?.rels)) {
        checkEnd(r.from, String(r.from ?? ""), "unknown-rel-end");
        checkEnd(r.to, String(r.from ?? ""), "unknown-rel-end");
    }
    for (const r of asObjArray(l2?.rels)) {
        checkEnd(r.from, String(r.from ?? ""), "unknown-rel-end");
        checkEnd(r.to, String(r.from ?? ""), "unknown-rel-end");
    }
    for (const dl of asObjArray(l4?.links)) {
        checkEnd(dl.from, String(dl.from ?? ""), "unknown-rel-end");
        checkEnd(dl.to, String(dl.from ?? ""), "unknown-rel-end");
    }
    if (isPlainRecord(m.subgraphs)) {
        for (const sg of Object.values(m.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            for (const r of asObjArray(sg.rels)) {
                checkEnd(r.from, String(r.from ?? ""), "unknown-rel-end");
                checkEnd(r.to, String(r.from ?? ""), "unknown-rel-end");
            }
        }
    }
    for (const l of resolveModelRawLinks(m)) {
        checkEnd(l.from, l.from, "unknown-link-end");
        checkEnd(l.to, l.from, "unknown-link-end");
    }
    const result = {
        valid: issues.length === 0,
        issues,
        warnings,
        duplicateIds: [...duplicateSet].sort(cmpCodepoint),
        cycleIds: [...cycleSet].sort(cmpCodepoint),
        unknownEnds: [...unknownSet].sort(cmpCodepoint),
    };
    if (shape.fixed !== model)
        MAP_SHAPE_REPAIRS.set(result, shape.fixed);
    return result;
}
export function sanitizeMapModel(raw) {
    const { model, validation } = sanitizeMapModelKeepingPass(raw);
    return { model, validation };
}
function sanitizeMapModelKeepingPass(raw, validation = validateMapModel(raw)) {
    if (!isPlainRecord(raw)) {
        return { model: EMPTY_TTI_LEVEL_MODEL, validation, pass: null };
    }
    const m = (MAP_SHAPE_REPAIRS.get(validation) ?? raw);
    const cycleSet = new Set(validation.cycleIds);
    const sanitizeId = (id) => {
        if (typeof id !== "string" || !id)
            return "";
        if (id === "@bound" || id.startsWith("@more-"))
            return `id:${id}`;
        return id;
    };
    const sanitizeRelEndpoints = (rawList) => asObjArray(rawList)
        .filter((r) => typeof r.from === "string" && Boolean(r.from) && typeof r.to === "string" && Boolean(r.to))
        .map((r) => {
        const nf = sanitizeId(r.from);
        const nt = sanitizeId(r.to);
        return nf === r.from && nt === r.to ? r : { ...r, from: nf, to: nt };
    });
    const subgraphOwners = collectSubgraphOwners(m);
    const parentOfAccepted = new Map();
    const wouldCreateCycle = (childId, ownerId) => {
        if (!childId || !ownerId)
            return false;
        if (childId === ownerId)
            return true;
        let cur = ownerId;
        for (let depth = 0; cur && depth <= MAX_TREE_DEPTH; depth++) {
            if (cur === childId)
                return true;
            cur = parentOfAccepted.get(cur);
        }
        return false;
    };
    const sanitizeChildElements = (rawEls, ownerId, depth) => {
        if (depth > MAX_TREE_DEPTH)
            return [];
        const out = [];
        for (const el of asObjArray(rawEls)) {
            const rawId = typeof el.id === "string" ? el.id : "";
            const id = sanitizeId(rawId);
            if (id && ownerId) {
                if (wouldCreateCycle(id, ownerId))
                    continue;
                if (cycleSet.has(id) && parentOfAccepted.has(id))
                    continue;
                if (!parentOfAccepted.has(id))
                    parentOfAccepted.set(id, ownerId);
            }
            const hasKids = Array.isArray(el.children);
            const hasChildRels = Array.isArray(el.childRels);
            const nextKids = hasKids ? sanitizeChildElements(el.children, id || ownerId, depth + 1) : undefined;
            const nextChildRels = hasChildRels ? sanitizeRelEndpoints(el.childRels) : undefined;
            const noName = typeof el.name !== "string";
            if (id !== el.id || hasKids || hasChildRels || noName) {
                out.push({
                    ...el,
                    ...(id !== el.id ? { id } : {}),
                    ...(noName ? { name: id } : {}),
                    ...(hasKids ? { children: nextKids } : {}),
                    ...(hasChildRels ? { childRels: nextChildRels } : {}),
                });
            }
            else {
                out.push(el);
            }
        }
        return out;
    };
    const l1Els = sanitizeChildElements(m.level1?.elements, "", 0);
    for (const e of l1Els) {
        if (e.id && !parentOfAccepted.has(e.id))
            parentOfAccepted.set(e.id, "");
    }
    const l2Els = [];
    for (const e of asObjArray(m.level2?.elements)) {
        const rawId = typeof e.id === "string" ? e.id : "";
        const id = sanitizeId(rawId);
        if (!e.ref && id && !parentOfAccepted.has(id)) {
            parentOfAccepted.set(id, sanitizeId(m.level2?.boundary) || "");
        }
        const hasKids = !e.ref && Array.isArray(e.children);
        const nextKids = hasKids
            ? sanitizeChildElements(e.children, id, 1)
            : undefined;
        const noName = !e.ref && typeof e.name !== "string";
        if (id !== e.id || hasKids || noName) {
            l2Els.push({
                ...e,
                ...(id !== e.id ? { id } : {}),
                ...(noName ? { name: id } : {}),
                ...(hasKids ? { children: nextKids } : {}),
            });
        }
        else {
            l2Els.push(e);
        }
    }
    const safeLevel3 = Object.create(null);
    if (isPlainRecord(m.level3)) {
        for (const [rawCid, kids] of Object.entries(m.level3)) {
            const cid = sanitizeId(rawCid);
            if (!cid)
                continue;
            setOwnProp(safeLevel3, cid, sanitizeChildElements(kids, cid, 1));
        }
    }
    const l4Nodes = [];
    for (const n of asObjArray(m.level4?.nodes)) {
        const rawId = typeof n.id === "string" ? n.id : "";
        const id = sanitizeId(rawId);
        if (id && !parentOfAccepted.has(id))
            parentOfAccepted.set(id, sanitizeId(n.group) || "");
        const hasKids = Array.isArray(n.children);
        const nextKids = hasKids ? sanitizeChildElements(n.children, id, 1) : undefined;
        const noTitle = typeof n.title !== "string";
        const noKind = typeof n.kind !== "string";
        const noRole = typeof n.role !== "string";
        l4Nodes.push(id !== n.id || hasKids || noTitle || noKind || noRole
            ? {
                ...n,
                ...(id !== n.id ? { id } : {}),
                ...(noTitle ? { title: id } : {}),
                ...(noKind ? { kind: "" } : {}),
                ...(noRole ? { role: "" } : {}),
                ...(hasKids ? { children: nextKids } : {}),
            }
            : n);
    }
    const sanitizeSubgraph = (sg, ownerId) => ({
        ...sg,
        elements: sanitizeChildElements(sg.elements, ownerId, 1),
        rels: sanitizeRelEndpoints(sg.rels),
    });
    const safeSubgraphs = Object.create(null);
    if (isPlainRecord(m.subgraphs)) {
        for (const [rawKey, sg] of Object.entries(m.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const key = sanitizeId(rawKey);
            if (!key)
                continue;
            const owner = sanitizeId(subgraphOwners.get(rawKey) ?? rawKey) || key;
            setOwnProp(safeSubgraphs, key, sanitizeSubgraph(sg, owner));
        }
    }
    let safeAliases;
    if (isPlainRecord(m.aliases)) {
        const cleanedAliases = Object.create(null);
        for (const [ak, av] of Object.entries(m.aliases)) {
            if (typeof av === "string" && ak && av && ak !== av) {
                setOwnProp(cleanedAliases, sanitizeId(ak), sanitizeId(av));
            }
        }
        for (const ak of Object.keys(cleanedAliases)) {
            const seen = new Set([ak]);
            let cur = cleanedAliases[ak];
            while (cur && hasOwn(cleanedAliases, cur)) {
                if (seen.has(cur)) {
                    delete cleanedAliases[ak];
                    break;
                }
                seen.add(cur);
                cur = cleanedAliases[cur];
            }
        }
        safeAliases = cleanedAliases;
    }
    const safeLinks = Array.isArray(m.links)
        ? sanitizeRelEndpoints(m.links)
        : undefined;
    const safeModel = {
        ...m,
        level1: {
            ...(isPlainRecord(m.level1) ? m.level1 : {}),
            elements: l1Els,
            rels: sanitizeRelEndpoints(m.level1?.rels),
        },
        level2: {
            ...(isPlainRecord(m.level2) ? m.level2 : {}),
            boundary: sanitizeId(m.level2?.boundary),
            elements: l2Els,
            rels: sanitizeRelEndpoints(m.level2?.rels),
        },
        level3: safeLevel3,
        level4: {
            ...(isPlainRecord(m.level4) ? m.level4 : {}),
            groups: asObjArray(m.level4?.groups),
            nodes: l4Nodes,
            links: sanitizeRelEndpoints(m.level4?.links),
        },
        subgraphs: safeSubgraphs,
        ...(safeAliases ? { aliases: safeAliases } : {}),
        ...(safeLinks !== undefined ? { links: safeLinks } : {}),
    };
    return { model: safeModel, validation, pass: { sanitizeId, sanitizeSubgraph } };
}
const MAX_SMALL_COMPONENT_FILES = 8;
function isFolderLikeElement(e) {
    const id = typeof e.id === "string" ? e.id : "";
    if (e.kind === "folder" || isKindNodeId(id, "d"))
        return true;
    if (e.kind === "module" &&
        !e.source?.path &&
        ((typeof e.name === "string" && e.name.endsWith("/")) || /\bfolder\b/i.test(e.tech || ""))) {
        return true;
    }
    return false;
}
export function collapseModelSubgraphs(model, opts = {}) {
    const aliases = Object.create(null);
    if (isPlainRecord(model?.aliases)) {
        for (const [ak, av] of Object.entries(model.aliases)) {
            if (typeof av === "string" && ak && av && ak !== av) {
                setOwnProp(aliases, ak, av);
            }
        }
    }
    if (!isPlainRecord(model?.subgraphs)) {
        return { model, aliases };
    }
    const maxSmallFiles = opts.maxSmallComponentFiles ?? MAX_SMALL_COMPONENT_FILES;
    const origSubgraphs = model.subgraphs;
    const nextSubgraphs = Object.create(null);
    for (const [k, sg] of Object.entries(origSubgraphs)) {
        if (isPlainRecord(sg)) {
            setOwnProp(nextSubgraphs, k, {
                ...sg,
                elements: [...asObjArray(sg.elements)],
            });
        }
    }
    const collapsedSkipKeys = new Set();
    const resolveFolderChain = (el, ownerKey) => {
        if (!isFolderLikeElement(el) || !el.id || el.id === ownerKey)
            return el;
        const names = [(el.name || el.id).replace(/\/+$/, "")];
        const skippedIds = [];
        let curr = el;
        const seen = new Set([ownerKey, el.id]);
        for (let depth = 0; depth < MAX_TREE_DEPTH; depth++) {
            const sgKey = curr.subgraphRef || curr.id;
            const sg = hasOwn(nextSubgraphs, sgKey) ? nextSubgraphs[sgKey] : undefined;
            if (!sg || sg.elements.length !== 1)
                break;
            const onlyChild = sg.elements[0];
            if (!onlyChild?.id || seen.has(onlyChild.id) || !isFolderLikeElement(onlyChild))
                break;
            const childSgKey = onlyChild.subgraphRef || onlyChild.id;
            if (seen.has(childSgKey) || !hasOwn(nextSubgraphs, childSgKey))
                break;
            seen.add(onlyChild.id);
            seen.add(childSgKey);
            skippedIds.push(curr.id);
            if (curr.subgraphRef)
                skippedIds.push(curr.subgraphRef);
            names.push((onlyChild.name || onlyChild.id).replace(/\/+$/, ""));
            curr = onlyChild;
        }
        if (skippedIds.length === 0)
            return el;
        for (const sid of skippedIds) {
            if (sid !== curr.id) {
                setOwnProp(aliases, sid, curr.id);
                collapsedSkipKeys.add(sid);
            }
        }
        return {
            ...curr,
            name: `${names.join("/")}/`,
        };
    };
    for (const [k, sg] of Object.entries(nextSubgraphs)) {
        sg.elements = sg.elements.map((el) => resolveFolderChain(el, k));
        setOwnProp(nextSubgraphs, k, sg);
    }
    for (const sid of collapsedSkipKeys) {
        if (hasOwn(nextSubgraphs, sid)) {
            delete nextSubgraphs[sid];
        }
    }
    const componentIds = new Set();
    if (isPlainRecord(model.level3)) {
        for (const kids of Object.values(model.level3)) {
            for (const comp of asObjArray(kids)) {
                if (typeof comp.id === "string" && comp.id) {
                    componentIds.add(comp.subgraphRef || comp.id);
                }
            }
        }
    }
    for (const compKey of componentIds) {
        if (!hasOwn(nextSubgraphs, compKey))
            continue;
        const compSg = nextSubgraphs[compKey];
        if (compSg.elements.length === 0)
            continue;
        const folderKids = compSg.elements.filter(isFolderLikeElement);
        if (folderKids.length === 0)
            continue;
        const flattened = [];
        const childFolderRels = [];
        const skippedFolderKeys = [];
        let canFlatten = true;
        const multiFolders = compSg.elements.length > 1;
        for (const item of compSg.elements) {
            if (!isFolderLikeElement(item)) {
                flattened.push(item);
                continue;
            }
            const fKey = item.subgraphRef || item.id;
            const fSg = hasOwn(nextSubgraphs, fKey) ? nextSubgraphs[fKey] : undefined;
            if (!fSg || fSg.elements.length === 0 || fSg.elements.some(isFolderLikeElement)) {
                canFlatten = false;
                break;
            }
            skippedFolderKeys.push(item.id);
            if (item.subgraphRef)
                skippedFolderKeys.push(item.subgraphRef);
            if (Array.isArray(fSg.rels)) {
                childFolderRels.push(...asObjArray(fSg.rels));
            }
            const prefix = (item.name || "").replace(/\/+$/, "");
            for (const fileEl of fSg.elements) {
                const needsPrefix = multiFolders &&
                    prefix &&
                    prefix !== "(root)" &&
                    !(fileEl.name || "").startsWith(`${prefix}/`);
                flattened.push(needsPrefix ? { ...fileEl, name: `${prefix}/${fileEl.name || fileEl.id}` } : fileEl);
            }
        }
        if (canFlatten && flattened.length > 0 && flattened.length <= maxSmallFiles) {
            const skippedSet = new Set(skippedFolderKeys);
            const keptCompRels = asObjArray(compSg.rels).filter((r) => !skippedSet.has(r.from) && !skippedSet.has(r.to));
            const mergedRels = [...keptCompRels, ...childFolderRels];
            setOwnProp(nextSubgraphs, compKey, {
                ...compSg,
                stratum: compSg.stratum && /\bfolders?\b/i.test(compSg.stratum) ? "Files" : compSg.stratum,
                elements: flattened,
                ...(compSg.rels !== undefined || childFolderRels.length > 0 ? { rels: mergedRels } : {}),
            });
            for (const fk of skippedFolderKeys) {
                if (fk !== compKey)
                    setOwnProp(aliases, fk, compKey);
                if (hasOwn(nextSubgraphs, fk))
                    delete nextSubgraphs[fk];
            }
        }
    }
    const changed = Object.keys(aliases).length > 0;
    if (!changed)
        return { model, aliases };
    for (const [k, sg] of Object.entries(nextSubgraphs)) {
        const remapped = remapSubgraphRelsThroughAliases(sg, aliases);
        if (remapped !== sg)
            setOwnProp(nextSubgraphs, k, remapped);
    }
    return {
        model: {
            ...model,
            subgraphs: nextSubgraphs,
            aliases,
        },
        aliases,
    };
}
function remapSubgraphRelsThroughAliases(sg, aliases) {
    if (!Array.isArray(sg.rels) || sg.rels.length === 0)
        return sg;
    const resolveAliasTarget = (id) => {
        let cur = id;
        const seen = new Set([cur]);
        while (hasOwn(aliases, cur) && seen.size < MAX_TREE_DEPTH) {
            const nxt = aliases[cur];
            if (!nxt || seen.has(nxt))
                break;
            seen.add(nxt);
            cur = nxt;
        }
        return cur;
    };
    const seenPair = new Set();
    const remappedRels = [];
    for (const r of asObjArray(sg.rels)) {
        const from = resolveAliasTarget(r.from);
        const to = resolveAliasTarget(r.to);
        if (!from || !to || from === to)
            continue;
        const pk = `${from}\u0000${to}`;
        if (seenPair.has(pk))
            continue;
        seenPair.add(pk);
        remappedRels.push(from === r.from && to === r.to ? r : { ...r, from, to });
    }
    return { ...sg, rels: remappedRels };
}
function collectSubgraphOwners(model, report) {
    const subgraphOwners = new Map();
    if (!model || typeof model !== "object")
        return subgraphOwners;
    const noteSubgraphRef = (ownerId, ref) => noteSubgraphOwner(subgraphOwners, ownerId, ref);
    const scanInline = (pid, rawKids, depth = 0) => scanSubgraphOwners(subgraphOwners, pid, rawKids, depth);
    if (isPlainRecord(model.level3)) {
        for (const [cid, kids] of Object.entries(model.level3))
            scanInline(cid, kids, 0);
    }
    for (const e of [
        ...asObjArray(model.level1?.elements),
        ...asObjArray(model.level2?.elements),
    ]) {
        if (typeof e.id === "string" && e.id) {
            noteSubgraphRef(e.id, e.subgraphRef);
            if (Array.isArray(e.children) && e.children.length > 0)
                scanInline(e.id, e.children, 0);
        }
    }
    for (const n of asObjArray(model.level4?.nodes)) {
        if (typeof n.id === "string" && n.id) {
            noteSubgraphRef(n.id, n.subgraphRef);
            if (Array.isArray(n.children) && n.children.length > 0)
                scanInline(n.id, n.children, 0);
        }
    }
    if (isPlainRecord(model.subgraphs)) {
        for (let pass = 0; pass < 4; pass++) {
            const before = subgraphOwners.size;
            for (const [key, sg] of Object.entries(model.subgraphs)) {
                if (!isPlainRecord(sg))
                    continue;
                const owner = subgraphOwners.get(key) ?? key;
                scanInline(owner, sg.elements, 0);
            }
            if (subgraphOwners.size === before && pass >= 1)
                break;
            if (pass >= 1 && report)
                report.late = true;
        }
    }
    return subgraphOwners;
}
function noteSubgraphOwner(owners, ownerId, ref) {
    if (ownerId && ref && typeof ref === "string" && ref !== ownerId && !owners.has(ref)) {
        owners.set(ref, ownerId);
    }
}
function scanSubgraphOwners(owners, pid, rawKids, depth = 0) {
    if (depth >= MAX_TREE_DEPTH)
        return;
    const kids = asObjArray(rawKids);
    kids.forEach((k, i) => {
        const id = (typeof k.id === "string" && k.id) || `${pid}/${i}`;
        noteSubgraphOwner(owners, id, k.subgraphRef);
        if (Array.isArray(k.children) && k.children.length > 0) {
            scanSubgraphOwners(owners, id, k.children, depth + 1);
        }
    });
}
export function buildMapParentIndex(model) {
    const parentOf = new Map();
    const subgraphOwners = collectSubgraphOwners(model);
    const inline = (pid, rawKids, depth = 0) => indexInlineParents(parentOf, pid, rawKids, depth);
    if (isPlainRecord(model?.level3)) {
        for (const [cid, kids] of Object.entries(model.level3))
            inline(cid, kids, 0);
    }
    for (const e of [
        ...asObjArray(model?.level1?.elements),
        ...asObjArray(model?.level2?.elements),
    ]) {
        if (typeof e.id === "string" && e.id && Array.isArray(e.children) && e.children.length > 0) {
            inline(e.id, e.children, 0);
        }
    }
    for (const n of asObjArray(model?.level4?.nodes)) {
        if (typeof n.id === "string" && n.id && Array.isArray(n.children) && n.children.length > 0) {
            inline(n.id, n.children, 0);
        }
    }
    if (isPlainRecord(model?.subgraphs)) {
        for (const [key, sg] of Object.entries(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const owner = subgraphOwners.get(key) ?? key;
            inline(owner, sg.elements, 0);
        }
    }
    return parentOf;
}
function indexInlineParents(parentOf, pid, rawKids, depth = 0) {
    if (!pid || depth >= MAX_TREE_DEPTH)
        return;
    const kids = asObjArray(rawKids);
    kids.forEach((k, i) => {
        const id = (typeof k.id === "string" && k.id) || `${pid}/${i}`;
        if (!parentOf.has(id))
            parentOf.set(id, pid);
        if (Array.isArray(k.children) && k.children.length > 0)
            indexInlineParents(parentOf, id, k.children, depth + 1);
    });
}
const LAZY_MERGE_KEEP = new WeakMap();
const subgraphKeyOfElement = (e) => e.subgraphRef || e.id;
function mergeRawLazySubgraphs(raw, lazy, lazyKeys) {
    if (lazyKeys.length === 0 || !isPlainRecord(raw))
        return raw;
    const merged = Object.create(null);
    if (isPlainRecord(raw.subgraphs)) {
        for (const [k, v] of Object.entries(raw.subgraphs))
            setOwnProp(merged, k, v);
    }
    for (const k of lazyKeys)
        setOwnProp(merged, k, lazy[k]);
    return { ...raw, subgraphs: merged };
}
export function mergeLazyMapSubgraphs(raw, lazy, prev) {
    const lazyKeys = Object.keys(lazy);
    const mergedRaw = mergeRawLazySubgraphs(raw, lazy, lazyKeys);
    const keep = prev ? LAZY_MERGE_KEEP.get(prev) : undefined;
    const done = {};
    const shape = (prev?.raw === raw && keep?.shape) || new WeakMap();
    if (prev && keep) {
        LAZY_MERGE_KEEP.delete(prev);
        const next = prev.raw === raw ? addLazySubgraph(prev, keep, mergedRaw, lazy, lazyKeys, done) : null;
        if (next) {
            LAZY_MERGE_KEEP.set(next, keep);
            return next;
        }
    }
    const sanitized = sanitizeMapModelKeepingPass(mergedRaw, done.validation ?? validateMapModelKeepingShape(mergedRaw, shape));
    const collapsed = collapseModelSubgraphs(sanitized.model);
    const state = {
        raw,
        model: collapsed.model,
        aliases: collapsed.aliases,
        validation: sanitized.validation,
    };
    if (sanitized.pass) {
        LAZY_MERGE_KEEP.set(state, {
            lazyKeys,
            lazyValues: lazyKeys.map((k) => lazy[k]),
            pass: sanitized.pass,
            cycleIds: sanitized.validation.cycleIds,
            shape,
            sanitizedModel: sanitized.model,
        });
    }
    return state;
}
function prepareLazyMerge(keep, prev, prevMergedRaw) {
    const rawReport = { late: false };
    const rawOwners = collectSubgraphOwners(prevMergedRaw, rawReport);
    const collapsedReport = { late: false };
    const collapsedOwners = collectSubgraphOwners(prev.model, collapsedReport);
    if (rawReport.late || collapsedReport.late)
        return null;
    const sanitized = Object.create(null);
    const singleFolderRefs = new Set();
    for (const [k, sg] of Object.entries(keep.sanitizedModel.subgraphs)) {
        setOwnProp(sanitized, k, sg);
        const only = sg.elements.length === 1 ? sg.elements[0] : undefined;
        if (only?.id && isFolderLikeElement(only))
            singleFolderRefs.add(subgraphKeyOfElement(only));
    }
    const componentKeys = new Set();
    for (const kids of Object.values(prev.model.level3)) {
        for (const comp of asObjArray(kids)) {
            if (typeof comp.id === "string" && comp.id)
                componentKeys.add(subgraphKeyOfElement(comp));
        }
    }
    const folderHosts = new Map();
    const collapsedSubgraphs = prev.model.subgraphs;
    for (const compKey of componentKeys) {
        if (hasOwn(collapsedSubgraphs, compKey)) {
            noteFolderHosts(folderHosts, compKey, collapsedSubgraphs[compKey].elements);
        }
    }
    keep.prepared = { sanitized, rawOwners, collapsedOwners, componentKeys, folderHosts, singleFolderRefs };
    return keep.prepared;
}
function noteFolderHosts(folderHosts, compKey, elements) {
    for (const item of elements) {
        if (!isFolderLikeElement(item))
            continue;
        const fKey = subgraphKeyOfElement(item);
        if (!fKey)
            continue;
        const hosts = folderHosts.get(fKey);
        if (hosts)
            hosts.push(compKey);
        else
            folderHosts.set(fKey, [compKey]);
    }
}
function ownersAddedBySubgraph(owners, ownerId, rawElements, isLoaded) {
    const added = new Map();
    scanSubgraphOwners({ has: (k) => owners.has(k) || added.has(k), set: (k, v) => added.set(k, v) }, ownerId, rawElements);
    for (const key of added.keys()) {
        if (isLoaded(key))
            return null;
    }
    return added;
}
function addLazySubgraph(prev, keep, mergedRaw, lazy, lazyKeys, done) {
    const raw = prev.raw;
    if (!isPlainRecord(raw) || !isPlainRecord(mergedRaw))
        return null;
    const known = keep.lazyKeys.length;
    if (lazyKeys.length !== known + 1)
        return null;
    for (let i = 0; i < known; i++) {
        if (lazyKeys[i] !== keep.lazyKeys[i] || lazy[lazyKeys[i]] !== keep.lazyValues[i])
            return null;
    }
    const key = lazyKeys[known];
    const sg = lazy[key];
    if (!key || !isPlainRecord(sg) || /^\d+$/.test(key) || keep.pass.sanitizeId(key) !== key)
        return null;
    const rawBaseSubgraphs = isPlainRecord(raw.subgraphs) ? raw.subgraphs : undefined;
    if (rawBaseSubgraphs && hasOwn(rawBaseSubgraphs, key))
        return null;
    if (hasOwn(prev.aliases, key))
        return null;
    const prepared = keep.prepared ?? prepareLazyMerge(keep, prev, mergeRawLazySubgraphs(raw, lazy, keep.lazyKeys));
    if (!prepared)
        return null;
    const { sanitized, rawOwners, collapsedOwners, componentKeys, folderHosts, singleFolderRefs } = prepared;
    if (hasOwn(sanitized, key))
        return null;
    const validation = validateMapModelKeepingShape(mergedRaw, keep.shape);
    done.validation = validation;
    if (MAP_SHAPE_REPAIRS.has(validation))
        return null;
    if (validation.cycleIds.length !== keep.cycleIds.length ||
        validation.cycleIds.some((id, i) => id !== keep.cycleIds[i])) {
        return null;
    }
    const rawSubgraphs = mergedRaw.subgraphs;
    const rawOwnerId = rawOwners.get(key) ?? key;
    const rawOwnersAdded = ownersAddedBySubgraph(rawOwners, rawOwnerId, sg.elements, (k) => hasOwn(rawSubgraphs, k));
    if (!rawOwnersAdded)
        return null;
    const entry = keep.pass.sanitizeSubgraph(sg, keep.pass.sanitizeId(rawOwnerId) || key);
    const els = entry.elements;
    const isLoaded = (k) => k === key || hasOwn(sanitized, k);
    const only = els.length === 1 ? els[0] : undefined;
    const onlyFolderRef = only?.id && isFolderLikeElement(only) ? subgraphKeyOfElement(only) : "";
    if (onlyFolderRef && isLoaded(onlyFolderRef))
        return null;
    if (singleFolderRefs.has(key))
        return null;
    for (const el of els) {
        if (!el.id || el.id === key || !isFolderLikeElement(el))
            continue;
        const k = subgraphKeyOfElement(el);
        if (k !== key && hasOwn(sanitized, k) && sanitized[k].elements.length === 1)
            return null;
    }
    const lacksSubgraph = (item) => {
        if (!isFolderLikeElement(item))
            return false;
        const k = subgraphKeyOfElement(item);
        return !k || !isLoaded(k);
    };
    const hostsFolders = componentKeys.has(key) && els.some(isFolderLikeElement);
    if (hostsFolders && !els.some(lacksSubgraph))
        return null;
    const hosts = folderHosts.get(key);
    if (hosts && els.length > 0 && els.length <= MAX_SMALL_COMPONENT_FILES && !els.some(isFolderLikeElement)) {
        const collapsedSubgraphs = prev.model.subgraphs;
        for (const compKey of hosts) {
            if (!hasOwn(collapsedSubgraphs, compKey) || !collapsedSubgraphs[compKey].elements.some(lacksSubgraph)) {
                return null;
            }
        }
    }
    const aliased = Object.keys(prev.aliases).length > 0;
    const collapsedEntry = aliased
        ? remapSubgraphRelsThroughAliases({ ...entry, elements: [...els] }, prev.aliases)
        : entry;
    const prevSubgraphs = prev.model.subgraphs;
    const collapsedOwnerId = collapsedOwners.get(key) ?? key;
    const collapsedOwnersAdded = ownersAddedBySubgraph(collapsedOwners, collapsedOwnerId, collapsedEntry.elements, (k) => k === key || hasOwn(prevSubgraphs, k));
    if (!collapsedOwnersAdded)
        return null;
    for (const [k, v] of rawOwnersAdded)
        rawOwners.set(k, v);
    for (const [k, v] of collapsedOwnersAdded)
        collapsedOwners.set(k, v);
    setOwnProp(sanitized, key, entry);
    if (onlyFolderRef)
        singleFolderRefs.add(onlyFolderRef);
    if (hostsFolders)
        noteFolderHosts(folderHosts, key, els);
    keep.lazyKeys = lazyKeys;
    keep.lazyValues = [...keep.lazyValues, sg];
    const subgraphs = Object.create(null);
    for (const [k, v] of Object.entries(prevSubgraphs))
        setOwnProp(subgraphs, k, v);
    setOwnProp(subgraphs, key, collapsedEntry);
    return {
        raw,
        model: { ...prev.model, subgraphs },
        aliases: prev.aliases,
        validation,
        added: { from: prev.model, key, owner: collapsedOwnerId, elements: collapsedEntry.elements },
    };
}
export function extendMapParentIndex(prev, owner, elements) {
    const parentOf = new Map(prev);
    indexInlineParents(parentOf, owner, elements, 0);
    return parentOf;
}
function parentsAddedBy(prev, owner, elements) {
    const added = new Map();
    indexInlineParents({ has: (k) => prev.has(k) || added.has(k), set: (k, v) => added.set(k, v) }, owner, elements, 0);
    return added;
}
export function levelForFocus(fid, model, parentOf = buildMapParentIndex(model)) {
    if (isLevel3Focus(fid, model))
        return 3;
    const seen = new Set([fid]);
    let cur = fid;
    let extraDepth = 0;
    while (seen.size < MAX_TREE_DEPTH) {
        const p = parentOf.get(cur);
        if (!p || seen.has(p) || isLevel3Focus(p, model)) {
            return 5 + extraDepth;
        }
        seen.add(p);
        if (isLevel3Focus(cur, model)) {
            return 3 + extraDepth;
        }
        extraDepth += 1;
        cur = p;
    }
    return 5 + extraDepth;
}
function fnvFeedStr(h, s) {
    let out = h;
    for (let i = 0; i < s.length; i++) {
        out = Math.imul(out ^ s.charCodeAt(i), 0x01000193) >>> 0;
    }
    return Math.imul(out ^ 0xff, 0x01000193) >>> 0;
}
const PARENT_TABLES_CACHE = new WeakMap();
function parentTablesStamp(parentOf) {
    let stamp = 0x811c9dc5;
    for (const [c, p] of parentOf) {
        stamp = fnvFeedStr(fnvFeedStr(stamp, c), p);
    }
    return stamp;
}
function getParentTables(parentOf, verify = false) {
    const cached = PARENT_TABLES_CACHE.get(parentOf);
    if (cached && cached.size === parentOf.size && !verify)
        return cached;
    const stamp = verify ? parentTablesStamp(parentOf) : null;
    if (cached && cached.size === parentOf.size && cached.stamp === stamp)
        return cached;
    const kidsOf = new Map();
    for (const [c, p] of parentOf) {
        let arr = kidsOf.get(p);
        if (!arr) {
            arr = [];
            kidsOf.set(p, arr);
        }
        arr.push(c);
    }
    const tables = {
        stamp,
        size: parentOf.size,
        kidsOf,
    };
    PARENT_TABLES_CACHE.set(parentOf, tables);
    return tables;
}
const LINK_ADJACENCY_CACHE = new WeakMap();
function linkAdjacencyStamp(links) {
    const len = links.length;
    let stamp = 0x811c9dc5;
    for (let i = 0; i < len; i++) {
        const l = links[i];
        if (!l || typeof l !== "object")
            continue;
        stamp = fnvFeedStr(stamp, typeof l.from === "string" ? l.from : "");
        stamp = fnvFeedStr(stamp, typeof l.to === "string" ? l.to : "");
        stamp = fnvFeedStr(stamp, typeof l.kind === "string" ? l.kind : "");
        stamp = Math.imul(stamp ^ (l.stop ? 0x31 : 0x30), 0x01000193) >>> 0;
    }
    return stamp;
}
function getLinkAdjacency(links, verify = false) {
    if (!Array.isArray(links)) {
        return {
            len: 0,
            stamp: 0,
            validLinks: [],
            into: new Map(),
            outByFrom: new Map(),
        };
    }
    const len = links.length;
    const cached = LINK_ADJACENCY_CACHE.get(links);
    if (cached && cached.len === len && !verify)
        return cached;
    const stamp = verify ? linkAdjacencyStamp(links) : null;
    if (cached && cached.len === len && cached.stamp === stamp)
        return cached;
    const validLinks = [];
    const into = new Map();
    const outByFrom = new Map();
    for (const l of asObjArray(links)) {
        if (typeof l.from !== "string" || typeof l.to !== "string" || !l.from || !l.to)
            continue;
        validLinks.push(l);
        let arr = into.get(l.to);
        if (!arr) {
            arr = [];
            into.set(l.to, arr);
        }
        arr.push(l);
        if (l.from !== l.to) {
            let outArr = outByFrom.get(l.from);
            if (!outArr) {
                outArr = [];
                outByFrom.set(l.from, outArr);
            }
            outArr.push(l);
        }
    }
    const built = {
        len,
        stamp,
        validLinks,
        into,
        outByFrom,
    };
    LINK_ADJACENCY_CACHE.set(links, built);
    return built;
}
export function mapAncestorsOf(id, parentOf) {
    const chain = [];
    const seen = new Set();
    let x = id;
    while (x && !seen.has(x) && chain.length < MAX_TREE_DEPTH) {
        seen.add(x);
        chain.push(x);
        x = parentOf.get(x);
    }
    return chain;
}
export function liftToSet(id, set, parentOf) {
    for (const a of mapAncestorsOf(id, parentOf))
        if (set.has(a))
            return a;
    return null;
}
function linkCoverAncestors(id, ctx, chainEnd) {
    const set = new Set();
    const chain = mapAncestorsOf(id, ctx.parentOf);
    for (const anc of chain) {
        set.add(anc);
        if (ctx.boundary && ctx.l2ContainerIds.has(anc))
            set.add(ctx.boundary);
        const hs = ctx.hostsByElement.get(anc);
        if (hs) {
            for (const hid of hs)
                set.add(hid);
        }
    }
    if (chainEnd)
        chainEnd.id = chain.length > 0 ? chain[chain.length - 1] : "";
    return [...set];
}
function coverLinkPairs(link, idx, ctx, pairs, byEnd, fresh) {
    const end = byEnd ? { id: "" } : undefined;
    const fromAncs = linkCoverAncestors(link.from, ctx, end);
    if (byEnd && end)
        noteLinkChainEnd(byEnd, end.id, idx);
    const toAncs = linkCoverAncestors(link.to, ctx, end);
    if (byEnd && end)
        noteLinkChainEnd(byEnd, end.id, idx);
    for (const fa of fromAncs) {
        for (const ta of toAncs) {
            const pk = `${fa}\u0000${ta}`;
            if (fresh && !pairs.has(pk))
                fresh.add(pk);
            pairs.add(pk);
        }
    }
}
function noteLinkChainEnd(byEnd, endId, idx) {
    if (!endId)
        return;
    const at = byEnd.get(endId);
    if (!at)
        byEnd.set(endId, [idx]);
    else if (at[at.length - 1] !== idx)
        at.push(idx);
}
function makeBridgePush(out, seen, covered, coveredPairs, alsoSeen) {
    return (from, to, kind, label, violations) => {
        if (typeof from !== "string" || typeof to !== "string" || !from || !to)
            return;
        if (covered && covered.has(to))
            return;
        if (coveredPairs && coveredPairs.has(`${from}\u0000${to}`))
            return;
        const normKind = kind || "uses";
        const key = `${from}\u0000${to}\u0000${normKind}`;
        if (seen.has(key) || (alsoSeen && alsoSeen.has(key)))
            return;
        seen.add(key);
        out.push({
            from,
            to,
            kind: normKind,
            label,
            coupling: "runtime",
            phase: "prod-runtime",
            ...(violations?.length ? { violations } : {}),
        });
    };
}
function pushBridgedRels(push, rawRels, includePlanned) {
    for (const r of asObjArray(rawRels)) {
        if (!includePlanned && r.status === "planned")
            continue;
        push(r.from, r.to, "uses", r.label, r.violations);
    }
}
function pushBridgedModelRels(push, model, includePlanned) {
    pushBridgedRels(push, model?.level1?.rels, includePlanned);
    pushBridgedRels(push, model?.level2?.rels, includePlanned);
    if (isPlainRecord(model?.level3)) {
        for (const [pid, rawKids] of Object.entries(model.level3)) {
            const kids = asObjArray(rawKids);
            kids.forEach((k, idx) => {
                if (!includePlanned && k.status === "planned")
                    return;
                if (typeof k.next === "number" && Number.isInteger(k.next) && k.next >= 0 && k.next < kids.length) {
                    const fromId = (typeof k.id === "string" && k.id) || `${pid}/${idx}`;
                    const toId = (typeof kids[k.next].id === "string" && kids[k.next].id) || `${pid}/${k.next}`;
                    push(fromId, toId, "uses");
                }
            });
        }
    }
    if (isPlainRecord(model?.subgraphs)) {
        for (const sg of Object.values(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            pushBridgedRels(push, sg.rels, includePlanned);
        }
    }
}
function pushBridgedDeploymentLinks(push, model, includePlanned) {
    for (const l of asObjArray(model?.level4?.links)) {
        if (!includePlanned && l.state === "planned")
            continue;
        push(l.from, l.to, l.kind || "uses", l.label);
    }
}
const MODEL_LINKS_KEEP = new WeakMap();
const bridgedLinkKey = (l) => `${l.from}\u0000${l.to}\u0000${l.kind || "uses"}`;
export function extractModelLinks(model, opts = {}) {
    return buildModelLinks(model, opts);
}
function buildModelLinks(model, opts, keepInto) {
    const includePlanned = opts.includePlanned ?? false;
    const rawLinks = resolveModelRawLinks(model);
    const hasCodeLinks = rawLinks.length > 0;
    if (hasCodeLinks && !opts.includeC4Rels && opts.bridgeUncovered === false) {
        return rawLinks;
    }
    let covered = null;
    let coveredPairs = null;
    let cover;
    if (hasCodeLinks && !opts.includeC4Rels) {
        const subgraphOwners = collectSubgraphOwners(model);
        const parentOf = opts.parentOf ?? buildMapParentIndex(model);
        const hostBridge = buildHostBridge(model, subgraphOwners);
        const l2ContainerIds = new Set(asObjArray(model?.level2?.elements)
            .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
            .map((e) => e.id));
        const boundary = typeof model?.level2?.boundary === "string" ? model.level2.boundary : "";
        const ctx = { parentOf, boundary, l2ContainerIds, hostsByElement: hostBridge.hostsByElement };
        if (opts.bridgeUncoveredPairs) {
            coveredPairs = new Set();
            const byEnd = keepInto ? new Map() : undefined;
            for (let i = 0; i < rawLinks.length; i++) {
                const l = rawLinks[i];
                if (TUX_MAP_QUIET_LINK_KINDS.has(l.kind || ""))
                    continue;
                coverLinkPairs(l, i, ctx, coveredPairs, byEnd);
            }
            if (byEnd)
                cover = { ctx, pairs: coveredPairs, byEnd };
        }
        else {
            covered = new Set();
            const markCovered = (id) => {
                for (const anc of mapAncestorsOf(id, parentOf)) {
                    covered.add(anc);
                    if (boundary && l2ContainerIds.has(anc))
                        covered.add(boundary);
                    const hs = hostBridge.hostsByElement.get(anc);
                    if (hs) {
                        for (const hid of hs)
                            covered.add(hid);
                    }
                }
            };
            for (const l of rawLinks) {
                markCovered(l.from);
                markCovered(l.to);
            }
        }
    }
    const seen = new Set(rawLinks.map(bridgedLinkKey));
    if (keepInto && opts.bridgeUncoveredPairs) {
        const rels = [];
        pushBridgedModelRels(makeBridgePush(rels, seen, null, coveredPairs), model, includePlanned);
        const deployment = [];
        pushBridgedDeploymentLinks(makeBridgePush(deployment, new Set(), null, coveredPairs, seen), model, includePlanned);
        keepInto.keep = {
            model,
            includePlanned,
            parentOf: cover ? cover.ctx.parentOf : (opts.parentOf ?? new Map()),
            rawLinks,
            cover,
            rels,
            seen,
        };
        return [...rawLinks, ...rels, ...deployment];
    }
    const out = [...rawLinks];
    const push = makeBridgePush(out, seen, covered, coveredPairs);
    pushBridgedModelRels(push, model, includePlanned);
    pushBridgedDeploymentLinks(push, model, includePlanned);
    return out;
}
function someElementDeployed(rawEls, depth = 0) {
    if (depth >= MAX_TREE_DEPTH)
        return false;
    for (const e of asObjArray(rawEls)) {
        if (e.deployed)
            return true;
        if (Array.isArray(e.children) && e.children.length > 0 && someElementDeployed(e.children, depth + 1))
            return true;
    }
    return false;
}
function extendModelLinks(prev, keep, model, parentOf, added) {
    const sg = isPlainRecord(model.subgraphs) && hasOwn(model.subgraphs, added.key) ? model.subgraphs[added.key] : undefined;
    if (!isPlainRecord(sg))
        return null;
    const cover = keep.cover;
    if (cover && someElementDeployed(added.elements))
        return null;
    const fresh = new Set();
    if (cover) {
        const newlyParented = parentsAddedBy(keep.parentOf, added.owner, added.elements);
        cover.ctx.parentOf = parentOf;
        const affected = new Set();
        for (const id of newlyParented.keys()) {
            const at = cover.byEnd.get(id);
            if (!at)
                continue;
            cover.byEnd.delete(id);
            for (const idx of at)
                affected.add(idx);
        }
        for (const idx of affected)
            coverLinkPairs(keep.rawLinks[idx], idx, cover.ctx, cover.pairs, cover.byEnd, fresh);
    }
    const rels = fresh.size > 0 ? keep.rels.filter((l) => !fresh.has(`${l.from}\u0000${l.to}`)) : keep.rels;
    const before = rels.length;
    pushBridgedRels(makeBridgePush(rels, keep.seen, null, cover ? cover.pairs : null), sg.rels, keep.includePlanned);
    keep.rels = rels;
    keep.model = model;
    keep.parentOf = parentOf;
    if (fresh.size === 0 && rels.length === before)
        return prev;
    const deployment = [];
    pushBridgedDeploymentLinks(makeBridgePush(deployment, new Set(), null, cover ? cover.pairs : null, keep.seen), model, keep.includePlanned);
    return [...keep.rawLinks, ...rels, ...deployment];
}
export function extractModelLinksKept(model, opts, prev, added) {
    const includePlanned = opts.includePlanned ?? false;
    const keep = prev ? MODEL_LINKS_KEEP.get(prev) : undefined;
    if (prev && keep) {
        MODEL_LINKS_KEEP.delete(prev);
        if (added && keep.model === added.from && keep.includePlanned === includePlanned) {
            const next = extendModelLinks(prev, keep, model, opts.parentOf, added);
            if (next) {
                MODEL_LINKS_KEEP.set(next, keep);
                return next;
            }
        }
    }
    const into = {};
    const out = buildModelLinks(model, { includePlanned, bridgeUncoveredPairs: true, parentOf: opts.parentOf }, into);
    if (into.keep)
        MODEL_LINKS_KEEP.set(out, into.keep);
    return out;
}
export const TUX_MAP_WIRE_CATEGORIES = [
    "prod",
    "tests",
    "ci",
    "docs",
];
export function classifyLinkDependencyCategory(link) {
    const k = link.kind || "uses";
    if (k === "mentions")
        return "docs";
    const c = inferLinkCoupling(link);
    const p = inferLinkPhase(link);
    if (c === "prose" || p === "doc-only")
        return "docs";
    if (isPureDocNode(link.from) || isPureDocNode(link.to))
        return "docs";
    if (k === "checks" ||
        k === "suppresses" ||
        c === "build-exec" ||
        p === "build-exec" ||
        isWorkflowPathNode(link.from) ||
        isWorkflowPathNode(link.to)) {
        return "ci";
    }
    if (k === "tests" || c === "verification" || p === "ci-test" || TEST_ONLY_PATH_RE.test(repoPathForNodeId(link.from))) {
        return "tests";
    }
    return "prod";
}
const LINK_CATEGORY_CACHE = new WeakMap();
export function filterLinksByCategories(links, categories) {
    const catSet = categories instanceof Set ? categories : new Set(categories);
    if (catSet.size === 0)
        return [];
    if (catSet.has("prod") &&
        catSet.has("tests") &&
        catSet.has("ci") &&
        catSet.has("docs")) {
        return [...links];
    }
    return links.filter((l) => {
        let c = LINK_CATEGORY_CACHE.get(l);
        if (!c)
            LINK_CATEGORY_CACHE.set(l, (c = classifyLinkDependencyCategory(l)));
        return catSet.has(c);
    });
}
function sortKindEntries(kinds) {
    return [...kinds.entries()].sort((a, b) => b[1] - a[1] || linkStrengthRank(a[0]) - linkStrengthRank(b[0]) || cmpCodepoint(a[0], b[0]));
}
function topKinds(kinds) {
    return sortKindEntries(kinds)
        .slice(0, 2)
        .map(([k]) => k)
        .join(", ");
}
function buildWireInspectorDetail(from, to, kinds, linksList) {
    const sorted = sortKindEntries(kinds);
    const perKindCounts = sorted.map(([kind, count]) => ({
        kind,
        count,
        label: (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) && TUX_MAP_LINK_KIND_LABELS[kind]) || kind,
    }));
    const cutKinds = perKindCounts.slice(2);
    const violations = [];
    const seenViol = new Set();
    const items = linksList.map((l) => {
        const vList = Array.isArray(l.violations) ? l.violations : undefined;
        if (vList) {
            for (const v of vList) {
                if (!v || typeof v.rule !== "string")
                    continue;
                const vk = `${v.rule}\u0000${v.message ?? ""}\u0000${v.fix ?? ""}`;
                if (!seenViol.has(vk)) {
                    seenViol.add(vk);
                    violations.push(v);
                }
            }
        }
        return {
            from: l.from,
            to: l.to,
            kind: l.kind || "uses",
            ...(l.at ? { at: l.at } : {}),
            ...(l.sites?.length ? { sites: [...l.sites] } : {}),
            ...(l.stop ? { stop: true } : {}),
            ...(vList?.length ? { violations: vList } : {}),
        };
    });
    const totalCount = perKindCounts.reduce((acc, item) => acc + item.count, 0);
    return {
        from,
        to,
        totalCount,
        perKindCounts,
        cutKinds,
        links: items,
        violations,
    };
}
export function liftLinksToView(links, focusId, kidIds, parentOf, opts = {}) {
    const quiet = opts.quiet ?? TUX_MAP_QUIET_LINK_KINDS;
    const isKnown = opts.isKnown ?? ((id) => parentOf.has(id));
    const liftMode = opts.lift ?? "depth";
    const max = opts.maxPerSide ?? (liftMode === "lca" ? 12 : 8);
    const splitSet = opts.splitIds
        ? opts.splitIds instanceof Set
            ? opts.splitIds
            : new Set(opts.splitIds)
        : null;
    const catSet = opts.categories
        ? opts.categories instanceof Set
            ? opts.categories
            : new Set(opts.categories)
        : null;
    const kids = new Set(kidIds);
    const focusAncs = mapAncestorsOf(focusId, parentOf);
    const focusChain = new Set(focusAncs);
    const kidDepth = focusAncs.length + 1;
    const resolveDepth = (id) => {
        if (!isKnown(id))
            return null;
        const chain = mapAncestorsOf(id, parentOf);
        let pick = null;
        for (const a of chain) {
            if (focusChain.has(a))
                break;
            pick = a;
            if (mapAncestorsOf(a, parentOf).length <= kidDepth)
                break;
        }
        if (!pick)
            return null;
        if (liftMode === "lca" && splitSet && splitSet.size > 0 && pick !== id) {
            const subChain = [];
            for (const a of chain) {
                subChain.push(a);
                if (a === pick)
                    break;
            }
            subChain.reverse();
            let idx = 0;
            while (idx + 1 < subChain.length && splitSet.has(subChain[idx])) {
                idx += 1;
            }
            const chosen = subChain[idx];
            return { id: chosen, splittable: idx + 1 < subChain.length };
        }
        return { id: pick, splittable: liftMode === "lca" && pick !== id };
    };
    const resolveLcaRaw = (id) => {
        if (!isKnown(id))
            return null;
        const chain = mapAncestorsOf(id, parentOf);
        const outsideChainTopDown = [];
        for (const a of chain) {
            if (focusChain.has(a))
                break;
            outsideChainTopDown.push(a);
        }
        outsideChainTopDown.reverse();
        if (outsideChainTopDown.length === 0)
            return null;
        let idx = 0;
        if (splitSet && splitSet.size > 0) {
            while (idx + 1 < outsideChainTopDown.length && splitSet.has(outsideChainTopDown[idx])) {
                idx += 1;
            }
        }
        const picked = outsideChainTopDown[idx];
        return { id: picked, splittable: idx + 1 < outsideChainTopDown.length };
    };
    const sib = new Map();
    const insM = new Map();
    const outsM = new Map();
    const recordSide = (m, o, leafId, kid, l) => {
        const kind = l.kind || "uses";
        let bucket = m.get(o.id);
        if (!bucket) {
            bucket = {
                byKid: new Map(),
                leafParts: new Set(),
                allKinds: new Map(),
                allLinks: [],
                splittable: false,
                spreading: 0,
            };
            m.set(o.id, bucket);
        }
        bucket.leafParts.add(leafId);
        if (o.splittable)
            bucket.splittable = true;
        bucket.allKinds.set(kind, (bucket.allKinds.get(kind) ?? 0) + 1);
        bucket.allLinks.push(l);
        if (!l.stop)
            bucket.spreading += 1;
        let kidEntry = bucket.byKid.get(kid);
        if (!kidEntry) {
            kidEntry = { kinds: new Map(), links: [] };
            bucket.byKid.set(kid, kidEntry);
        }
        kidEntry.kinds.set(kind, (kidEntry.kinds.get(kind) ?? 0) + 1);
        kidEntry.links.push(l);
    };
    const pendingIns = [];
    const pendingOuts = [];
    const adj = getLinkAdjacency(links, opts.verifyInputs === true);
    for (const l of adj.validLinks) {
        const kind = l.kind || "uses";
        if (quiet.has(kind) && !(catSet && catSet.has("docs")))
            continue;
        if (catSet && !catSet.has(classifyLinkDependencyCategory(l)))
            continue;
        const a = liftToSet(l.from, kids, parentOf);
        const b = liftToSet(l.to, kids, parentOf);
        if (a && b) {
            if (a === b)
                continue;
            const key = `${a}\u0000${b}`;
            let r = sib.get(key);
            if (!r) {
                r = { from: a, to: b, kinds: new Map(), links: [] };
                sib.set(key, r);
            }
            r.kinds.set(kind, (r.kinds.get(kind) ?? 0) + 1);
            r.links.push(l);
        }
        else if (a) {
            const o = liftMode === "lca" ? resolveLcaRaw(l.to) : resolveDepth(l.to);
            if (o)
                pendingOuts.push({ raw: o, leafId: l.to, kid: a, link: l });
        }
        else if (b) {
            const o = liftMode === "lca" ? resolveLcaRaw(l.from) : resolveDepth(l.from);
            if (o)
                pendingIns.push({ raw: o, leafId: l.from, kid: b, link: l });
        }
    }
    const flushSideHits = (pending, targetMap) => {
        if (pending.length === 0)
            return;
        if (liftMode !== "lca") {
            for (const h of pending)
                recordSide(targetMap, h.raw, h.leafId, h.kid, h.link);
            return;
        }
        const leavesByRaw = new Map();
        for (const h of pending) {
            let s = leavesByRaw.get(h.raw.id);
            if (!s) {
                s = new Set();
                leavesByRaw.set(h.raw.id, s);
            }
            s.add(h.leafId);
        }
        for (const h of pending) {
            const leafCount = leavesByRaw.get(h.raw.id)?.size ?? 0;
            const resolved = leafCount === 1 ? resolveDepth(h.leafId) ?? h.raw : h.raw;
            recordSide(targetMap, resolved, h.leafId, h.kid, h.link);
        }
    };
    flushSideHits(pendingIns, insM);
    flushSideHits(pendingOuts, outsM);
    const wireDetails = Object.create(null);
    const rels = [...sib.values()].map((r) => {
        const detail = buildWireInspectorDetail(r.from, r.to, r.kinds, r.links);
        setOwnProp(wireDetails, `${r.from}\u0000${r.to}`, detail);
        return {
            from: r.from,
            to: r.to,
            label: topKinds(r.kinds),
            ...(detail.violations.length > 0 ? { violations: detail.violations } : {}),
        };
    });
    const buildSides = (which, m) => [...m.entries()]
        .map(([id, bucket]) => {
        const frameFrom = which === "ins" ? id : "@bound";
        const frameTo = which === "ins" ? "@bound" : id;
        const frameDetail = buildWireInspectorDetail(frameFrom, frameTo, bucket.allKinds, bucket.allLinks);
        setOwnProp(wireDetails, `${frameFrom}\u0000${frameTo}`, frameDetail);
        const wires = [...bucket.byKid.entries()].map(([kid, ke]) => {
            const wFrom = which === "ins" ? id : kid;
            const wTo = which === "ins" ? kid : id;
            const wDetail = buildWireInspectorDetail(wFrom, wTo, ke.kinds, ke.links);
            setOwnProp(wireDetails, `${wFrom}\u0000${wTo}`, wDetail);
            return {
                kid,
                label: topKinds(ke.kinds),
                ...(wDetail.violations.length > 0 ? { violations: wDetail.violations } : {}),
            };
        });
        const base = {
            id,
            count: frameDetail.totalCount,
            spreading: bucket.spreading,
            wires,
        };
        if (liftMode === "lca") {
            base.parts = bucket.leafParts.size;
            base.splittable = bucket.splittable;
        }
        return base;
    })
        .sort((x, y) => Number(y.spreading > 0) - Number(x.spreading > 0) ||
        y.count - x.count ||
        x.id.localeCompare(y.id));
    const insAll = buildSides("ins", insM);
    const outsAll = buildSides("outs", outsM);
    const insOverflow = insAll.slice(max);
    const outsOverflow = outsAll.slice(max);
    return {
        rels,
        ins: insAll.slice(0, max),
        outs: outsAll.slice(0, max),
        moreIns: insOverflow.length,
        moreOuts: outsOverflow.length,
        moreInsParts: insOverflow.reduce((acc, s) => acc + (s.parts ?? 1), 0),
        moreOutsParts: outsOverflow.reduce((acc, s) => acc + (s.parts ?? 1), 0),
        moreInsLinks: insOverflow.reduce((acc, s) => acc + s.count, 0),
        moreOutsLinks: outsOverflow.reduce((acc, s) => acc + s.count, 0),
        overflowInIds: insOverflow.map((s) => s.id),
        overflowOutIds: outsOverflow.map((s) => s.id),
        wireDetails,
    };
}
export function buildVendoredCopyIndex(links, elKindById) {
    const NON_FOLDABLE_KINDS = new Set(["route", "person", "system", "database", "external"]);
    const safeLinks = asObjArray(links);
    const nonCopyPairs = new Set();
    for (const l of safeLinks) {
        if (!l.from || !l.to || l.from === l.to)
            continue;
        const k = l.kind || "uses";
        if (k !== "copies" && k !== "provenance" && k !== "stamps") {
            nonCopyPairs.add(`${l.from}\u0000${l.to}`);
        }
    }
    const isNonFoldableEndpoint = (id) => {
        if (isKindNodeId(id, "r"))
            return true;
        const ek = elKindById?.get(id);
        return Boolean(ek && NON_FOLDABLE_KINDS.has(ek));
    };
    const copyToSource = new Map();
    for (const l of safeLinks) {
        if (l.kind === "copies" && l.from && l.to && l.from !== l.to) {
            if (isNonFoldableEndpoint(l.from) || isNonFoldableEndpoint(l.to))
                continue;
            if (nonCopyPairs.has(`${l.from}\u0000${l.to}`))
                continue;
            if (!copyToSource.has(l.from))
                copyToSource.set(l.from, l.to);
        }
    }
    const copyToCanonical = new Map();
    const copiesByCanonical = new Map();
    if (copyToSource.size === 0) {
        return { copyToCanonical, copiesByCanonical };
    }
    const memo = new Map();
    const resolveCanonical = (startId) => {
        const hit = memo.get(startId);
        if (hit !== undefined)
            return hit;
        const trail = [startId];
        const pos = new Map([[startId, 0]]);
        let cur = startId;
        while (copyToSource.has(cur) && trail.length <= MAX_TREE_DEPTH) {
            const nxt = copyToSource.get(cur);
            if (memo.has(nxt)) {
                cur = memo.get(nxt);
                break;
            }
            const cycIdx = pos.get(nxt);
            if (cycIdx !== undefined) {
                const cycleMembers = trail.slice(cycIdx);
                cycleMembers.sort(cmpCodepoint);
                cur = cycleMembers[0];
                break;
            }
            pos.set(nxt, trail.length);
            trail.push(nxt);
            cur = nxt;
        }
        for (const tid of trail)
            memo.set(tid, cur);
        return cur;
    };
    for (const cid of copyToSource.keys()) {
        const canon = resolveCanonical(cid);
        if (canon === cid)
            continue;
        copyToCanonical.set(cid, canon);
        let bucket = copiesByCanonical.get(canon);
        if (!bucket) {
            bucket = [];
            copiesByCanonical.set(canon, bucket);
        }
        bucket.push(cid);
    }
    for (const arr of copiesByCanonical.values())
        arr.sort(cmpCodepoint);
    return { copyToCanonical, copiesByCanonical };
}
export function foldVendoredCopies(elements, rels, links) {
    if (elements.length === 0) {
        return {
            elements: [],
            rels: [...rels],
            links: [...links],
            foldedToRepresentative: new Map(),
        };
    }
    const elKindById = new Map();
    for (const e of asObjArray(elements)) {
        if (e.id && e.kind)
            elKindById.set(e.id, e.kind);
    }
    const { copyToCanonical } = buildVendoredCopyIndex(links, elKindById);
    if (copyToCanonical.size === 0) {
        return {
            elements: [...elements],
            rels: [...rels],
            links: [...links],
            foldedToRepresentative: new Map(),
        };
    }
    const viewIds = new Set();
    const inViewCopiesByCanon = new Map();
    for (const e of elements) {
        viewIds.add(e.id);
        const canon = copyToCanonical.get(e.id);
        if (canon && canon !== e.id) {
            let arr = inViewCopiesByCanon.get(canon);
            if (!arr) {
                arr = [];
                inViewCopiesByCanon.set(canon, arr);
            }
            arr.push(e.id);
        }
    }
    if (inViewCopiesByCanon.size === 0) {
        return {
            elements: [...elements],
            rels: [...rels],
            links: [...links],
            foldedToRepresentative: new Map(),
        };
    }
    const repByCanon = new Map();
    const foldedCopiesByRep = new Map();
    const externalCanonByRep = new Map();
    const foldedToRepresentative = new Map();
    for (const [canon, inViewCopies] of inViewCopiesByCanon.entries()) {
        if (viewIds.has(canon)) {
            repByCanon.set(canon, canon);
            foldedCopiesByRep.set(canon, inViewCopies);
            for (const cid of inViewCopies) {
                foldedToRepresentative.set(cid, canon);
            }
        }
        else {
            const rep = inViewCopies[0];
            repByCanon.set(canon, rep);
            externalCanonByRep.set(rep, canon);
            const siblingFolded = inViewCopies.slice(1);
            foldedCopiesByRep.set(rep, siblingFolded);
            for (const cid of siblingFolded) {
                foldedToRepresentative.set(cid, rep);
            }
        }
    }
    const outElements = [];
    for (const e of elements) {
        if (foldedToRepresentative.has(e.id))
            continue;
        const extCanon = externalCanonByRep.get(e.id);
        const copies = foldedCopiesByRep.get(e.id);
        if (extCanon) {
            outElements.push({
                ...e,
                isVendoredCopy: true,
                vendoredFrom: extCanon,
                ...(copies && copies.length > 0 ? { vendoredCopies: copies } : {}),
            });
        }
        else if (copies && copies.length > 0) {
            outElements.push({
                ...e,
                isVendoredCopy: true,
                vendoredCopies: copies,
            });
        }
        else {
            outElements.push(e);
        }
    }
    const remapId = (id) => foldedToRepresentative.get(id) ?? id;
    const seenRelPairs = new Set();
    const outRels = [];
    for (const r of rels) {
        const from = remapId(r.from);
        const to = remapId(r.to);
        if (from === to)
            continue;
        const key = `${from}\u0000${to}`;
        if (seenRelPairs.has(key))
            continue;
        seenRelPairs.add(key);
        outRels.push(from === r.from && to === r.to ? r : { ...r, from, to });
    }
    const seenLinks = new Set();
    const outLinks = [];
    for (const l of links) {
        if (l.kind === "copies" && (foldedToRepresentative.has(l.from) || foldedCopiesByRep.has(l.to))) {
            const rf = remapId(l.from);
            const rt = remapId(l.to);
            if (rf === rt)
                continue;
        }
        const from = remapId(l.from);
        const to = remapId(l.to);
        if (from === to)
            continue;
        const key = `${from}\u0000${to}\u0000${l.kind || "uses"}`;
        if (seenLinks.has(key))
            continue;
        seenLinks.add(key);
        outLinks.push(from === l.from && to === l.to ? l : { ...l, from, to });
    }
    return {
        elements: outElements,
        rels: outRels,
        links: outLinks,
        foldedToRepresentative,
    };
}
export function traceSpreadingPath(fromId, toId, model, opts = {}) {
    if (!fromId || !toId)
        return { found: false, nodeIds: [], hops: [] };
    if (fromId === toId)
        return { found: true, nodeIds: [fromId], hops: [] };
    const parentOf = buildMapParentIndex(model);
    const { kidsOf } = getParentTables(parentOf);
    const links = extractModelLinks(model, { parentOf });
    const { outByFrom } = getLinkAdjacency(links);
    const expandSubtree = (root) => {
        const set = new Set([root]);
        const q = [root];
        for (let i = 0; i < q.length && set.size < 4096; i++) {
            for (const ch of kidsOf.get(q[i]) ?? []) {
                if (!set.has(ch)) {
                    set.add(ch);
                    q.push(ch);
                }
            }
        }
        return set;
    };
    const startSet = expandSubtree(fromId);
    const targetSet = expandSubtree(toId);
    const allowStopFirst = opts.allowStoppingLastHop ?? false;
    const runSearch = (permitInitialStop) => {
        const visited = new Set(startSet);
        const prev = new Map();
        const queue = [...startSet].sort(cmpCodepoint).map((id) => ({ id, depth: 0 }));
        let hitTarget = null;
        for (let qi = 0; qi < queue.length; qi++) {
            const { id: cur, depth } = queue[qi];
            const outLinks = [...(outByFrom.get(cur) ?? [])].sort((a, b) => {
                const as = a.stop ? 1 : 0;
                const bs = b.stop ? 1 : 0;
                if (as !== bs)
                    return as - bs;
                return compareBlastLinks(a, b);
            });
            for (const l of outLinks) {
                const k = l.kind || "uses";
                if (TUX_MAP_QUIET_LINK_KINDS.has(k))
                    continue;
                if (l.stop && !(permitInitialStop && depth === 0))
                    continue;
                const nxt = l.to;
                if (visited.has(nxt))
                    continue;
                visited.add(nxt);
                prev.set(nxt, { prevId: cur, link: l });
                if (targetSet.has(nxt)) {
                    hitTarget = nxt;
                    break;
                }
                queue.push({ id: nxt, depth: depth + 1 });
            }
            if (hitTarget)
                break;
        }
        if (!hitTarget)
            return null;
        const nodeIds = [hitTarget];
        const hops = [];
        let cursor = hitTarget;
        while (prev.has(cursor)) {
            const step = prev.get(cursor);
            const kind = step.link.kind || "uses";
            hops.unshift({
                from: step.prevId,
                to: cursor,
                kind,
                label: TUX_MAP_LINK_KIND_LABELS[kind] || step.link.label || kind,
                ...(step.link.at ? { at: step.link.at } : {}),
            });
            nodeIds.unshift(step.prevId);
            cursor = step.prevId;
        }
        if (nodeIds[0] !== fromId && startSet.has(nodeIds[0])) {
            nodeIds.unshift(fromId);
        }
        if (nodeIds[nodeIds.length - 1] !== toId && targetSet.has(nodeIds[nodeIds.length - 1])) {
            nodeIds.push(toId);
        }
        return { found: true, nodeIds, hops };
    };
    return runSearch(false) ?? (allowStopFirst ? runSearch(true) : null) ?? { found: false, nodeIds: [], hops: [] };
}
function buildHostBridge(model, subgraphOwners) {
    const hostsByElement = new Map();
    const elementsByHost = new Map();
    const linkHost = (elId, hostId) => {
        if (typeof elId !== "string" || typeof hostId !== "string" || !elId || !hostId)
            return;
        let hs = hostsByElement.get(elId);
        if (!hs) {
            hs = new Set();
            hostsByElement.set(elId, hs);
        }
        hs.add(hostId);
        let es = elementsByHost.get(hostId);
        if (!es) {
            es = new Set();
            elementsByHost.set(hostId, es);
        }
        es.add(elId);
    };
    const normArr = (v) => {
        if (!v)
            return [];
        if (Array.isArray(v))
            return v.filter((x) => typeof x === "string" && Boolean(x));
        return typeof v === "string" ? [v] : [];
    };
    const visitEls = (rawEls, pid, depth = 0) => {
        if (depth >= MAX_TREE_DEPTH)
            return;
        const els = asObjArray(rawEls);
        els.forEach((e, idx) => {
            const id = (typeof e.id === "string" && e.id) || (pid ? `${pid}/${idx}` : "");
            if (!id)
                return;
            for (const h of normArr(e.deployed))
                linkHost(id, h);
            if (Array.isArray(e.children) && e.children.length > 0)
                visitEls(e.children, id, depth + 1);
        });
    };
    visitEls(model?.level1?.elements);
    visitEls(model?.level2?.elements);
    if (isPlainRecord(model?.level3)) {
        for (const [pid, kids] of Object.entries(model.level3))
            visitEls(kids, pid);
    }
    if (isPlainRecord(model?.subgraphs)) {
        for (const [pid, sg] of Object.entries(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            visitEls(sg.elements, subgraphOwners.get(pid) ?? pid);
        }
    }
    for (const dn of asObjArray(model?.level4?.nodes)) {
        if (typeof dn.id !== "string" || !dn.id)
            continue;
        linkHost(dn.id, dn.id);
        for (const h of normArr(dn.hosts))
            linkHost(h, dn.id);
        if (Array.isArray(dn.children) && dn.children.length > 0)
            visitEls(dn.children, dn.id);
    }
    return { hostsByElement, elementsByHost };
}
function buildBlastNodeMeta(model, subgraphOwners) {
    const meta = new Map();
    if (!model || typeof model !== "object")
        return meta;
    const visit = (rawEls, pid, fallbackKind, depth = 0) => {
        if (depth >= MAX_TREE_DEPTH)
            return;
        const els = asObjArray(rawEls);
        els.forEach((e, idx) => {
            if (e.ref && typeof e.id === "string" && meta.has(e.id))
                return;
            const id = (typeof e.id === "string" && e.id) || (pid ? `${pid}/${idx}` : "");
            if (id && !meta.has(id)) {
                meta.set(id, { kind: e.kind || fallbackKind, path: e.source?.path, tech: e.tech });
            }
            if (id && Array.isArray(e.children) && e.children.length > 0) {
                visit(e.children, id, "module", depth + 1);
            }
        });
    };
    visit(model.level1?.elements, undefined, "system");
    visit(model.level2?.elements, model.level2?.boundary, "container");
    if (isPlainRecord(model.level3)) {
        for (const [pid, kids] of Object.entries(model.level3))
            visit(kids, pid, "component");
    }
    for (const dn of asObjArray(model.level4?.nodes)) {
        if (typeof dn.id === "string" && dn.id && !meta.has(dn.id)) {
            meta.set(dn.id, { kind: dn.kind || "resource", path: dn.source?.path, tech: dn.facts?.type });
        }
        if (typeof dn.id === "string" && dn.id && Array.isArray(dn.children) && dn.children.length > 0) {
            visit(dn.children, dn.id, "module");
        }
    }
    if (isPlainRecord(model.subgraphs)) {
        for (const [pid, sg] of Object.entries(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            visit(sg.elements, subgraphOwners.get(pid) ?? pid, "module");
        }
    }
    return meta;
}
const BLAST_MODEL_CACHE = new WeakMap();
function blastModelParts(model) {
    const sg = model.subgraphs;
    return [model.level1, model.level2, model.level3, model.level4, sg, isPlainRecord(sg) ? Object.keys(sg).length : 0];
}
function getBlastModelTables(model, verify) {
    const keyed = model && typeof model === "object" ? model : undefined;
    const parts = keyed ? blastModelParts(keyed) : [];
    const cached = keyed && !verify ? BLAST_MODEL_CACHE.get(keyed) : undefined;
    if (cached && cached.parts.every((p, i) => p === parts[i]))
        return cached;
    const subgraphOwners = collectSubgraphOwners(model);
    const tables = {
        parts,
        hostBridge: keyed ? buildHostBridge(keyed, subgraphOwners) : null,
        subgraphOwners,
        l4NodeIds: new Set(asObjArray(keyed?.level4?.nodes)
            .filter((n) => typeof n.id === "string" && Boolean(n.id))
            .map((n) => n.id)),
    };
    if (keyed)
        BLAST_MODEL_CACHE.set(keyed, tables);
    return tables;
}
function blastNodeMeta(t, model) {
    return (t.metaById ??= buildBlastNodeMeta(model, t.subgraphOwners));
}
function repoPathForNodeId(id, meta) {
    if (meta?.path)
        return meta.path;
    const { repo, kind, rest } = splitNodeId(id);
    if (!kind)
        return "";
    if (kind === "f" || kind === "p") {
        if (kind === "p" && rest.startsWith("pkg:"))
            return "";
        return rest;
    }
    if (kind === "s") {
        if (rest.startsWith("pkg:"))
            return "";
        const hashIdx = rest.lastIndexOf("#");
        return hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
    }
    if (kind === "d") {
        if (repo) {
            const p = rest.split("@", 1)[0] ?? "";
            if (p === "(root)" || p === "(routes)" || p === "x-registries" || p.startsWith("x-registries/")) {
                return "";
            }
            return p;
        }
        const colonIdx = rest.indexOf(":");
        const p = colonIdx >= 0 ? rest.slice(colonIdx + 1) : rest;
        if (p === "(root)" || p === "(routes)" || rest.startsWith("x-registries:")) {
            return "";
        }
        return p;
    }
    return "";
}
function isPureDocNode(id, meta) {
    if (isKindNodeId(id, "s") || meta?.kind === "symbol" || meta?.kind === "function" || meta?.kind === "class") {
        return false;
    }
    if (meta?.tech === "Markdown")
        return true;
    const p = repoPathForNodeId(id, meta).toLowerCase();
    return p.endsWith(".md") || p.endsWith(".mdx") || p.endsWith(".txt") || p.endsWith(".rst");
}
const TEST_ONLY_PATH_RE = /(?:^|\/)(?:tests?|__tests__)\/|(?:^|\/)test_[^/]*$|\.(?:test|spec)\.[^/]+$/i;
const AUX_NON_PROD_PATH_RE = /(?:^|\/)(?:tests?|__tests__|ci)\/|(?:^|\/)test_[^/]*$|\.(?:test|spec)\.[^/]+$|^(?:runner-smoke\/)?\.(?:forgejo|github)\/workflows\//i;
const LOCKFILE_DELTA_RE = /(?:^|\/)(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock|uv\.lock|Cargo\.lock|renv\.lock|packages\.lock\.json|actions\.lock)$|\.(?:lock|sum)$/;
function isAuxNonProdSeed(id, meta) {
    const p = repoPathForNodeId(id, meta);
    if (!p && !isKindNodeId(id, ["f", "s"]))
        return false;
    if (isPureDocNode(id, meta))
        return true;
    return AUX_NON_PROD_PATH_RE.test(p);
}
function isWorkflowPathNode(id, meta) {
    const p = repoPathForNodeId(id, meta);
    return /^(?:runner-smoke\/)?\.(?:forgejo|github)\/workflows\//i.test(p);
}
export function computeLinkBlastRadius(links, seedOrSeeds, parentOf, opts = {}) {
    const { seeds, hits, truncated, kidsOf, into, outByFrom, intent, kindsSet, hostBridge, tables } = walkLinkBlastRadius(links, seedOrSeeds, parentOf, opts);
    const metaById = blastNodeMeta(tables, opts.model);
    const collectSubtree = (rootId) => {
        const sub = new Set([rootId]);
        const queue = [[rootId, 0]];
        for (let qi = 0; qi < queue.length; qi++) {
            const [cur, d] = queue[qi];
            if (d >= MAX_TREE_DEPTH)
                continue;
            for (const ch of kidsOf.get(cur) ?? []) {
                if (!sub.has(ch)) {
                    sub.add(ch);
                    queue.push([ch, d + 1]);
                }
            }
        }
        return sub;
    };
    const canCoCut = (y) => {
        if (seeds.has(y) || isKindNodeId(y, "d"))
            return false;
        const yMeta = metaById.get(y);
        if (yMeta?.kind && NON_AUX_CO_CUT_KINDS.has(yMeta.kind))
            return false;
        if (isWorkflowPathNode(y, yMeta))
            return false;
        const subtree = collectSubtree(y);
        let hasSeedTarget = false;
        let hasNonProseAuxLink = false;
        for (const u of subtree) {
            const uMeta = metaById.get(u);
            if (uMeta?.kind && NON_AUX_CO_CUT_KINDS.has(uMeta.kind))
                return false;
            if (isWorkflowPathNode(u, uMeta))
                return false;
            for (const il of into.get(u) ?? []) {
                if (!seeds.has(il.from) && !subtree.has(il.from))
                    return false;
            }
            for (const ol of outByFrom.get(u) ?? []) {
                if (subtree.has(ol.to))
                    continue;
                if (!seeds.has(ol.to))
                    return false;
                hasSeedTarget = true;
                const ok = ol.kind || "";
                if (ok === "checks")
                    return false;
                const oc = inferLinkCoupling(ol);
                if (oc !== "verification" && oc !== "prose")
                    return false;
                if (oc !== "prose")
                    hasNonProseAuxLink = true;
            }
        }
        if (!hasSeedTarget)
            return false;
        if (!hasNonProseAuxLink && !isPureDocNode(y, yMeta))
            return false;
        return true;
    };
    const blockers = [];
    const coCutCandidates = [];
    const testsToRun = [];
    const stampsToRebuild = [];
    const buildExecImpacted = [];
    for (const [y, hit] of hits) {
        const c = inferLinkCoupling(hit.via);
        const p = inferLinkPhase(hit.via);
        const k = hit.via.kind || "";
        if (hit.hop === 1 && (c === "contract" || c === "runtime" || c === "type-only")) {
            blockers.push(y);
        }
        if (c === "verification" || k === "tests" || k === "checks") {
            testsToRun.push(y);
        }
        if (c === "artifact-stamp" || k === "stamps") {
            stampsToRebuild.push(y);
        }
        if (c === "build-exec" || p === "build-exec") {
            buildExecImpacted.push(y);
        }
        if (intent === "cut" && canCoCut(y)) {
            coCutCandidates.push(y);
        }
    }
    if (intent === "supply-chain") {
        const listed = new Set(buildExecImpacted);
        for (const s of seeds) {
            for (const l of into.get(s) ?? []) {
                const y = l.from;
                if (y === s || listed.has(y))
                    continue;
                if (kindsSet && !kindsSet.has(l.kind || "uses"))
                    continue;
                if (inferLinkCoupling(l) === "build-exec" || inferLinkPhase(l) === "build-exec") {
                    listed.add(y);
                    buildExecImpacted.push(y);
                }
            }
        }
    }
    blockers.sort(cmpCodepoint);
    coCutCandidates.sort(cmpCodepoint);
    testsToRun.sort(cmpCodepoint);
    stampsToRebuild.sort(cmpCodepoint);
    buildExecImpacted.sort(cmpCodepoint);
    const hostsSet = new Set();
    if (hostBridge) {
        const liftHost = (id) => {
            for (const anc of mapAncestorsOf(id, parentOf)) {
                const hs = hostBridge.hostsByElement.get(anc);
                if (hs) {
                    for (const h of hs)
                        hostsSet.add(h);
                }
            }
        };
        for (const s of seeds) {
            if (!isAuxNonProdSeed(s, metaById.get(s)))
                liftHost(s);
        }
        for (const [y, hit] of hits) {
            const p = inferLinkPhase(hit.via);
            const c = inferLinkCoupling(hit.via);
            if (p === "prod-runtime" && !NON_PROD_HOST_COUPLINGS.has(c)) {
                liftHost(y);
            }
        }
    }
    const hostsImpacted = [...hostsSet].sort(cmpCodepoint);
    return {
        seeds,
        hits,
        truncated,
        blockers,
        coCutCandidates,
        testsToRun,
        stampsToRebuild,
        buildExecImpacted,
        hostsImpacted,
    };
}
export function walkLinkBlastRadius(links, seedOrSeeds, parentOf, opts = {}) {
    const rawMaxHops = opts.maxHops === undefined ? 32 : opts.maxHops;
    const maxHops = Number.isFinite(rawMaxHops) ? Math.max(0, Math.floor(rawMaxHops)) : 32;
    const quietSeedOnly = opts.quietSeedOnly ?? true;
    const intent = opts.intent ?? "default";
    if (!TUX_MAP_VALID_BLAST_INTENTS.has(intent)) {
        throw new RangeError(`Invalid blast intent '${String(intent)}'; expected one of: default, patch, refactor, cut, supply-chain.`);
    }
    const kindsSet = opts.kinds
        ? opts.kinds instanceof Set
            ? opts.kinds
            : new Set(opts.kinds)
        : null;
    const verify = opts.verifyInputs === true;
    const { kidsOf } = getParentTables(parentOf, verify);
    const rawSeeds = typeof seedOrSeeds === "string" ? [seedOrSeeds] : [...seedOrSeeds];
    const seeds = new Set();
    const dq = [];
    const addSeed = (id) => {
        if (typeof id === "string" && id && !seeds.has(id)) {
            seeds.add(id);
            dq.push(id);
        }
    };
    for (const s of rawSeeds)
        addSeed(s);
    const tables = getBlastModelTables(opts.model, verify);
    const { hostBridge, l4NodeIds } = tables;
    if (opts.model && typeof opts.model === "object") {
        if (typeof opts.model.level2?.boundary === "string" && opts.model.level2.boundary && seeds.has(opts.model.level2.boundary)) {
            for (const e of asObjArray(opts.model.level2.elements)) {
                if (!e.ref)
                    addSeed(e.id);
            }
        }
        for (const s of [...seeds]) {
            const hosted = hostBridge?.elementsByHost.get(s);
            if (hosted && l4NodeIds.has(s)) {
                for (const elId of hosted)
                    addSeed(elId);
            }
        }
    }
    while (dq.length) {
        for (const c of kidsOf.get(dq.shift()) ?? []) {
            addSeed(c);
        }
    }
    const { into, outByFrom } = getLinkAdjacency(links, verify);
    let truncated = false;
    const spreadDist = new Map();
    const spreadVia = new Map();
    let frontier = [...seeds].sort(cmpCodepoint);
    const q = frontier.map((id) => [id, 0]);
    let hop = 0;
    while (frontier.length > 0) {
        if (hop >= maxHops) {
            for (const x of frontier) {
                for (const l of into.get(x) ?? []) {
                    const y = l.from;
                    if (seeds.has(y) || spreadDist.has(y))
                        continue;
                    if (classifyBlastLink(l, hop, intent, quietSeedOnly, kindsSet) === "spread") {
                        truncated = true;
                        break;
                    }
                }
                if (truncated)
                    break;
            }
            break;
        }
        const nextBest = new Map();
        for (const x of frontier) {
            for (const l of into.get(x) ?? []) {
                const y = l.from;
                if (seeds.has(y) || spreadDist.has(y))
                    continue;
                if (classifyBlastLink(l, hop, intent, quietSeedOnly, kindsSet) !== "spread")
                    continue;
                const prev = nextBest.get(y);
                if (!prev || compareBlastLinks(l, prev) < 0) {
                    nextBest.set(y, l);
                }
            }
        }
        const nextIds = [...nextBest.keys()].sort(cmpCodepoint);
        for (const y of nextIds) {
            const chosen = nextBest.get(y);
            spreadDist.set(y, hop + 1);
            spreadVia.set(y, chosen);
            q.push([y, hop + 1]);
        }
        frontier = nextIds;
        hop += 1;
    }
    const stopBest = new Map();
    for (const [x, h] of q) {
        if (h >= maxHops) {
            for (const l of into.get(x) ?? []) {
                const y = l.from;
                if (seeds.has(y) || spreadDist.has(y) || stopBest.has(y))
                    continue;
                if (classifyBlastLink(l, h, intent, quietSeedOnly, kindsSet) === "stop") {
                    truncated = true;
                    break;
                }
            }
            continue;
        }
        for (const l of into.get(x) ?? []) {
            const y = l.from;
            if (seeds.has(y) || spreadDist.has(y))
                continue;
            if (classifyBlastLink(l, h, intent, quietSeedOnly, kindsSet) !== "stop")
                continue;
            const candHop = h + 1;
            const prev = stopBest.get(y);
            if (!prev ||
                candHop < prev.hop ||
                (candHop === prev.hop && compareBlastLinks(l, prev.via) < 0)) {
                stopBest.set(y, { hop: candHop, via: l });
            }
        }
    }
    const combined = [];
    const mkHit = (h, via) => ({
        hop: h,
        via,
        ...(via.at !== undefined ? { at: via.at } : {}),
        ...(via.sites?.length ? { sites: [...via.sites] } : {}),
    });
    for (const [y, h] of spreadDist) {
        combined.push([y, mkHit(h, spreadVia.get(y))]);
    }
    for (const [y, s] of stopBest) {
        combined.push([y, mkHit(s.hop, s.via)]);
    }
    combined.sort((a, b) => a[1].hop - b[1].hop || cmpCodepoint(a[0], b[0]));
    const hits = new Map(combined);
    return { seeds, hits, truncated, kidsOf, into, outByFrom, intent, kindsSet, hostBridge, tables };
}
function stripLineSuffix(tech) {
    if (!tech)
        return "";
    return tech.replace(/\s*·\s*L\d+(?:[–-]\d+)?(?![0-9A-Za-z_])/g, "").trim();
}
function logicalParentOf(id, parentOf) {
    let p = parentOf.get(id);
    const seen = new Set([id]);
    while (p && isKindNodeId(p, "d")) {
        if (seen.has(p) || seen.size >= MAX_TREE_DEPTH)
            return undefined;
        seen.add(p);
        p = parentOf.get(p);
    }
    return p;
}
function indexModelForDelta(model, bridgeUncovered = true) {
    const subgraphOwners = collectSubgraphOwners(model);
    const parentOf = buildMapParentIndex(model);
    const elements = new Map();
    const validTargetIds = new Set(parentOf.keys());
    for (const p of parentOf.values())
        if (p)
            validTargetIds.add(p);
    const inlineParentIds = new Set();
    const addEl = (e, origin, fallbackKind, pid, depth = 0) => {
        if (depth >= MAX_TREE_DEPTH)
            return;
        const id = typeof e.id === "string" ? e.id : "";
        if (id)
            validTargetIds.add(id);
        if (!id || isKindNodeId(id, "d") || elements.has(id))
            return;
        elements.set(id, {
            id,
            origin,
            kind: e.kind || fallbackKind,
            name: e.name ?? id,
            tech: e.tech,
            desc: e.desc,
            parentId: parentOf.get(id) ?? pid,
            logicalParentId: logicalParentOf(id, parentOf) ?? pid,
            source: e.source,
            diff: e.diff,
            rawElement: e,
        });
        const childArr = asObjArray(e.children);
        if (childArr.length > 0) {
            inlineParentIds.add(id);
            childArr.forEach((k, idx) => addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${id}/${idx}` }, "inline", "component", id, depth + 1));
        }
    };
    for (const e of asObjArray(model?.level1?.elements))
        addEl(e, "level1", "system");
    if (typeof model?.level2?.boundary === "string" && model.level2.boundary) {
        validTargetIds.add(model.level2.boundary);
    }
    for (const e of asObjArray(model?.level2?.elements)) {
        if (typeof e.id === "string" && e.id)
            validTargetIds.add(e.id);
        if (e.ref)
            continue;
        addEl({ ...e, name: e.name ?? e.id }, "level2", "container", model?.level2?.boundary);
    }
    if (isPlainRecord(model?.level3)) {
        for (const [cid, rawKids] of Object.entries(model.level3)) {
            if (cid)
                validTargetIds.add(cid);
            asObjArray(rawKids).forEach((k, idx) => addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${cid}/${idx}` }, "level3", "component", cid));
        }
    }
    for (const dn of asObjArray(model?.level4?.nodes)) {
        if (typeof dn.id !== "string" || !dn.id)
            continue;
        validTargetIds.add(dn.id);
        if (!elements.has(dn.id)) {
            elements.set(dn.id, {
                id: dn.id,
                origin: "level4",
                kind: dn.kind || "resource",
                name: dn.title ?? dn.id,
                tech: dn.facts?.type || dn.facts?.sku || dn.facts?.size,
                desc: dn.role,
                parentId: dn.group || dn.zone,
                logicalParentId: dn.group || dn.zone,
                source: dn.source,
                diff: dn.diff,
                rawNode: dn,
            });
        }
        const dnKids = asObjArray(dn.children);
        if (dnKids.length > 0) {
            inlineParentIds.add(dn.id);
            dnKids.forEach((k, idx) => addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${dn.id}/${idx}` }, "inline", "module", dn.id, 1));
        }
    }
    if (isPlainRecord(model?.subgraphs)) {
        for (const [pid, sg] of Object.entries(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const owner = subgraphOwners.get(pid) ?? pid;
            if (pid)
                validTargetIds.add(pid);
            if (owner)
                validTargetIds.add(owner);
            asObjArray(sg.elements).forEach((k, idx) => addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${owner}/${idx}` }, "subgraph", "module", owner));
        }
    }
    const links = extractModelLinks(model, { bridgeUncovered, parentOf });
    const outWireKeys = new Map();
    for (const l of links) {
        const key = `${l.kind || "uses"}\u0000${l.to}`;
        let set = outWireKeys.get(l.from);
        if (!set) {
            set = new Set();
            outWireKeys.set(l.from, set);
        }
        set.add(key);
    }
    return { elements, parentOf, outWireKeys, validTargetIds, inlineParentIds, links };
}
function sameSet(a, b) {
    const sa = a?.size ?? 0;
    const sb = b?.size ?? 0;
    if (sa !== sb)
        return false;
    if (!a || !b)
        return true;
    for (const x of a)
        if (!b.has(x))
            return false;
    return true;
}
export function computeGraphDelta(baseModel, headModel, opts = {}) {
    const includeMergedModel = opts.includeMergedModel ?? true;
    const bothCodeOrNeither = resolveModelRawLinks(baseModel).length > 0 || resolveModelRawLinks(headModel).length > 0;
    const baseIdx = indexModelForDelta(baseModel, !bothCodeOrNeither);
    const headIdx = indexModelForDelta(headModel, !bothCodeOrNeither);
    const allIds = [...new Set([...baseIdx.elements.keys(), ...headIdx.elements.keys()])].sort(cmpCodepoint);
    const nodeChanges = [];
    const rawAddedIds = [];
    const rawDeletedIds = [];
    const movedIds = [];
    const sigChangedIds = [];
    const bodyPatchedIds = [];
    const sigOf = (el) => el.source?.signature ?? el.source?.symbol ?? (stripLineSuffix(el.tech) || el.name);
    const spanOf = (el) => el.source?.lineRange && el.source.lineRange.length >= 2
        ? el.source.lineRange[1] - el.source.lineRange[0]
        : null;
    for (const id of allIds) {
        const b = baseIdx.elements.get(id);
        const h = headIdx.elements.get(id);
        if (!b && h) {
            rawAddedIds.push(id);
        }
        else if (b && !h) {
            rawDeletedIds.push(id);
        }
        else if (b && h) {
            if ((b.logicalParentId ?? "") !== (h.logicalParentId ?? "")) {
                movedIds.push(id);
                nodeChanges.push({
                    id,
                    change: "moved",
                    kind: h.kind,
                    name: h.name,
                    baseParentId: b.logicalParentId,
                    headParentId: h.logicalParentId,
                    source: h.source,
                });
                continue;
            }
            if (b.kind !== h.kind || sigOf(b) !== sigOf(h)) {
                sigChangedIds.push(id);
                nodeChanges.push({
                    id,
                    change: "sig-changed",
                    kind: h.kind,
                    name: h.name,
                    baseParentId: b.logicalParentId,
                    headParentId: h.logicalParentId,
                    source: h.source,
                });
                continue;
            }
            const wiresChanged = !sameSet(baseIdx.outWireKeys.get(id), headIdx.outWireKeys.get(id));
            const hasBothHashes = Boolean(b.source?.hash && h.source?.hash);
            const hasBothModHashes = Boolean(b.source?.moduleHash && h.source?.moduleHash);
            const bodyChanged = hasBothHashes
                ? b.source.hash !== h.source.hash ||
                    (hasBothModHashes && b.source.moduleHash !== h.source.moduleHash) ||
                    wiresChanged
                : Boolean(h.diff) ||
                    spanOf(b) !== spanOf(h) ||
                    (b.desc ?? "") !== (h.desc ?? "") ||
                    wiresChanged;
            if (bodyChanged) {
                bodyPatchedIds.push(id);
                nodeChanges.push({
                    id,
                    change: "body-patched",
                    kind: h.kind,
                    name: h.name,
                    baseParentId: b.logicalParentId,
                    headParentId: h.logicalParentId,
                    source: h.source,
                });
            }
        }
    }
    const pairedDeleted = new Set();
    const pairedAdded = new Set();
    const pairRename = (delId, addId) => {
        const b = baseIdx.elements.get(delId);
        const h = headIdx.elements.get(addId);
        pairedDeleted.add(delId);
        pairedAdded.add(addId);
        movedIds.push(addId);
        nodeChanges.push({
            id: addId,
            previousId: delId,
            change: "moved",
            kind: h.kind,
            name: h.name,
            baseParentId: b.logicalParentId,
            headParentId: h.logicalParentId,
            source: h.source,
        });
    };
    const delByHash = new Map();
    const addByHash = new Map();
    for (const delId of rawDeletedIds) {
        const b = baseIdx.elements.get(delId);
        if (b.source?.hash) {
            const k = `${b.kind}\u0000${b.source.hash}`;
            const arr = delByHash.get(k) ?? [];
            arr.push(delId);
            delByHash.set(k, arr);
        }
    }
    for (const addId of rawAddedIds) {
        const h = headIdx.elements.get(addId);
        if (h.source?.hash) {
            const k = `${h.kind}\u0000${h.source.hash}`;
            const arr = addByHash.get(k) ?? [];
            arr.push(addId);
            addByHash.set(k, arr);
        }
    }
    for (const [k, dList] of delByHash) {
        const aList = addByHash.get(k);
        if (dList.length === 1 && aList?.length === 1) {
            pairRename(dList[0], aList[0]);
        }
    }
    const delBySig = new Map();
    const addBySig = new Map();
    for (const delId of rawDeletedIds) {
        if (pairedDeleted.has(delId))
            continue;
        const b = baseIdx.elements.get(delId);
        if (b.name) {
            const k = `${b.kind}\u0000${b.name}\u0000${sigOf(b)}`;
            const arr = delBySig.get(k) ?? [];
            arr.push(delId);
            delBySig.set(k, arr);
        }
    }
    for (const addId of rawAddedIds) {
        if (pairedAdded.has(addId))
            continue;
        const h = headIdx.elements.get(addId);
        if (h.name) {
            const k = `${h.kind}\u0000${h.name}\u0000${sigOf(h)}`;
            const arr = addBySig.get(k) ?? [];
            arr.push(addId);
            addBySig.set(k, arr);
        }
    }
    for (const [k, dList] of delBySig) {
        const aList = addBySig.get(k);
        if (dList.length === 1 && aList?.length === 1) {
            pairRename(dList[0], aList[0]);
        }
    }
    const addedIds = [];
    for (const addId of rawAddedIds) {
        if (pairedAdded.has(addId))
            continue;
        const h = headIdx.elements.get(addId);
        addedIds.push(addId);
        nodeChanges.push({
            id: addId,
            change: "added",
            kind: h.kind,
            name: h.name,
            headParentId: h.logicalParentId,
            source: h.source,
        });
    }
    const deletedIds = [];
    for (const delId of rawDeletedIds) {
        if (pairedDeleted.has(delId))
            continue;
        const b = baseIdx.elements.get(delId);
        deletedIds.push(delId);
        nodeChanges.push({
            id: delId,
            change: "deleted",
            kind: b.kind,
            name: b.name,
            baseParentId: b.logicalParentId,
            source: b.source,
        });
    }
    movedIds.sort(cmpCodepoint);
    nodeChanges.sort((a, b) => cmpCodepoint(a.id, b.id));
    const baseLinks = baseIdx.links;
    const headLinks = headIdx.links;
    const wireKey = (l) => `${l.kind || "uses"}\u0000${l.from}\u0000${l.to}`;
    const baseWireMap = new Map();
    for (const l of baseLinks)
        if (!baseWireMap.has(wireKey(l)))
            baseWireMap.set(wireKey(l), l);
    const headWireMap = new Map();
    for (const l of headLinks)
        if (!headWireMap.has(wireKey(l)))
            headWireMap.set(wireKey(l), l);
    const addedWires = [];
    const removedWires = [];
    const danglingWires = [];
    for (const [k, l] of [...headWireMap.entries()].sort((a, b) => cmpCodepoint(a[0], b[0]))) {
        const kind = l.kind || "uses";
        if (!baseWireMap.has(k)) {
            addedWires.push({
                from: l.from,
                to: l.to,
                kind,
                change: "added",
                ...(l.at ? { at: l.at } : {}),
            });
        }
        if (!headIdx.validTargetIds.has(l.to)) {
            danglingWires.push({
                from: l.from,
                to: l.to,
                kind,
                change: "dangling",
                ...(l.at ? { at: l.at } : {}),
            });
        }
    }
    for (const [k, l] of [...baseWireMap.entries()].sort((a, b) => cmpCodepoint(a[0], b[0]))) {
        if (!headWireMap.has(k)) {
            removedWires.push({
                from: l.from,
                to: l.to,
                kind: l.kind || "uses",
                change: "removed",
                ...(l.at ? { at: l.at } : {}),
            });
        }
    }
    const changeById = new Map(nodeChanges.map((c) => [c.id, c]));
    const changedAncestorsWithChangedChild = new Set();
    for (const c of nodeChanges) {
        const pMap = c.change === "deleted" ? baseIdx.parentOf : headIdx.parentOf;
        for (const anc of mapAncestorsOf(c.id, pMap).slice(1)) {
            if (changeById.has(anc))
                changedAncestorsWithChangedChild.add(anc);
        }
    }
    const seedIdSet = new Set();
    for (const c of nodeChanges) {
        let keep = true;
        if (changedAncestorsWithChangedChild.has(c.id) && c.change === "body-patched") {
            const b = baseIdx.elements.get(c.id);
            const h = headIdx.elements.get(c.id);
            const wiresChanged = !sameSet(baseIdx.outWireKeys.get(c.id), headIdx.outWireKeys.get(c.id));
            const modHashChanged = Boolean(b?.source?.moduleHash !== undefined && h?.source?.moduleHash !== undefined) &&
                b.source.moduleHash !== h.source.moduleHash;
            keep = wiresChanged || modHashChanged;
        }
        if (keep) {
            seedIdSet.add(c.id);
            if (c.previousId)
                seedIdSet.add(c.previousId);
        }
    }
    const blastSeedIds = [...seedIdSet].sort(cmpCodepoint);
    const isSupplyChainDeltaId = (nid) => {
        if (!nid)
            return false;
        if (nid.startsWith("p:pkg:") || nid.startsWith("s:pkg:") || nid.includes(":s:pkg:") || nid.includes(":p:pkg:")) {
            return true;
        }
        if (nid === "x-registries" ||
            nid === "e-registries" ||
            nid.endsWith(":x-registries") ||
            nid.endsWith(":d:x-registries") ||
            nid.includes(":d:x-registries/")) {
            return true;
        }
        const bMeta = baseIdx.elements.get(nid);
        const hMeta = headIdx.elements.get(nid);
        const rp = hMeta?.source?.path ||
            bMeta?.source?.path ||
            repoPathForNodeId(nid);
        return Boolean(rp && LOCKFILE_DELTA_RE.test(rp));
    };
    const codeDeleted = deletedIds.filter((id) => !isSupplyChainDeltaId(id));
    const codeStructural = [...movedIds, ...sigChangedIds, ...addedIds].filter((id) => !isSupplyChainDeltaId(id));
    const hasSupplyChainChange = nodeChanges.some((c) => isSupplyChainDeltaId(c.id)) ||
        [...addedWires, ...removedWires].some((w) => isSupplyChainDeltaId(w.to) || isSupplyChainDeltaId(w.from));
    const recommendedIntent = codeDeleted.length > 0
        ? "cut"
        : codeStructural.length > 0
            ? "refactor"
            : hasSupplyChainChange
                ? "supply-chain"
                : "patch";
    if (!includeMergedModel) {
        return {
            nodeChanges,
            addedIds,
            deletedIds,
            movedIds,
            sigChangedIds,
            bodyPatchedIds,
            addedWires,
            removedWires,
            danglingWires,
            blastSeedIds,
            recommendedIntent,
            mergedModel: headModel,
        };
    }
    const diffForId = (id) => {
        const chObj = changeById.get(id);
        if (!chObj)
            return undefined;
        const ch = chObj.change;
        if (ch === "added")
            return { changeType: "added", summary: "Added on branch" };
        if (ch === "deleted")
            return { changeType: "deleted", summary: "Deleted on branch" };
        return {
            changeType: "modified",
            summary: ch === "moved"
                ? chObj.previousId
                    ? `Moved from ${chObj.previousId}`
                    : "Moved component/parent"
                : ch === "sig-changed"
                    ? "Signature changed"
                    : "Body patched",
        };
    };
    const deletedDiff = { changeType: "deleted", summary: "Deleted on branch" };
    const deletedInlineByParent = new Map();
    const deletedL1Ghosts = [];
    const deletedL2Ghosts = [];
    const deletedL4Ghosts = [];
    const deletedSubgraphOrL3 = [];
    for (const delId of deletedIds) {
        const bEl = baseIdx.elements.get(delId);
        if (!bEl)
            continue;
        if (bEl.origin === "level4") {
            if (bEl.rawNode)
                deletedL4Ghosts.push({ ...bEl.rawNode, diff: deletedDiff });
        }
        else if (bEl.origin === "level1") {
            if (bEl.rawElement)
                deletedL1Ghosts.push({ ...bEl.rawElement, diff: deletedDiff });
        }
        else if (bEl.origin === "level2") {
            if (bEl.rawElement)
                deletedL2Ghosts.push({ ...bEl.rawElement, diff: deletedDiff });
        }
        else if (bEl.origin === "inline") {
            if (bEl.rawElement && bEl.parentId) {
                const arr = deletedInlineByParent.get(bEl.parentId) ?? [];
                arr.push({ ...bEl.rawElement, diff: deletedDiff });
                deletedInlineByParent.set(bEl.parentId, arr);
            }
        }
        else {
            deletedSubgraphOrL3.push(bEl);
        }
    }
    const headSubgraphOwners = collectSubgraphOwners(headModel);
    const annotateEl = (e, pid, idx, depth = 0) => {
        if (depth >= MAX_TREE_DEPTH)
            return e;
        const id = (typeof e.id === "string" && e.id) || (pid && idx !== undefined ? `${pid}/${idx}` : "");
        const d = id ? diffForId(id) : undefined;
        const baseKids = Array.isArray(e.children)
            ? asObjArray(e.children).map((k, ki) => annotateEl(k, id, ki, depth + 1))
            : undefined;
        const inlineGhosts = id ? deletedInlineByParent.get(id) : undefined;
        const kids = baseKids || inlineGhosts ? [...(baseKids ?? []), ...(inlineGhosts ?? [])] : undefined;
        if (!d && !kids)
            return e;
        return {
            ...e,
            ...(d ? { diff: e.diff ?? d } : {}),
            ...(kids ? { children: kids } : {}),
        };
    };
    const mergedLevel3 = {};
    if (isPlainRecord(headModel?.level3)) {
        for (const [cid, rawKids] of Object.entries(headModel.level3)) {
            setOwnProp(mergedLevel3, cid, asObjArray(rawKids).map((k, idx) => annotateEl(k, cid, idx)));
        }
    }
    const mergedSubgraphs = {};
    if (isPlainRecord(headModel?.subgraphs)) {
        for (const [pid, sg] of Object.entries(headModel.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const ownerPid = headSubgraphOwners.get(pid) ?? pid;
            setOwnProp(mergedSubgraphs, pid, {
                ...sg,
                elements: asObjArray(sg.elements).map((k, idx) => annotateEl(k, ownerPid, idx)),
            });
        }
    }
    const headL2ContainerIds = new Set(asObjArray(headModel?.level2?.elements)
        .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
        .map((e) => e.id));
    for (const bEl of deletedSubgraphOrL3) {
        if (!bEl.rawElement || !bEl.parentId)
            continue;
        const ghost = {
            ...bEl.rawElement,
            diff: deletedDiff,
        };
        const pid = bEl.parentId;
        const logPid = bEl.logicalParentId;
        const isPidFolder = isKindNodeId(pid, "d");
        if (bEl.origin === "level3") {
            if (hasOwn(mergedLevel3, pid)) {
                mergedLevel3[pid].push(ghost);
            }
            else if (headL2ContainerIds.has(pid)) {
                setOwnProp(mergedLevel3, pid, [ghost]);
            }
            continue;
        }
        if (hasOwn(mergedSubgraphs, pid)) {
            mergedSubgraphs[pid].elements.push(ghost);
        }
        else if (isPidFolder && logPid && hasOwn(mergedSubgraphs, logPid)) {
            mergedSubgraphs[logPid].elements.push(ghost);
        }
        else if (isPidFolder &&
            logPid &&
            headIdx.validTargetIds.has(logPid) &&
            !headIdx.inlineParentIds.has(logPid) &&
            logPid !== headModel?.level2?.boundary) {
            setOwnProp(mergedSubgraphs, logPid, { elements: [ghost] });
        }
        else if (!isPidFolder &&
            headIdx.validTargetIds.has(pid) &&
            !headIdx.inlineParentIds.has(pid) &&
            pid !== headModel?.level2?.boundary) {
            setOwnProp(mergedSubgraphs, pid, { elements: [ghost] });
        }
    }
    const mergedLevel4Nodes = [
        ...asObjArray(headModel?.level4?.nodes).map((n) => {
            const d = typeof n.id === "string" && n.id ? diffForId(n.id) : undefined;
            const baseKids = Array.isArray(n.children)
                ? asObjArray(n.children).map((k, ki) => annotateEl(k, n.id, ki))
                : undefined;
            const inlineGhosts = typeof n.id === "string" && n.id ? deletedInlineByParent.get(n.id) : undefined;
            const kids = baseKids || inlineGhosts ? [...(baseKids ?? []), ...(inlineGhosts ?? [])] : undefined;
            if (!d && !kids)
                return n;
            return {
                ...n,
                ...(d ? { diff: n.diff ?? d } : {}),
                ...(kids ? { children: kids } : {}),
            };
        }),
        ...deletedL4Ghosts,
    ];
    const mergedModel = {
        ...headModel,
        level1: {
            ...(isPlainRecord(headModel?.level1) ? headModel.level1 : {}),
            rels: asObjArray(headModel?.level1?.rels),
            elements: [
                ...asObjArray(headModel?.level1?.elements).map((e) => annotateEl(e)),
                ...deletedL1Ghosts,
            ],
        },
        level2: {
            ...(isPlainRecord(headModel?.level2) ? headModel.level2 : {}),
            boundary: typeof headModel?.level2?.boundary === "string" ? headModel.level2.boundary : "",
            rels: asObjArray(headModel?.level2?.rels),
            elements: [
                ...asObjArray(headModel?.level2?.elements).map((e) => e.ref ? e : annotateEl(e)),
                ...deletedL2Ghosts,
            ],
        },
        level3: mergedLevel3,
        level4: {
            ...(isPlainRecord(headModel?.level4) ? headModel.level4 : {}),
            groups: asObjArray(headModel?.level4?.groups),
            links: asObjArray(headModel?.level4?.links),
            nodes: mergedLevel4Nodes,
        },
        ...(Object.keys(mergedSubgraphs).length > 0 || isPlainRecord(headModel?.subgraphs)
            ? { subgraphs: mergedSubgraphs }
            : {}),
    };
    return {
        nodeChanges,
        addedIds,
        deletedIds,
        movedIds,
        sigChangedIds,
        bodyPatchedIds,
        addedWires,
        removedWires,
        danglingWires,
        blastSeedIds,
        recommendedIntent,
        mergedModel,
    };
}
const MODEL_QUERY_INDEX_CACHE = new WeakMap();
export function normalizeArchitectureModelInput(raw, opts = {}) {
    if (!isPlainRecord(raw)) {
        throw new TypeError("Invalid architecture model: expected a JSON object.");
    }
    if (Array.isArray(raw.rules) &&
        !hasOwn(raw, "level1") &&
        !hasOwn(raw, "level2") &&
        !hasOwn(raw, "c4") &&
        !hasOwn(raw, "subgraphs")) {
        throw new Error("Input looks like a code-map.json placement config, not an architecture graph model. Export a full model with 'python3 branding/architecture/code-graph.py --model-json'.");
    }
    let normalized;
    if (isPlainRecord(raw.c4)) {
        const c4 = raw.c4;
        const ctx = isPlainRecord(c4.context) ? c4.context : {};
        const cnt = isPlainRecord(c4.containers) ? c4.containers : {};
        const cmpRaw = isPlainRecord(c4.components) ? c4.components : {};
        const zoomMap = {
            context: 1,
            containers: 2,
            components: 3,
            deployment: 4,
        };
        const normZoom = (el) => {
            const z = el.zoom;
            if (typeof z === "string" && hasOwn(zoomMap, z)) {
                return { ...el, zoom: zoomMap[z] };
            }
            return el;
        };
        const level3 = {};
        for (const [cid, kids] of Object.entries(cmpRaw)) {
            setOwnProp(level3, cid, asObjArray(kids).map(normZoom));
        }
        const code = isPlainRecord(raw.code) ? raw.code : undefined;
        const neighbors = asObjArray(raw.neighbors).map((n) => ({
            name: typeof n.name === "string" ? n.name : "",
            type: typeof n.type === "string" ? n.type : "",
            resourceGroup: typeof n.resourceGroup === "string"
                ? n.resourceGroup
                : typeof n["resource group"] === "string"
                    ? n["resource group"]
                    : "",
            reason: typeof n.reason === "string" ? n.reason : "",
        }));
        const subgraphsRaw = isPlainRecord(raw.subgraphs)
            ? raw.subgraphs
            : isPlainRecord(code?.subgraphs)
                ? code.subgraphs
                : undefined;
        const linksRaw = Array.isArray(raw.codeLinks)
            ? raw.codeLinks
            : isPlainRecord(code) && Array.isArray(code.links)
                ? code.links
                : undefined;
        const linkTiersRaw = isPlainRecord(raw.linkTiers)
            ? raw.linkTiers
            : isPlainRecord(code?.linkTiers)
                ? code.linkTiers
                : undefined;
        const stopKindsRaw = Array.isArray(raw.stopKinds)
            ? raw.stopKinds
            : isPlainRecord(code) && Array.isArray(code.stopKinds)
                ? code.stopKinds
                : undefined;
        const routesRaw = Array.isArray(raw.routes)
            ? raw.routes
            : isPlainRecord(code) && Array.isArray(code.routes)
                ? code.routes
                : undefined;
        normalized = {
            schema: TUX_MAP_SCHEMA,
            generatedAt: typeof raw.generatedAt === "string"
                ? raw.generatedAt
                : typeof raw.generated_at === "string"
                    ? raw.generated_at
                    : undefined,
            issueBaseUrl: typeof raw.issueBaseUrl === "string" ? raw.issueBaseUrl : undefined,
            sourceBaseUrl: typeof raw.sourceBaseUrl === "string"
                ? raw.sourceBaseUrl
                : typeof code?.sourceBaseUrl === "string"
                    ? code.sourceBaseUrl
                    : undefined,
            level1: {
                title: typeof ctx.title === "string" ? ctx.title : "System Context",
                summary: typeof ctx.summary === "string" ? ctx.summary : undefined,
                elements: asObjArray(ctx.elements).map(normZoom),
                rels: asObjArray(ctx.rels),
            },
            level2: {
                title: typeof cnt.title === "string" ? cnt.title : "Containers",
                summary: typeof cnt.summary === "string" ? cnt.summary : undefined,
                boundary: typeof cnt.boundary === "string" ? cnt.boundary : "",
                elements: asObjArray(cnt.elements).map(normZoom),
                rels: asObjArray(cnt.rels),
            },
            level3,
            level4: {
                title: "Deployment",
                groups: asObjArray(raw.groups),
                nodes: asObjArray(raw.nodes),
                links: asObjArray(raw.links),
                neighbors,
            },
            ...(subgraphsRaw ? { subgraphs: subgraphsRaw } : {}),
            ...(linksRaw ? { links: asObjArray(linksRaw) } : {}),
            ...(linkTiersRaw
                ? {
                    linkTiers: {
                        ...(Array.isArray(linkTiersRaw.spread)
                            ? { spread: asObjArray(linkTiersRaw.spread) }
                            : {}),
                        ...(Array.isArray(linkTiersRaw.stop)
                            ? { stop: asObjArray(linkTiersRaw.stop) }
                            : {}),
                    },
                }
                : {}),
            ...(stopKindsRaw
                ? { stopKinds: stopKindsRaw.filter((k) => typeof k === "string" && Boolean(k)) }
                : {}),
            ...(routesRaw ? { routes: asObjArray(routesRaw) } : {}),
        };
    }
    else if (isPlainRecord(raw.subgraphs) &&
        !hasOwn(raw, "level1") &&
        !hasOwn(raw, "level2") &&
        !hasOwn(raw, "level3") &&
        !hasOwn(raw, "level4")) {
        const subgraphs = raw.subgraphs;
        const childIds = new Set();
        const refTargets = new Set();
        for (const [k, sg] of Object.entries(subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            asObjArray(sg.elements).forEach((el, idx) => {
                const id = (typeof el.id === "string" && el.id) || `${k}/${idx}`;
                childIds.add(id);
                if (typeof el.subgraphRef === "string" && el.subgraphRef) {
                    refTargets.add(el.subgraphRef);
                }
            });
        }
        const stubContainers = [];
        for (const key of Object.keys(subgraphs)) {
            if (!childIds.has(key) && !refTargets.has(key)) {
                stubContainers.push({
                    id: key,
                    kind: key.includes("/") ? "component" : "container",
                    name: key,
                });
            }
        }
        normalized = {
            schema: TUX_MAP_SCHEMA,
            generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : undefined,
            sourceBaseUrl: typeof raw.sourceBaseUrl === "string" ? raw.sourceBaseUrl : undefined,
            level1: { elements: [], rels: [] },
            level2: { boundary: "", elements: stubContainers, rels: [] },
            level3: {},
            level4: { groups: [], nodes: [], links: [] },
            subgraphs,
            links: asObjArray(raw.links),
            ...(isPlainRecord(raw.linkTiers)
                ? {
                    linkTiers: {
                        ...(Array.isArray(raw.linkTiers.spread)
                            ? { spread: asObjArray(raw.linkTiers.spread) }
                            : {}),
                        ...(Array.isArray(raw.linkTiers.stop)
                            ? { stop: asObjArray(raw.linkTiers.stop) }
                            : {}),
                    },
                }
                : {}),
            ...(Array.isArray(raw.stopKinds)
                ? { stopKinds: raw.stopKinds.filter((k) => typeof k === "string" && Boolean(k)) }
                : {}),
            ...(Array.isArray(raw.routes) ? { routes: asObjArray(raw.routes) } : {}),
        };
    }
    else {
        normalized =
            raw.schema === undefined || raw.schema === null
                ? { ...raw, schema: TUX_MAP_SCHEMA }
                : raw;
    }
    normalized = sanitizeMapModel(normalized).model;
    if (opts.allowEmpty === false) {
        const idx = getMapQueryIndex(normalized);
        if (idx.nodes.size === 0) {
            throw new Error("Architecture model contains 0 indexed nodes. Pass a populated TuxMapLevelModel, schema-2 architecture.json, or 'python3 branding/architecture/code-graph.py --model-json' output.");
        }
    }
    return normalized;
}
function modelCacheStamp(model) {
    let h1 = 0x811c9dc5;
    let h2 = 0x01000193;
    const feedStr = (s) => {
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
            h2 = Math.imul(h2 ^ ((c << 1) | 1), 0x85ebca6b) >>> 0;
        }
        h1 = Math.imul(h1 ^ 0xff, 0x01000193) >>> 0;
    };
    const feedArr = (v) => {
        if (!v)
            return;
        if (typeof v === "string") {
            feedStr(v);
        }
        else if (Array.isArray(v)) {
            for (const item of v) {
                if (typeof item === "string")
                    feedStr(item);
            }
        }
    };
    const feedEls = (rawEls, depth = 0) => {
        const els = asObjArray(rawEls);
        feedStr(`#E:${els.length}`);
        if (depth >= MAX_TREE_DEPTH)
            return;
        for (const e of els) {
            feedStr(typeof e.id === "string" ? e.id : "");
            feedStr(typeof e.name === "string" ? e.name : "");
            feedStr(typeof e.kind === "string" ? e.kind : "");
            feedStr(typeof e.status === "string" ? e.status : "");
            feedStr(e.ref ? "1" : "0");
            feedStr(typeof e.next === "number" ? String(e.next) : "");
            feedStr(typeof e.subgraphRef === "string" ? e.subgraphRef : "");
            feedStr(typeof e.source?.path === "string" ? e.source.path : "");
            feedStr(typeof e.source?.hash === "string" ? e.source.hash : "");
            feedArr(e.deployed);
            if (Array.isArray(e.children) && e.children.length > 0) {
                feedEls(e.children, depth + 1);
            }
        }
    };
    const feedRels = (rawRels) => {
        const rels = asObjArray(rawRels);
        feedStr(`#R:${rels.length}`);
        for (const r of rels) {
            feedStr(typeof r.from === "string" ? r.from : "");
            feedStr(typeof r.to === "string" ? r.to : "");
            feedStr(typeof r.label === "string" ? r.label : "");
            feedStr(typeof r.status === "string" ? r.status : "");
        }
    };
    feedEls(model?.level1?.elements);
    feedRels(model?.level1?.rels);
    feedStr(typeof model?.level2?.boundary === "string" ? model.level2.boundary : "");
    feedEls(model?.level2?.elements);
    feedRels(model?.level2?.rels);
    if (isPlainRecord(model?.level3)) {
        const keys = Object.keys(model.level3);
        feedStr(`#L3:${keys.length}`);
        for (const k of keys) {
            feedStr(k);
            feedEls(model.level3[k]);
        }
    }
    const l4Nodes = asObjArray(model?.level4?.nodes);
    feedStr(`#L4N:${l4Nodes.length}`);
    for (const n of l4Nodes) {
        feedStr(typeof n.id === "string" ? n.id : "");
        feedStr(typeof n.title === "string" ? n.title : "");
        feedStr(typeof n.kind === "string" ? n.kind : "");
        feedStr(typeof n.status === "string" ? n.status : "");
        feedStr(typeof n.group === "string" ? n.group : "");
        feedStr(typeof n.zone === "string" ? n.zone : "");
        feedStr(typeof n.subgraphRef === "string" ? n.subgraphRef : "");
        feedStr(typeof n.source?.path === "string" ? n.source.path : "");
        feedStr(typeof n.source?.hash === "string" ? n.source.hash : "");
        feedArr(n.hosts);
        if (Array.isArray(n.children) && n.children.length > 0) {
            feedEls(n.children);
        }
    }
    const l4Links = asObjArray(model?.level4?.links);
    feedStr(`#L4L:${l4Links.length}`);
    for (const l of l4Links) {
        feedStr(typeof l.from === "string" ? l.from : "");
        feedStr(typeof l.to === "string" ? l.to : "");
        feedStr(typeof l.kind === "string" ? l.kind : "");
        feedStr(typeof l.state === "string" ? l.state : "");
    }
    if (isPlainRecord(model?.subgraphs)) {
        const sgKeys = Object.keys(model.subgraphs);
        feedStr(`#SG:${sgKeys.length}`);
        for (const k of sgKeys) {
            feedStr(k);
            const sg = model.subgraphs[k];
            if (isPlainRecord(sg)) {
                feedEls(sg.elements);
                feedRels(sg.rels);
            }
        }
    }
    const codeLinks = resolveModelRawLinks(model);
    feedStr(`#CL:${codeLinks.length}`);
    for (const l of codeLinks) {
        feedStr(typeof l.from === "string" ? l.from : "");
        feedStr(typeof l.to === "string" ? l.to : "");
        feedStr(typeof l.kind === "string" ? l.kind : "");
        feedStr(typeof l.at === "string" ? l.at : "");
        feedStr(l.stop ? "1" : "0");
        feedStr(typeof l.coupling === "string" ? l.coupling : "");
        feedStr(typeof l.phase === "string" ? l.phase : "");
        if (Array.isArray(l.violations)) {
            feedStr(String(l.violations.length));
            for (const v of l.violations) {
                feedStr(typeof v?.rule === "string" ? v.rule : "");
            }
        }
        else {
            feedStr("0");
        }
    }
    if (Array.isArray(model?.stopKinds)) {
        feedStr(`#SK:${model.stopKinds.length}`);
        for (const sk of model.stopKinds) {
            if (typeof sk === "string")
                feedStr(sk);
        }
    }
    if (isPlainRecord(model?.aliases)) {
        const ak = Object.keys(model.aliases);
        feedStr(`#AL:${ak.length}`);
        for (const k of ak) {
            feedStr(k);
            feedStr(typeof model.aliases[k] === "string" ? model.aliases[k] : "");
        }
    }
    const routes = asObjArray(model?.routes);
    feedStr(`#RT:${routes.length}`);
    for (const rt of routes) {
        feedStr(typeof rt.method === "string" ? rt.method : "");
        feedStr(typeof rt.pattern === "string" ? rt.pattern : "");
        feedStr(typeof rt.handler === "string" ? rt.handler : "");
        feedStr(typeof rt.framework === "string" ? rt.framework : "");
    }
    return `${h1.toString(16).padStart(8, "0")}:${h2.toString(16).padStart(8, "0")}`;
}
export const EMPTY_TTI_LEVEL_MODEL = {
    schema: TUX_MAP_SCHEMA,
    level1: { title: "System Context", elements: [], rels: [] },
    level2: { title: "Containers", boundary: "", elements: [], rels: [] },
    level3: {},
    level4: { title: "Deployment", groups: [], nodes: [], links: [] },
    subgraphs: Object.create(null),
};
export function getMapQueryIndex(model = EMPTY_TTI_LEVEL_MODEL) {
    const isObjModel = model != null && typeof model === "object";
    const stamp = isObjModel ? modelCacheStamp(model) : "empty";
    const cached = isObjModel ? MODEL_QUERY_INDEX_CACHE.get(model) : undefined;
    if (cached && cached.stamp === stamp)
        return cached.index;
    const subgraphOwners = collectSubgraphOwners(model);
    const parentOf = buildMapParentIndex(model);
    const kidsOf = new Map();
    for (const [c, p] of parentOf) {
        let arr = kidsOf.get(p);
        if (!arr) {
            arr = [];
            kidsOf.set(p, arr);
        }
        arr.push(c);
    }
    const nodes = new Map();
    const edges = [];
    const depEdges = [];
    const seenHostEdges = new Set();
    const normArr = (v) => {
        if (!v)
            return [];
        if (Array.isArray(v))
            return v.filter((x) => typeof x === "string" && Boolean(x));
        return typeof v === "string" && v ? [v] : [];
    };
    const addHostEdge = (elId, hid) => {
        if (!elId || !hid)
            return;
        const key = `${elId}\u0000${hid}`;
        if (seenHostEdges.has(key))
            return;
        seenHostEdges.add(key);
        const he = {
            id: `dep-${elId}-${hid}`,
            from: elId,
            to: hid,
            level: 4,
            kind: "hosts",
        };
        edges.push(he);
        depEdges.push(he);
    };
    const addInlineChildren = (parentId, rawKids, depth = 0) => {
        if (!parentId || depth >= MAX_TREE_DEPTH)
            return;
        const kids = asObjArray(rawKids);
        if (kids.length === 0)
            return;
        const rawLvl = levelForFocus(parentId, model, parentOf);
        const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
        kids.forEach((k, idx) => {
            const id = (typeof k.id === "string" && k.id) || `${parentId}/${idx}`;
            const deployed = normArr(k.deployed);
            if (!nodes.has(id)) {
                nodes.set(id, {
                    id,
                    level: childLevel,
                    kind: k.kind || "module",
                    name: k.name ?? id,
                    tech: k.tech,
                    desc: k.desc,
                    status: k.status,
                    parentId,
                    deployed,
                    source: k.source,
                    diff: k.diff,
                    roadmap: k.roadmap,
                });
                edges.push({
                    id: `pinl-${parentId}-${id}`,
                    from: parentId,
                    to: id,
                    level: childLevel,
                    kind: "parent-child",
                });
            }
            for (const hid of deployed)
                addHostEdge(id, hid);
            if (Array.isArray(k.children) && k.children.length > 0) {
                addInlineChildren(id, k.children, depth + 1);
            }
        });
    };
    for (const e of asObjArray(model?.level1?.elements)) {
        if (typeof e.id !== "string" || !e.id)
            continue;
        const deployed = normArr(e.deployed);
        if (!nodes.has(e.id)) {
            nodes.set(e.id, {
                id: e.id,
                level: 1,
                kind: e.kind || "system",
                name: e.name ?? e.id,
                tech: e.tech,
                desc: e.desc,
                status: e.status,
                deployed: deployed.length > 0 ? deployed : undefined,
                source: e.source,
                diff: e.diff,
                roadmap: e.roadmap,
            });
        }
        for (const hid of deployed)
            addHostEdge(e.id, hid);
        if (Array.isArray(e.children) && e.children.length > 0)
            addInlineChildren(e.id, e.children);
    }
    const l1RelRecords = [];
    asObjArray(model?.level1?.rels).forEach((r, idx) => {
        if (typeof r.from !== "string" || typeof r.to !== "string" || !r.from || !r.to)
            return;
        const rec = {
            id: `l1-${idx}-${r.from}-${r.to}`,
            from: r.from,
            to: r.to,
            label: r.label,
            tech: r.tech,
            level: 1,
            kind: "rel",
            planned: r.status === "planned",
        };
        edges.push(rec);
        l1RelRecords.push(rec);
    });
    const boundary = typeof model?.level2?.boundary === "string" ? model.level2.boundary : "";
    for (const e of asObjArray(model?.level2?.elements)) {
        if (typeof e.id !== "string" || !e.id)
            continue;
        if (e.ref && nodes.has(e.id))
            continue;
        const deployed = normArr(e.deployed);
        if (!nodes.has(e.id)) {
            nodes.set(e.id, {
                id: e.id,
                level: 2,
                kind: e.kind || "container",
                name: e.name ?? e.id,
                tech: e.tech,
                desc: e.desc,
                status: e.status,
                parentId: boundary || undefined,
                deployed,
                source: e.source,
                diff: e.diff,
                roadmap: e.roadmap,
            });
            if (boundary) {
                edges.push({
                    id: `p2-${boundary}-${e.id}`,
                    from: boundary,
                    to: e.id,
                    level: 2,
                    kind: "parent-child",
                });
            }
        }
        for (const hid of deployed)
            addHostEdge(e.id, hid);
        if (Array.isArray(e.children) && e.children.length > 0)
            addInlineChildren(e.id, e.children);
    }
    const l2RelRecords = [];
    asObjArray(model?.level2?.rels).forEach((r, idx) => {
        if (typeof r.from !== "string" || typeof r.to !== "string" || !r.from || !r.to)
            return;
        const rec = {
            id: `l2-${idx}-${r.from}-${r.to}`,
            from: r.from,
            to: r.to,
            label: r.label,
            tech: r.tech,
            level: 2,
            kind: "rel",
            planned: r.status === "planned",
        };
        edges.push(rec);
        l2RelRecords.push(rec);
    });
    if (isPlainRecord(model?.level3)) {
        for (const [parentId, rawKids] of Object.entries(model.level3)) {
            const kids = asObjArray(rawKids);
            const lvl = levelForFocus(parentId, model, parentOf);
            kids.forEach((k, idx) => {
                const id = (typeof k.id === "string" && k.id) || `${parentId}/${idx}`;
                const deployed = normArr(k.deployed);
                if (!nodes.has(id)) {
                    nodes.set(id, {
                        id,
                        level: lvl,
                        kind: k.kind || "component",
                        name: k.name ?? id,
                        tech: k.tech,
                        desc: k.desc,
                        status: k.status,
                        parentId,
                        deployed,
                        source: k.source,
                        diff: k.diff,
                        roadmap: k.roadmap,
                    });
                    edges.push({
                        id: `p3-${parentId}-${id}`,
                        from: parentId,
                        to: id,
                        level: lvl,
                        kind: "parent-child",
                    });
                }
                for (const hid of deployed)
                    addHostEdge(id, hid);
                if (typeof k.next === "number" && Number.isInteger(k.next) && k.next >= 0 && k.next < kids.length) {
                    const nextId = (typeof kids[k.next].id === "string" && kids[k.next].id) || `${parentId}/${k.next}`;
                    const nextEdge = {
                        id: `l3-next-${id}-${nextId}`,
                        from: id,
                        to: nextId,
                        level: lvl,
                        kind: "rel",
                        planned: k.status === "planned",
                    };
                    edges.push(nextEdge);
                    depEdges.push(nextEdge);
                }
                if (Array.isArray(k.children) && k.children.length > 0)
                    addInlineChildren(id, k.children);
            });
        }
    }
    for (const n of asObjArray(model?.level4?.nodes)) {
        if (typeof n.id !== "string" || !n.id)
            continue;
        const hosted = normArr(n.hosts);
        if (!nodes.has(n.id)) {
            nodes.set(n.id, {
                id: n.id,
                level: 4,
                kind: n.kind || "resource",
                name: n.title ?? n.id,
                tech: n.facts?.type || n.facts?.sku || n.facts?.size,
                desc: n.role,
                status: n.status,
                parentId: n.group || n.zone,
                hosts: hosted.length > 0 ? hosted : n.hosts,
                source: n.source,
                diff: n.diff,
                roadmap: n.roadmap,
            });
        }
        for (const hostedId of hosted)
            addHostEdge(hostedId, n.id);
        if (Array.isArray(n.children) && n.children.length > 0)
            addInlineChildren(n.id, n.children);
    }
    asObjArray(model?.level4?.links).forEach((l, idx) => {
        if (typeof l.from !== "string" || typeof l.to !== "string" || !l.from || !l.to)
            return;
        const depEdge = {
            id: `l4-${idx}-${l.from}-${l.to}`,
            from: l.from,
            to: l.to,
            label: l.label,
            tech: l.kind,
            level: 4,
            kind: "deployment",
            planned: l.state === "planned",
        };
        edges.push(depEdge);
        depEdges.push(depEdge);
    });
    const subgraphChildLevelByOwner = new Map();
    const seenSgRelPairs = new Set();
    if (isPlainRecord(model?.subgraphs)) {
        for (const [rawParentId, sg] of Object.entries(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const parentId = subgraphOwners.get(rawParentId) ?? rawParentId;
            const rawLvl = levelForFocus(parentId, model, parentOf);
            const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
            subgraphChildLevelByOwner.set(parentId, childLevel);
            asObjArray(sg.elements).forEach((k, idx) => {
                const id = (typeof k.id === "string" && k.id) || `${parentId}/${idx}`;
                const deployed = normArr(k.deployed);
                if (!nodes.has(id)) {
                    nodes.set(id, {
                        id,
                        level: childLevel,
                        kind: k.kind || "module",
                        name: k.name ?? id,
                        tech: k.tech,
                        desc: k.desc,
                        status: k.status,
                        parentId,
                        deployed,
                        source: k.source,
                        diff: k.diff,
                        roadmap: k.roadmap,
                    });
                    edges.push({
                        id: `psg-${parentId}-${id}`,
                        from: parentId,
                        to: id,
                        level: childLevel,
                        kind: "parent-child",
                    });
                }
                for (const hid of deployed)
                    addHostEdge(id, hid);
                if (Array.isArray(k.children) && k.children.length > 0)
                    addInlineChildren(id, k.children);
            });
            asObjArray(sg.rels).forEach((r, idx) => {
                if (typeof r.from !== "string" || typeof r.to !== "string" || !r.from || !r.to)
                    return;
                seenSgRelPairs.add(`${parentId}\u0000${r.from}\u0000${r.to}`);
                const sgEdge = {
                    id: `lsg-${parentId}-${idx}-${r.from}-${r.to}`,
                    from: r.from,
                    to: r.to,
                    label: r.label,
                    tech: r.tech,
                    level: childLevel,
                    kind: "rel",
                    planned: r.status === "planned",
                };
                edges.push(sgEdge);
                depEdges.push(sgEdge);
            });
        }
    }
    const validCodeLinks = resolveModelRawLinks(model).filter((l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to));
    const nonProseCodeLinks = [];
    const seenLinkIds = new Map();
    validCodeLinks.forEach((l) => {
        if (!nodes.has(l.from) || !nodes.has(l.to))
            return;
        const lnkEdge = {
            id: deriveLinkId(l, seenLinkIds),
            from: l.from,
            to: l.to,
            label: l.kind,
            tech: l.at,
            level: nodes.get(l.from).level,
            kind: "rel",
        };
        edges.push(lnkEdge);
        if (!TUX_MAP_QUIET_LINK_KINDS.has(l.kind || "") && inferLinkCoupling(l) !== "prose") {
            depEdges.push(lnkEdge);
            nonProseCodeLinks.push(l);
        }
    });
    if (subgraphChildLevelByOwner.size > 0 && nonProseCodeLinks.length > 0) {
        const liftedByOwner = new Map();
        for (const l of nonProseCodeLinks) {
            const up = mapAncestorsOf(l.from, parentOf);
            const upSet = new Set(up);
            let b;
            let x = l.to;
            const seenTo = new Set();
            while (x && !upSet.has(x) && !seenTo.has(x)) {
                seenTo.add(x);
                b = x;
                x = parentOf.get(x);
            }
            if (b && x && x !== l.from && subgraphChildLevelByOwner.has(x)) {
                const xIdx = up.indexOf(x);
                if (xIdx > 0) {
                    const a = up[xIdx - 1];
                    if (a !== b && !seenSgRelPairs.has(`${x}\u0000${a}\u0000${b}`)) {
                        let ownerPairs = liftedByOwner.get(x);
                        if (!ownerPairs) {
                            ownerPairs = new Map();
                            liftedByOwner.set(x, ownerPairs);
                        }
                        const pairKey = `${a}\u0000${b}`;
                        let rec = ownerPairs.get(pairKey);
                        if (!rec) {
                            rec = { from: a, to: b, kinds: new Map() };
                            ownerPairs.set(pairKey, rec);
                        }
                        const k = l.kind || "uses";
                        rec.kinds.set(k, (rec.kinds.get(k) ?? 0) + 1);
                    }
                }
            }
        }
        for (const [ownerId, ownerPairs] of liftedByOwner) {
            const childLevel = subgraphChildLevelByOwner.get(ownerId);
            let relIdx = 0;
            for (const rec of ownerPairs.values()) {
                const sgEdge = {
                    id: `lsg-${ownerId}-lca-${relIdx++}-${rec.from}-${rec.to}`,
                    from: rec.from,
                    to: rec.to,
                    label: topKinds(rec.kinds),
                    level: childLevel,
                    kind: "rel",
                };
                edges.push(sgEdge);
                depEdges.push(sgEdge);
            }
        }
    }
    const hasNonProseCodeLinks = nonProseCodeLinks.length > 0;
    const codeCovered = new Set();
    if (hasNonProseCodeLinks) {
        const hostBridge = buildHostBridge(model, subgraphOwners);
        const l2ContainerIds = new Set(asObjArray(model?.level2?.elements)
            .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
            .map((e) => e.id));
        const markCodeCovered = (id) => {
            for (const anc of mapAncestorsOf(id, parentOf)) {
                codeCovered.add(anc);
                if (boundary && l2ContainerIds.has(anc))
                    codeCovered.add(boundary);
                const hs = hostBridge.hostsByElement.get(anc);
                if (hs) {
                    for (const hid of hs)
                        codeCovered.add(hid);
                }
            }
        };
        for (const l of nonProseCodeLinks) {
            markCodeCovered(l.from);
            markCodeCovered(l.to);
        }
    }
    const l2RefinedSources = new Set();
    const l2RefinedTargets = new Set();
    for (const r of l2RelRecords) {
        l2RefinedSources.add(r.from);
        l2RefinedTargets.add(r.to);
        if (!(hasNonProseCodeLinks && codeCovered.has(r.from) && codeCovered.has(r.to))) {
            depEdges.push(r);
        }
    }
    for (const r of l1RelRecords) {
        const refinedByL2 = Boolean(boundary) &&
            ((r.to === boundary && l2RefinedSources.has(r.from)) ||
                (r.from === boundary && l2RefinedTargets.has(r.to)));
        const coveredByCode = hasNonProseCodeLinks && codeCovered.has(r.from) && codeCovered.has(r.to);
        if (!refinedByL2 && !coveredByCode) {
            depEdges.push(r);
        }
    }
    const edgesByFrom = new Map();
    const edgesByTo = new Map();
    const depEdgesByFrom = new Map();
    const depEdgesByTo = new Map();
    const neighborsByNode = new Map();
    const pushMap = (m, k, v) => {
        let arr = m.get(k);
        if (!arr) {
            arr = [];
            m.set(k, arr);
        }
        arr.push(v);
    };
    for (const e of edges) {
        pushMap(edgesByFrom, e.from, e);
        pushMap(edgesByTo, e.to, e);
        pushMap(neighborsByNode, e.from, { next: e.to, edge: e });
        pushMap(neighborsByNode, e.to, { next: e.from, edge: e });
    }
    for (const e of depEdges) {
        pushMap(depEdgesByFrom, e.from, e);
        pushMap(depEdgesByTo, e.to, e);
    }
    const effectiveLinks = extractModelLinks(model, { parentOf });
    const idx = {
        parentOf,
        kidsOf,
        nodes,
        edges,
        edgesByFrom,
        edgesByTo,
        depEdgesByFrom,
        depEdgesByTo,
        neighborsByNode,
        effectiveLinks,
    };
    if (isObjModel) {
        MODEL_QUERY_INDEX_CACHE.set(model, { stamp, index: idx });
    }
    return idx;
}
export function buildUnifiedArchitectureGraph(model = EMPTY_TTI_LEVEL_MODEL) {
    const { nodes, edges } = getMapQueryIndex(model);
    return { nodes, edges };
}
function clipDisplayId(rawId, maxLen = 120) {
    const s = String(rawId ?? "");
    return s.length <= maxLen ? s : `${s.slice(0, maxLen - 3)}...`;
}
export function suggestCloseNodeIds(unknownId, nodes, maxSuggestions = 10) {
    const rawMax = Number.isFinite(maxSuggestions) ? maxSuggestions : 10;
    const cap = Math.min(10, Math.max(0, Math.floor(rawMax)));
    if (cap === 0)
        return [];
    const rawTrimmed = String(unknownId ?? "").trim();
    const q = rawTrimmed.toLowerCase();
    const qStripped = stripNodeKindPrefix(rawTrimmed).toLowerCase();
    const tokens = qStripped.split(/[/:.#_-]+/).filter((t) => t.length >= 2);
    if (!q)
        return [];
    const scored = [];
    for (const n of nodes.values()) {
        const idLower = n.id.toLowerCase();
        const idStripped = stripNodeKindPrefix(n.id).toLowerCase();
        const nameLower = (n.name || "").toLowerCase();
        let score = 0;
        if (idLower === q || (qStripped && idStripped === qStripped)) {
            score = 100;
        }
        else if (idLower.startsWith(q) || (qStripped.length >= 2 && idStripped.startsWith(qStripped))) {
            score = 80;
        }
        else if (q.length >= 2 && (idLower.endsWith(`/${qStripped}`) || idLower.endsWith(`#${qStripped}`) || nameLower === q)) {
            score = 70;
        }
        else if (q.length >= 2 && (idLower.includes(q) || (qStripped.length >= 2 && idStripped.includes(qStripped)))) {
            score = 60;
        }
        else if (q.length >= 2 && nameLower.includes(q)) {
            score = 45;
        }
        else if (tokens.length > 0) {
            let matchedTokens = 0;
            for (const tok of tokens) {
                if (idLower.includes(tok) || nameLower.includes(tok))
                    matchedTokens++;
            }
            if (matchedTokens > 0) {
                score = 15 + Math.min(25, matchedTokens * 10);
            }
        }
        if (score > 0) {
            scored.push({ id: clipDisplayId(n.id, 120), score });
        }
    }
    scored.sort((a, b) => b.score - a.score || a.id.length - b.id.length || cmpCodepoint(a.id, b.id));
    return scored.slice(0, cap).map((s) => s.id);
}
function buildUnknownNodeError(missingIds, nodes, label = "Node") {
    const clippedMissing = missingIds.slice(0, 10).map((id) => clipDisplayId(id, 120));
    const suggestions = [];
    const seen = new Set();
    for (const raw of missingIds.slice(0, 5)) {
        for (const cand of suggestCloseNodeIds(raw, nodes, 10)) {
            if (!seen.has(cand)) {
                seen.add(cand);
                suggestions.push(cand);
                if (suggestions.length >= 10)
                    break;
            }
        }
        if (suggestions.length >= 10)
            break;
    }
    const head = clippedMissing[0] ?? "";
    const msg = missingIds.length === 1
        ? `${label} '${head}' not found in architecture graph.`
        : `${missingIds.length} nodes not found in architecture graph (first: '${head}').`;
    return {
        error: msg,
        unknownIds: clippedMissing,
        suggestions,
    };
}
function toCompactNodeRecord(n) {
    const out = {
        id: n.id,
        level: n.level,
        kind: n.kind,
        name: n.name,
    };
    if (n.tech !== undefined)
        out.tech = n.tech;
    if (n.status !== undefined)
        out.status = n.status;
    if (n.parentId !== undefined)
        out.parentId = n.parentId;
    if (n.source) {
        out.source = {
            path: n.source.path,
            ...(n.source.lineRange ? { lineRange: n.source.lineRange } : {}),
            ...(n.source.symbol ? { symbol: n.source.symbol } : {}),
        };
    }
    return out;
}
function collectSubtreeDescendants(rootId, kidsOf) {
    const out = [];
    const seen = new Set([rootId]);
    const q = [[rootId, 0]];
    for (let qi = 0; qi < q.length; qi++) {
        const [cur, depth] = q[qi];
        if (depth >= MAX_TREE_DEPTH)
            continue;
        for (const ch of kidsOf.get(cur) ?? []) {
            if (!seen.has(ch)) {
                seen.add(ch);
                out.push(ch);
                q.push([ch, depth + 1]);
            }
        }
    }
    return out;
}
export function queryArchitectureNodes(model = EMPTY_TTI_LEVEL_MODEL, opts = {}) {
    const { nodes, edges } = getMapQueryIndex(model);
    const includePlanned = opts.includePlanned ?? true;
    const focusId = opts.focusId?.trim();
    const level = opts.level;
    const kindSet = opts.kind
        ? new Set(typeof opts.kind === "string" ? [opts.kind] : opts.kind)
        : null;
    const qLower = opts.query?.trim().toLowerCase() || "";
    const matchedNodes = [...nodes.values()].filter((n) => {
        if (!includePlanned && n.status === "planned")
            return false;
        if (focusId && !(n.parentId === focusId || n.id === focusId))
            return false;
        if (level != null && n.level !== level)
            return false;
        if (kindSet && !kindSet.has(n.kind))
            return false;
        if (qLower) {
            const hay = `${n.id}\n${n.name}\n${n.tech ?? ""}\n${n.desc ?? ""}\n${n.source?.path ?? ""}`.toLowerCase();
            if (!hay.includes(qLower))
                return false;
        }
        return true;
    });
    const compact = opts.compact ?? false;
    const offset = Number.isFinite(opts.offset) ? Math.max(0, Math.floor(opts.offset)) : 0;
    let effectiveLimit = null;
    if (opts.limit !== undefined && opts.limit !== null) {
        effectiveLimit = Number.isFinite(opts.limit) ? Math.max(0, Math.floor(opts.limit)) : 0;
    }
    else if (compact && !focusId && level == null && !kindSet && !qLower) {
        effectiveLimit = 100;
    }
    const pageNodes = effectiveLimit !== null
        ? matchedNodes.slice(offset, offset + effectiveLimit)
        : matchedNodes.slice(offset);
    const includeEdges = opts.includeEdges ?? !compact;
    const pageIds = new Set(pageNodes.map((n) => n.id));
    const matchedEdges = includeEdges
        ? edges.filter((e) => (includePlanned || !e.planned) &&
            (pageIds.has(e.from) || pageIds.has(e.to)))
        : [];
    return {
        level: level ?? "all",
        focusId: focusId || null,
        totalNodeCount: matchedNodes.length,
        nodeCount: pageNodes.length,
        edgeCount: matchedEdges.length,
        offset,
        hasMore: offset + pageNodes.length < matchedNodes.length,
        nodes: compact ? pageNodes.map(toCompactNodeRecord) : pageNodes,
        edges: matchedEdges,
    };
}
export function queryArchitectureImpact(seedIds, model = EMPTY_TTI_LEVEL_MODEL, opts = {}) {
    if (opts.intent !== undefined && !TUX_MAP_VALID_BLAST_INTENTS.has(opts.intent)) {
        const clippedIntent = clipDisplayId(String(opts.intent), 64);
        return {
            error: `Invalid blast intent '${clippedIntent}'; expected one of: default, patch, refactor, cut, supply-chain.`,
            unknownIds: [],
            suggestions: [...TUX_MAP_VALID_BLAST_INTENTS],
        };
    }
    const idx = getMapQueryIndex(model);
    const rawSeeds = [];
    const seenReq = new Set();
    const iter = typeof seedIds === "string" ? [seedIds] : seedIds;
    for (const s of iter) {
        if (s && !seenReq.has(s)) {
            seenReq.add(s);
            rawSeeds.push(s);
        }
    }
    if (rawSeeds.length === 0) {
        return {
            error: "At least one seed node ID is required.",
            unknownIds: [],
            suggestions: [],
        };
    }
    const missing = rawSeeds.filter((id) => !idx.nodes.has(id));
    if (missing.length > 0) {
        return buildUnknownNodeError(missing, idx.nodes);
    }
    const rawMaxHops = opts.maxHops === undefined ? 32 : opts.maxHops;
    const maxHops = Number.isFinite(rawMaxHops) ? Math.max(0, Math.floor(rawMaxHops)) : 32;
    const includePlanned = opts.includePlanned ?? false;
    const bridgeUncovered = opts.bridgeUncovered ?? true;
    const links = !includePlanned && bridgeUncovered
        ? idx.effectiveLinks
        : extractModelLinks(model, { includePlanned, bridgeUncovered, parentOf: idx.parentOf });
    const coarseParentSteps = [];
    const redirectParentByLink = new WeakMap();
    let blastLinks = links;
    const hasCodeLinks = resolveModelRawLinks(model).length > 0;
    if (!hasCodeLinks && opts.allowCoarseParentStep !== false && maxHops >= 1) {
        const incomingTargets = new Set(links.map((l) => l.to));
        const coarseRepresentativeByParent = new Map();
        for (const s of rawSeeds) {
            const n = idx.nodes.get(s);
            const pid = idx.parentOf.get(s);
            if (n?.level === 3 &&
                (idx.kidsOf.get(s)?.length ?? 0) === 0 &&
                !incomingTargets.has(s) &&
                pid &&
                idx.nodes.has(pid) &&
                incomingTargets.has(pid) &&
                !mapAncestorsOf(pid, idx.parentOf).some((anc) => seenReq.has(anc))) {
                coarseParentSteps.push({
                    seedId: s,
                    parentId: pid,
                    reason: "Component has no direct links; stepped via enclosing container C4 relationships.",
                });
                if (!coarseRepresentativeByParent.has(pid)) {
                    coarseRepresentativeByParent.set(pid, s);
                }
            }
        }
        if (coarseRepresentativeByParent.size > 0) {
            const redirected = [...links];
            for (const [pid, repSeed] of coarseRepresentativeByParent.entries()) {
                for (const l of links) {
                    if (l.to === pid && l.from !== repSeed) {
                        const synLink = {
                            ...l,
                            to: repSeed,
                        };
                        redirectParentByLink.set(synLink, pid);
                        redirected.push(synLink);
                    }
                }
            }
            blastLinks = redirected;
        }
    }
    const blast = computeLinkBlastRadius(blastLinks, rawSeeds, idx.parentOf, { ...opts, maxHops, model });
    const coarseViaByHitId = new Map();
    if (coarseParentSteps.length > 0) {
        for (const [id, h] of blast.hits.entries()) {
            const directParent = redirectParentByLink.get(h.via);
            if (directParent) {
                coarseViaByHitId.set(id, directParent);
            }
            else {
                const inherited = coarseViaByHitId.get(h.via.to);
                if (inherited)
                    coarseViaByHitId.set(id, inherited);
            }
        }
    }
    const reqSet = new Set(rawSeeds);
    const allSeeds = [...blast.seeds];
    const descendantIds = [];
    for (const s of allSeeds) {
        if (!reqSet.has(s))
            descendantIds.push(s);
    }
    const includeNodes = opts.includeNodes ?? (opts.compact === false);
    const allHits = [...blast.hits.entries()].map(([id, h]) => {
        const node = idx.nodes.get(id);
        const coarseVia = coarseViaByHitId.get(id);
        const hit = {
            id,
            hop: h.hop,
            ...(h.via.kind !== undefined ? { kind: h.via.kind } : {}),
            ...(h.at !== undefined ? { at: h.at } : {}),
            ...(h.sites !== undefined ? { sites: h.sites } : {}),
            ...(h.via.stop ? { stop: true } : {}),
            coupling: inferLinkCoupling(h.via),
            phase: inferLinkPhase(h.via),
            ...(node?.name !== undefined ? { name: node.name } : {}),
            ...(node?.level !== undefined ? { level: node.level } : {}),
            ...(coarseVia ? { coarseParentVia: coarseVia } : {}),
            ...(includeNodes && node ? { node } : {}),
        };
        return hit;
    });
    const offset = Number.isFinite(opts.offset) ? Math.max(0, Math.floor(opts.offset)) : 0;
    const pagedHits = opts.limit !== undefined && opts.limit !== null
        ? allHits.slice(offset, offset + (Number.isFinite(opts.limit) ? Math.max(0, Math.floor(opts.limit)) : 0))
        : allHits.slice(offset);
    const includeDownstream = opts.includeDownstream ?? false;
    const downstreamDependencies = [];
    const downIds = [];
    if (includeDownstream) {
        const downstream = new Map();
        const downQ = allSeeds.map((id) => [id, 0]);
        for (let qi = 0; qi < downQ.length; qi++) {
            const [id, hop] = downQ[qi];
            if (hop >= maxHops)
                continue;
            for (const e of idx.depEdgesByFrom.get(id) ?? []) {
                if (!includePlanned && e.planned)
                    continue;
                if (!blast.seeds.has(e.to) && !downstream.has(e.to)) {
                    downstream.set(e.to, hop + 1);
                    downIds.push(e.to);
                    downQ.push([e.to, hop + 1]);
                }
            }
        }
        for (const [id, hop] of downstream.entries()) {
            const node = idx.nodes.get(id);
            downstreamDependencies.push({
                id,
                hop,
                ...(node?.name !== undefined ? { name: node.name } : {}),
                ...(node?.level !== undefined ? { level: node.level } : {}),
                ...(includeNodes && node ? { node } : {}),
            });
        }
    }
    const impactedSourceFiles = [];
    const seenPaths = new Set();
    for (const id of [...allSeeds, ...blast.hits.keys(), ...downIds]) {
        const src = idx.nodes.get(id)?.source;
        if (src && !seenPaths.has(src.path)) {
            seenPaths.add(src.path);
            impactedSourceFiles.push({
                path: src.path,
                ...(src.repo ? { repo: src.repo } : {}),
                ...(src.lineRange ? { lineRange: src.lineRange } : {}),
                ...(src.symbol ? { symbol: src.symbol } : {}),
            });
        }
    }
    const capList = (arr) => {
        if (opts.maxSummaryItems === undefined || opts.maxSummaryItems === null)
            return arr;
        const cap = Number.isFinite(opts.maxSummaryItems) ? Math.max(0, Math.floor(opts.maxSummaryItems)) : 0;
        return arr.slice(0, cap);
    };
    return {
        requestedSeeds: rawSeeds,
        seedCount: allSeeds.length,
        seeds: capList(allSeeds),
        descendantCount: descendantIds.length,
        descendantIds: opts.omitRedundantDescendants ? [] : capList(descendantIds),
        maxHops,
        truncated: blast.truncated,
        totalHitCount: allHits.length,
        hitCount: pagedHits.length,
        offset,
        hasMore: offset + pagedHits.length < allHits.length,
        hits: pagedHits,
        totalBlockerCount: blast.blockers.length,
        blockers: capList(blast.blockers),
        totalCoCutCount: blast.coCutCandidates.length,
        coCutCandidates: capList(blast.coCutCandidates),
        totalTestCount: blast.testsToRun.length,
        testsToRun: capList(blast.testsToRun),
        totalStampCount: blast.stampsToRebuild.length,
        stampsToRebuild: capList(blast.stampsToRebuild),
        totalBuildExecCount: blast.buildExecImpacted.length,
        buildExecImpacted: capList(blast.buildExecImpacted),
        totalHostCount: blast.hostsImpacted.length,
        hostsImpacted: capList(blast.hostsImpacted),
        coarseParentSteps,
        downstreamIncluded: includeDownstream,
        totalDownstreamCount: downstreamDependencies.length,
        downstreamDependencies: capList(downstreamDependencies),
        totalImpactedFileCount: impactedSourceFiles.length,
        impactedSourceFiles: capList(impactedSourceFiles),
    };
}
export function findArchitecturePath(fromNodeId, toNodeId, model = EMPTY_TTI_LEVEL_MODEL, opts = {}) {
    const idx = getMapQueryIndex(model);
    const missing = [];
    if (!idx.nodes.has(fromNodeId))
        missing.push(fromNodeId);
    if (!idx.nodes.has(toNodeId) && toNodeId !== fromNodeId)
        missing.push(toNodeId);
    if (missing.length > 0) {
        return buildUnknownNodeError(missing, idx.nodes);
    }
    const direction = opts.direction ?? "downstream";
    const includePlanned = opts.includePlanned ?? false;
    const compact = opts.compact ?? false;
    if (fromNodeId === toNodeId) {
        return {
            found: true,
            direction,
            hops: 0,
            nodeIds: [fromNodeId],
            ...(compact ? {} : { nodePath: [idx.nodes.get(fromNodeId)] }),
            edges: [],
        };
    }
    const fromSubtree = new Set([fromNodeId, ...collectSubtreeDescendants(fromNodeId, idx.kidsOf)]);
    const targetDescendantSet = new Set(collectSubtreeDescendants(toNodeId, idx.kidsOf));
    const queue = [fromNodeId];
    const prev = new Map();
    const visited = new Set([fromNodeId]);
    for (let qi = 0; qi < queue.length; qi++) {
        const curr = queue[qi];
        if (curr === toNodeId)
            break;
        const depEdges = direction === "downstream"
            ? (idx.depEdgesByFrom.get(curr) ?? [])
            : (idx.depEdgesByTo.get(curr) ?? []);
        for (const e of depEdges) {
            if (!includePlanned && e.planned)
                continue;
            const next = direction === "downstream" ? e.to : e.from;
            if (!visited.has(next)) {
                visited.add(next);
                prev.set(next, { prevId: curr, edge: e });
                if (next === toNodeId)
                    break;
                if (targetDescendantSet.has(next) &&
                    !targetDescendantSet.has(curr) &&
                    curr !== toNodeId &&
                    !visited.has(toNodeId)) {
                    visited.add(toNodeId);
                    prev.set(toNodeId, {
                        prevId: next,
                        edge: {
                            id: `inside-${next}-${toNodeId}`,
                            from: next,
                            to: toNodeId,
                            label: "inside",
                            level: idx.nodes.get(toNodeId).level,
                            kind: "parent-child",
                        },
                    });
                    break;
                }
                queue.push(next);
            }
        }
        if (visited.has(toNodeId))
            break;
        if (fromSubtree.has(curr)) {
            for (const e of idx.edgesByFrom.get(curr) ?? []) {
                if (e.kind !== "parent-child")
                    continue;
                const child = e.to;
                if (!visited.has(child)) {
                    visited.add(child);
                    const labelledEdge = e.label ? e : { ...e, label: "contains" };
                    prev.set(child, { prevId: curr, edge: labelledEdge });
                    if (child === toNodeId)
                        break;
                    queue.push(child);
                }
            }
        }
        if (visited.has(toNodeId))
            break;
    }
    if (!prev.has(toNodeId)) {
        return {
            found: false,
            direction,
            hops: -1,
            nodeIds: [],
            ...(compact ? {} : { nodePath: [] }),
            edges: [],
        };
    }
    const nodeIds = [];
    const pathNodes = [];
    const pathEdges = [];
    let cursor = toNodeId;
    while (cursor) {
        nodeIds.unshift(cursor);
        if (!compact) {
            const n = idx.nodes.get(cursor);
            if (n)
                pathNodes.unshift(n);
        }
        const step = prev.get(cursor);
        if (!step)
            break;
        pathEdges.unshift(step.edge);
        cursor = step.prevId;
    }
    return {
        found: true,
        direction,
        hops: pathEdges.length,
        nodeIds,
        ...(compact ? {} : { nodePath: pathNodes }),
        edges: pathEdges,
    };
}
export function queryArchitectureLayer(model = EMPTY_TTI_LEVEL_MODEL, opts = {}) {
    warnArchitectureDeprecatedOnce("queryArchitectureLayer", "Use queryArchitectureNodes() instead.");
    const res = queryArchitectureNodes(model, {
        level: opts.level,
        focusId: opts.focusId,
        includePlanned: opts.includePlanned,
        compact: false,
        includeEdges: true,
    });
    return {
        level: res.level,
        focusId: res.focusId,
        nodeCount: res.nodeCount,
        edgeCount: res.edgeCount,
        nodes: res.nodes,
        edges: res.edges,
    };
}
export function queryMultiLevelBlastRadius(nodeId, model = EMPTY_TTI_LEVEL_MODEL, maxHopsOrOpts = 32) {
    warnArchitectureDeprecatedOnce("queryMultiLevelBlastRadius", "Use queryArchitectureImpact() instead.");
    const idx = getMapQueryIndex(model);
    const root = idx.nodes.get(nodeId);
    if (!root) {
        const err = buildUnknownNodeError([nodeId], idx.nodes);
        return {
            error: err.error,
            unknownIds: err.unknownIds,
            suggestions: err.suggestions,
            availableNodeIds: err.suggestions,
        };
    }
    const blastOpts = typeof maxHopsOrOpts === "number" ? { maxHops: maxHopsOrOpts, model } : { ...maxHopsOrOpts, model };
    if (blastOpts.intent !== undefined && !TUX_MAP_VALID_BLAST_INTENTS.has(blastOpts.intent)) {
        const clippedIntent = clipDisplayId(String(blastOpts.intent), 64);
        return {
            error: `Invalid blast intent '${clippedIntent}'; expected one of: default, patch, refactor, cut, supply-chain.`,
            unknownIds: [],
            suggestions: [...TUX_MAP_VALID_BLAST_INTENTS],
            availableNodeIds: [],
        };
    }
    const rawMaxHops = blastOpts.maxHops === undefined ? 32 : blastOpts.maxHops;
    const maxHops = Number.isFinite(rawMaxHops) ? Math.max(0, Math.floor(rawMaxHops)) : 32;
    const includePlanned = blastOpts.includePlanned ?? false;
    const links = includePlanned ? extractModelLinks(model, { includePlanned: true, parentOf: idx.parentOf }) : idx.effectiveLinks;
    const blast = computeLinkBlastRadius(links, nodeId, idx.parentOf, { ...blastOpts, maxHops });
    const childTree = new Set();
    for (const s of blast.seeds) {
        if (s !== nodeId)
            childTree.add(s);
    }
    const downstream = new Map();
    const impactedEdgeIds = new Set();
    const downQ = [...blast.seeds].map((id) => [id, 0]);
    for (let qi = 0; qi < downQ.length; qi++) {
        const [id, hop] = downQ[qi];
        if (hop >= maxHops)
            continue;
        for (const e of idx.depEdgesByFrom.get(id) ?? []) {
            if (!includePlanned && e.planned)
                continue;
            impactedEdgeIds.add(e.id);
            if (!blast.seeds.has(e.to) && !downstream.has(e.to)) {
                downstream.set(e.to, hop + 1);
                downQ.push([e.to, hop + 1]);
            }
        }
    }
    for (const id of [...blast.seeds, ...blast.hits.keys()]) {
        for (const e of idx.depEdgesByTo.get(id) ?? []) {
            if (!includePlanned && e.planned)
                continue;
            if (blast.seeds.has(e.from) || blast.hits.has(e.from)) {
                impactedEdgeIds.add(e.id);
            }
        }
    }
    const allTouchedIds = new Set([
        ...blast.seeds,
        ...blast.hits.keys(),
        ...downstream.keys(),
    ]);
    const impactedFiles = [];
    const seenPaths = new Set();
    for (const id of allTouchedIds) {
        const src = idx.nodes.get(id)?.source;
        if (src && !seenPaths.has(src.path)) {
            seenPaths.add(src.path);
            impactedFiles.push(src);
        }
    }
    return {
        rootNode: root,
        maxHops,
        truncated: blast.truncated,
        descendantIds: [...childTree],
        upstreamDependents: [...blast.hits.entries()].map(([id, h]) => ({
            id,
            hop: h.hop,
            via: h.via,
            at: h.at,
            sites: h.sites,
            node: idx.nodes.get(id),
        })),
        downstreamDependencies: [...downstream.entries()].map(([id, hop]) => ({
            id,
            hop,
            node: idx.nodes.get(id),
        })),
        blockers: blast.blockers,
        coCutCandidates: blast.coCutCandidates,
        testsToRun: blast.testsToRun,
        stampsToRebuild: blast.stampsToRebuild,
        buildExecImpacted: blast.buildExecImpacted,
        hostsImpacted: blast.hostsImpacted,
        impactedEdgeIds: [...impactedEdgeIds],
        impactedSourceFiles: impactedFiles,
    };
}
export function findShortestArchitecturePath(fromNodeId, toNodeId, model = EMPTY_TTI_LEVEL_MODEL) {
    warnArchitectureDeprecatedOnce("findShortestArchitecturePath", "Use findArchitecturePath() instead.");
    const res = findArchitecturePath(fromNodeId, toNodeId, model, { compact: false });
    if ("error" in res) {
        return { error: res.error, unknownIds: res.unknownIds, suggestions: res.suggestions };
    }
    return {
        found: res.found,
        hops: res.hops,
        nodePath: res.nodePath ?? [],
        edges: res.edges,
    };
}
const activeAcpLeases = new Map();
export function coordinateAcpSubgraphLease(action, opts = {}) {
    warnArchitectureDeprecatedOnce("coordinateAcpSubgraphLease", "In-process ACP leases do not coordinate across processes; use computeGraphDelta() and queryArchitectureImpact() instead.");
    const now = Date.now();
    for (const [id, lease] of activeAcpLeases.entries()) {
        const exp = Date.parse(lease.expiresAt);
        if (!Number.isFinite(exp) || exp <= now) {
            activeAcpLeases.delete(id);
        }
    }
    if (action === "list") {
        return {
            activeLeaseCount: activeAcpLeases.size,
            leases: [...activeAcpLeases.values()],
        };
    }
    if (action === "release") {
        const removed = (opts.leaseId && activeAcpLeases.delete(opts.leaseId)) ||
            (opts.agentId &&
                (() => {
                    let count = 0;
                    for (const [k, v] of activeAcpLeases.entries()) {
                        if (v.agentId === opts.agentId && (!opts.rootNodeId || v.rootNodeId === opts.rootNodeId)) {
                            activeAcpLeases.delete(k);
                            count++;
                        }
                    }
                    return count > 0;
                })());
        return {
            released: Boolean(removed),
            activeLeaseCount: activeAcpLeases.size,
            leases: [...activeAcpLeases.values()],
        };
    }
    const agentId = opts.agentId || "agent-anonymous";
    const rootNodeId = opts.rootNodeId;
    if (!rootNodeId) {
        return { acquired: false, error: "rootNodeId is required to acquire an ACP subgraph lease." };
    }
    const model = opts.model || EMPTY_TTI_LEVEL_MODEL;
    const idx = getMapQueryIndex(model);
    if (!idx.nodes.has(rootNodeId)) {
        const err = buildUnknownNodeError([rootNodeId], idx.nodes);
        return { acquired: false, error: err.error, suggestions: err.suggestions };
    }
    const descendants = collectSubtreeDescendants(rootNodeId, idx.kidsOf);
    const requestedScope = new Set([rootNodeId, ...descendants]);
    const requestedFiles = new Set();
    for (const id of requestedScope) {
        const p = idx.nodes.get(id)?.source?.path;
        if (p)
            requestedFiles.add(p);
    }
    for (const existing of activeAcpLeases.values()) {
        if (existing.agentId === agentId)
            continue;
        const nodeOverlap = existing.scopeNodeIds.filter((id) => requestedScope.has(id));
        const fileOverlap = existing.lockedFiles.filter((f) => requestedFiles.has(f));
        if (nodeOverlap.length > 0 || fileOverlap.length > 0) {
            return {
                acquired: false,
                conflict: {
                    heldByAgent: existing.agentId,
                    leaseId: existing.leaseId,
                    rootNodeId: existing.rootNodeId,
                    overlappingNodes: nodeOverlap,
                    overlappingFiles: fileOverlap,
                },
            };
        }
    }
    const rawTtl = opts.ttlSeconds !== undefined && Number.isFinite(opts.ttlSeconds) ? opts.ttlSeconds : 900;
    const clampedTtlSeconds = Math.min(86400, Math.max(1, Math.floor(rawTtl)));
    const ttlMs = clampedTtlSeconds * 1000;
    const lease = {
        leaseId: `lease-${agentId}-${rootNodeId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        agentId,
        rootNodeId,
        scopeNodeIds: [...requestedScope],
        lockedFiles: [...requestedFiles],
        acquiredAt: new Date(now).toISOString(),
        expiresAt: new Date(now + ttlMs).toISOString(),
    };
    activeAcpLeases.set(lease.leaseId, lease);
    return {
        acquired: true,
        lease,
        activeLeaseCount: activeAcpLeases.size,
    };
}
export const TUX_MAP_SEARCH_GROUPS = [
    "Components",
    "Folders",
    "Files",
    "Functions",
    "Routes",
];
const SEARCH_GROUP_RANK = new Map(TUX_MAP_SEARCH_GROUPS.map((g, i) => [g, i]));
const MODEL_SEARCH_INDEX_CACHE = new WeakMap();
const HTTP_ROUTE_TEXT_RE = /^(?:(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+)?(\/[^\s,;]*)$/i;
function computeAsciiMask(s) {
    let mask = 0;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        if (c >= 97 && c <= 122) {
            mask |= 1 << (c - 97);
        }
        else if (c >= 65 && c <= 90) {
            mask |= 1 << (c - 65);
        }
        else if (c >= 48 && c <= 57) {
            mask |= 1 << (26 + ((c - 48) & 3));
        }
        else if (c === 47) {
            mask |= 1 << 30;
        }
        else if (c === 45 || c === 95 || c === 46) {
            mask |= 1 << 31;
        }
    }
    return mask;
}
function compileSafeRouteRegex(pattern) {
    const trimmed = pattern.trim();
    if (!trimmed || trimmed.length > 256 || !trimmed.includes("/"))
        return undefined;
    if (!trimmed.includes("{") && !trimmed.includes(":") && !trimmed.includes("([^/]+)")) {
        return undefined;
    }
    const escaped = trimmed
        .replace(/^\^+|\$+$/g, "")
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\\\{[a-zA-Z0-9_.-]+\\\}/g, "[^/]+")
        .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, "[^/]+")
        .replace(/\\\(\\\[\\\^\/\\\]\\\+\\\)/g, "[^/]+");
    try {
        return new RegExp(`^${escaped}\\/?$`, "i");
    }
    catch {
        return undefined;
    }
}
function classifySearchGroup(id, kind, name, tech, hasSourcePath) {
    if (kind === "route" || isKindNodeId(id, "r"))
        return "Routes";
    if (kind === "symbol" || kind === "function" || kind === "class" || kind === "constant" || isKindNodeId(id, "s")) {
        return "Functions";
    }
    if (kind === "folder" ||
        isKindNodeId(id, "d") ||
        (kind === "module" && !hasSourcePath && (name.endsWith("/") || /\bfolder\b/i.test(tech || "")))) {
        return "Folders";
    }
    if (kind === "file" || isKindNodeId(id, "f") || kind === "module" || kind === "schema")
        return "Files";
    return "Components";
}
function makeSearchEntry(raw) {
    const nameLower = raw.name.toLowerCase();
    const normPath = raw.path.replace(/\\/g, "/");
    const pathLower = normPath.toLowerCase();
    const segmentsLower = pathLower ? pathLower.split("/").filter(Boolean) : [];
    const lastSeg = segmentsLower.length > 0 ? segmentsLower[segmentsLower.length - 1] : nameLower;
    const baseLower = raw.group === "Files" || raw.group === "Folders" ? lastSeg || nameLower : nameLower;
    const stemLower = baseLower
        .replace(/\(\)$/, "")
        .replace(/\/$/, "")
        .replace(/\.[a-z0-9]{1,6}$/i, "");
    const ancestorsText = raw.ancestors.join(" › ");
    const ancestorsLower = ancestorsText.toLowerCase();
    const techLower = raw.tech.toLowerCase();
    const kindLower = raw.kind.toLowerCase();
    const routeLower = (raw.routePattern || "").toLowerCase();
    const combined = `${nameLower}\n${pathLower}\n${ancestorsLower}\n${techLower}\n${kindLower}\n${routeLower}`;
    return {
        ...raw,
        path: normPath,
        ancestorsText,
        nameLower,
        baseLower,
        stemLower,
        pathLower,
        segmentsLower,
        ancestorsLower,
        techLower,
        kindLower,
        routeLower,
        charMask: computeAsciiMask(combined),
        routeRegex: raw.routePattern ? compileSafeRouteRegex(raw.routePattern) : undefined,
    };
}
function walkSearchChildren(addNode, ownerId, ownerLvl, kids, seen = new Set()) {
    if (!kids?.length || seen.has(ownerId) || seen.size > MAX_TREE_DEPTH)
        return;
    seen.add(ownerId);
    for (const c of asObjArray(kids)) {
        if (!c.id)
            continue;
        addNode({
            id: c.id,
            name: c.name || c.id,
            kind: c.kind || "module",
            level: ownerLvl + 1,
            parentId: ownerId,
            tech: c.tech,
            status: c.status,
            source: c.source,
        });
        walkSearchChildren(addNode, c.id, ownerLvl + 1, c.children, seen);
    }
    seen.delete(ownerId);
}
function addSubgraphSearchNodes(addNode, model, parentOf, resolvedOwner, sg) {
    const lvl = isLevel3Focus(resolvedOwner, model)
        ? 3
        : levelForFocus(resolvedOwner, model, parentOf);
    for (const e of asObjArray(sg.elements)) {
        addNode({
            id: e.id,
            name: e.name || e.id,
            kind: e.kind || "module",
            level: lvl,
            parentId: resolvedOwner,
            tech: e.tech,
            status: e.status,
            source: e.source,
        });
        walkSearchChildren(addNode, e.id, lvl, e.children);
    }
}
function searchRouteLinks(model) {
    return resolveModelRawLinks(model).filter((l) => (l.kind === "handled-by" || l.kind === "routes") && Boolean(l.from) && Boolean(l.to));
}
function searchHandlersByRoute(routeLinks, getNode) {
    const handlerByRouteId = new Map();
    for (const l of routeLinks) {
        if (l.kind === "handled-by" && getNode(l.to)) {
            if (!handlerByRouteId.has(l.from))
                handlerByRouteId.set(l.from, l.to);
        }
        else if (l.kind === "routes" &&
            (isKindNodeId(l.from, "r") || getNode(l.from)?.kind === "route") &&
            getNode(l.to)) {
            if (!handlerByRouteId.has(l.from))
                handlerByRouteId.set(l.from, l.to);
        }
    }
    return handlerByRouteId;
}
function searchRouteTargets(routeLinks, getNode) {
    const named = new Map();
    const covered = new Set();
    for (const l of routeLinks) {
        const from = getNode(l.from);
        if (!from || !(from.kind === "route" || isKindNodeId(from.id, "r")))
            continue;
        if (!named.has(l.from))
            named.set(l.from, l.to);
        covered.add(l.to);
    }
    return { named, covered };
}
function handlerLabelOfId(id) {
    const rest = stripNodeKindPrefix(id);
    const hash = rest.lastIndexOf("#");
    return hash >= 0 ? rest.slice(hash + 1) : rest;
}
function fileNodeIdOfSymbolId(id) {
    const { kind, rest } = splitNodeId(id);
    const hash = rest.lastIndexOf("#");
    const head = id.slice(0, id.length - rest.length);
    if (kind !== "s" || hash <= 0 || rest.startsWith("pkg:") || !head.endsWith("s:"))
        return "";
    return `${head.slice(0, -2)}f:${rest.slice(0, hash)}`;
}
function searchAncestorNames(id, parentOf, getNode) {
    const chain = mapAncestorsOf(id, parentOf);
    const names = [];
    for (let i = chain.length - 1; i >= 1; i--) {
        const ancId = chain[i];
        const n = getNode(ancId);
        names.push(n?.name || ancId);
    }
    if (names.length === 0) {
        const n = getNode(id);
        if (n?.parentId) {
            const pNode = getNode(n.parentId);
            names.push(pNode?.name || n.parentId);
        }
    }
    return names;
}
function pushNodeSearchEntries(entries, seenRouteKeys, list, getNode, parentOf, handlerByRouteId, routeTargets) {
    for (const n of list) {
        const srcPath = n.source?.path || repoPathForNodeId(n.id);
        const group = classifySearchGroup(n.id, n.kind, n.name, n.tech, Boolean(n.source?.path));
        const ancestors = searchAncestorNames(n.id, parentOf, getNode);
        const linkedHandlerId = group === "Routes" ? handlerByRouteId.get(n.id) : undefined;
        const handlerNode = linkedHandlerId ? getNode(linkedHandlerId) : undefined;
        const namedHandlerId = group === "Routes" && !handlerNode ? routeTargets.named.get(n.id) : undefined;
        const handlerName = handlerNode?.name || (namedHandlerId ? handlerLabelOfId(namedHandlerId) : undefined);
        const routePattern = group === "Routes" ? (isKindNodeId(n.id, "r") ? splitNodeId(n.id).rest : n.name) : undefined;
        if (routePattern) {
            seenRouteKeys.add(`${routePattern.toLowerCase()}\u0000${linkedHandlerId || n.id}`);
        }
        entries.push(makeSearchEntry({
            id: n.id,
            revealId: linkedHandlerId || n.id,
            group,
            level: handlerNode?.level ?? n.level,
            kind: n.kind,
            name: n.name,
            path: handlerNode?.source?.path || (namedHandlerId && repoPathForNodeId(namedHandlerId)) || srcPath,
            ancestors,
            tech: group === "Routes" ? [n.tech, handlerName].filter(Boolean).join(" · ") : n.tech || "",
            routePattern,
            handlerName,
            planned: n.status === "planned",
        }));
        if (group !== "Routes" && !routeTargets.covered.has(n.id)) {
            for (const candidate of [n.tech, n.source?.symbol]) {
                if (!candidate)
                    continue;
                const m = candidate.trim().match(HTTP_ROUTE_TEXT_RE);
                if (!m)
                    continue;
                const method = m[1] ? m[1].toUpperCase() : "";
                const pat = m[2];
                const disp = method ? `${method} ${pat}` : pat;
                const rKey = `${disp.toLowerCase()}\u0000${n.id}`;
                if (seenRouteKeys.has(rKey))
                    continue;
                seenRouteKeys.add(rKey);
                routeTargets.listedByTech.add(n.id);
                entries.push(makeSearchEntry({
                    id: `route:${disp}->${n.id}`,
                    revealId: n.id,
                    group: "Routes",
                    level: n.level,
                    kind: "route",
                    name: disp,
                    path: srcPath,
                    ancestors: [...ancestors, n.name],
                    tech: n.name,
                    routePattern: pat,
                    handlerName: n.name,
                    planned: n.status === "planned",
                }));
            }
        }
    }
}
function routeTableSearchEntries(model, nodeRouteKeys, getNode, parentOf, routeTargets) {
    const entries = [];
    const seenRouteKeys = new Set();
    for (const rt of asObjArray(model?.routes)) {
        if (typeof rt.pattern !== "string" || !rt.pattern.trim())
            continue;
        const method = typeof rt.method === "string" && rt.method.trim() ? rt.method.trim().toUpperCase() : "";
        const pat = rt.pattern.trim();
        const disp = method ? `${method} ${pat}` : pat;
        const handlerId = typeof rt.handler === "string" && rt.handler ? rt.handler : "";
        if (handlerId && routeTargets.covered.has(handlerId))
            continue;
        const handlerNode = handlerId ? getNode(handlerId) : undefined;
        const revealId = handlerNode ? handlerNode.id : handlerId || `r:${disp}`;
        const rKey = `${disp.toLowerCase()}\u0000${revealId}`;
        if (nodeRouteKeys.has(rKey) || seenRouteKeys.has(rKey))
            continue;
        seenRouteKeys.add(rKey);
        const opens = handlerNode ?? (handlerId ? getNode(fileNodeIdOfSymbolId(handlerId)) : undefined);
        const ancestors = opens ? [...searchAncestorNames(opens.id, parentOf, getNode), opens.name] : [];
        entries.push(makeSearchEntry({
            id: `route:${disp}->${revealId}`,
            revealId: opens ? opens.id : revealId,
            group: "Routes",
            level: opens?.level ?? 5,
            kind: "route",
            name: disp,
            path: opens?.source?.path || "",
            ancestors,
            tech: [rt.framework, handlerNode?.name || handlerId].filter(Boolean).join(" · "),
            routePattern: pat,
            handlerName: handlerNode?.name || handlerId || undefined,
            planned: handlerNode?.status === "planned",
        }));
    }
    return entries;
}
const SEARCH_INDEX_KEEP = new WeakMap();
function buildSearchIndex(model, parentOf, keepInto) {
    const subgraphOwners = collectSubgraphOwners(model);
    const nodes = new Map();
    const addNode = (n) => {
        if (n.id && !nodes.has(n.id))
            nodes.set(n.id, n);
    };
    const walkChildren = (ownerId, ownerLvl, kids) => walkSearchChildren(addNode, ownerId, ownerLvl, kids);
    for (const e of asObjArray(model?.level1?.elements)) {
        addNode({ id: e.id, name: e.name || e.id, kind: e.kind || "system", level: 1, tech: e.tech, status: e.status, source: e.source });
    }
    const sysBoundary = model?.level2?.boundary || undefined;
    for (const e of asObjArray(model?.level2?.elements)) {
        if (e.ref)
            continue;
        addNode({
            id: e.id,
            name: e.name || e.id,
            kind: e.kind || "container",
            level: 2,
            parentId: sysBoundary,
            tech: e.tech,
            status: e.status,
            source: e.source,
        });
        walkChildren(e.id, 4, e.children);
    }
    if (isPlainRecord(model?.level3)) {
        for (const [cid, comps] of Object.entries(model.level3)) {
            if (!hasOwn(model.level3, cid))
                continue;
            for (const e of asObjArray(comps)) {
                addNode({
                    id: e.id,
                    name: e.name || e.id,
                    kind: e.kind || "component",
                    level: 3,
                    parentId: cid,
                    tech: e.tech,
                    status: e.status,
                    source: e.source,
                });
                walkChildren(e.id, 4, e.children);
            }
        }
    }
    for (const dn of asObjArray(model?.level4?.nodes)) {
        addNode({
            id: dn.id,
            name: dn.title || dn.id,
            kind: dn.kind || "resource",
            level: 4,
            parentId: dn.group,
            tech: dn.facts?.type || dn.facts?.sku || dn.facts?.size,
            status: dn.status,
            source: dn.source,
        });
        walkChildren(dn.id, 4, dn.children);
    }
    const owners = [];
    if (isPlainRecord(model?.subgraphs)) {
        for (const [ownerId, sg] of Object.entries(model.subgraphs)) {
            if (!hasOwn(model.subgraphs, ownerId) || !isPlainRecord(sg))
                continue;
            const resolvedOwner = subgraphOwners.get(ownerId) ?? ownerId;
            if (keepInto)
                owners.push(resolvedOwner);
            addSubgraphSearchNodes(addNode, model, parentOf, resolvedOwner, sg);
        }
    }
    const getNode = (id) => nodes.get(id);
    const routeLinks = searchRouteLinks(model);
    const handlerByRouteId = searchHandlersByRoute(routeLinks, getNode);
    const routeTargets = { ...searchRouteTargets(routeLinks, getNode), listedByTech: new Set() };
    const nodeEntries = [];
    const nodeRouteKeys = new Set();
    pushNodeSearchEntries(nodeEntries, nodeRouteKeys, nodes.values(), getNode, parentOf, handlerByRouteId, routeTargets);
    const routeEntries = routeTableSearchEntries(model, nodeRouteKeys, getNode, parentOf, routeTargets);
    if (!keepInto) {
        for (const e of routeEntries)
            nodeEntries.push(e);
        return nodeEntries;
    }
    keepInto.keep = { model, parentOf, nodes, nodeEntries, nodeRouteKeys, routeLinks, handlerByRouteId, routeTargets, owners };
    return [...nodeEntries, ...routeEntries];
}
function extendSearchIndex(keep, model, parentOf, added) {
    const key = added.key;
    const sg = isPlainRecord(model.subgraphs) && hasOwn(model.subgraphs, key) ? model.subgraphs[key] : undefined;
    if (!isPlainRecord(sg))
        return null;
    if (isPlainRecord(model.level3) && hasOwn(model.level3, key) && Array.isArray(model.level3[key]) && model.level3[key].length === 0) {
        return null;
    }
    const nodes = keep.nodes;
    let passedThrough = keep.passedThrough;
    if (!passedThrough) {
        passedThrough = new Set(keep.parentOf.values());
        for (const n of nodes.values())
            if (n.parentId)
                passedThrough.add(n.parentId);
        for (const owner of keep.owners)
            passedThrough.add(owner);
    }
    const newlyParented = parentsAddedBy(keep.parentOf, added.owner, added.elements);
    for (const id of newlyParented.keys()) {
        if (nodes.has(id) || passedThrough.has(id))
            return null;
    }
    const arrived = new Map();
    addSubgraphSearchNodes((n) => {
        if (n.id && !nodes.has(n.id) && !arrived.has(n.id))
            arrived.set(n.id, n);
    }, model, parentOf, added.owner, sg);
    for (const id of arrived.keys()) {
        if (passedThrough.has(id))
            return null;
    }
    const getNode = (id) => nodes.get(id) ?? arrived.get(id);
    const handlerByRouteId = searchHandlersByRoute(keep.routeLinks, getNode);
    for (const [routeId, handlerId] of handlerByRouteId) {
        if (nodes.has(routeId) && keep.handlerByRouteId.get(routeId) !== handlerId)
            return null;
    }
    const routeTargets = {
        ...searchRouteTargets(keep.routeLinks, getNode),
        listedByTech: keep.routeTargets.listedByTech,
    };
    for (const handlerId of routeTargets.covered) {
        if (routeTargets.listedByTech.has(handlerId) && !keep.routeTargets.covered.has(handlerId))
            return null;
    }
    for (const pid of newlyParented.values())
        passedThrough.add(pid);
    passedThrough.add(added.owner);
    for (const n of arrived.values())
        nodes.set(n.id, n);
    keep.passedThrough = passedThrough;
    keep.model = model;
    keep.parentOf = parentOf;
    keep.handlerByRouteId = handlerByRouteId;
    keep.routeTargets = routeTargets;
    pushNodeSearchEntries(keep.nodeEntries, keep.nodeRouteKeys, arrived.values(), getNode, parentOf, handlerByRouteId, routeTargets);
    return [...keep.nodeEntries, ...routeTableSearchEntries(model, keep.nodeRouteKeys, getNode, parentOf, routeTargets)];
}
export function buildMapSearchIndex(model = EMPTY_TTI_LEVEL_MODEL) {
    const isObjModel = model != null && typeof model === "object";
    const stamp = isObjModel ? modelCacheStamp(model) : "empty";
    const cached = isObjModel ? MODEL_SEARCH_INDEX_CACHE.get(model) : undefined;
    if (cached && cached.stamp === stamp)
        return cached.entries;
    const entries = buildSearchIndex(model, buildMapParentIndex(model));
    if (isObjModel) {
        MODEL_SEARCH_INDEX_CACHE.set(model, { stamp, entries });
    }
    return entries;
}
export function buildMapSearchIndexKept(model, parentOf, prev, added) {
    const keep = prev ? SEARCH_INDEX_KEEP.get(prev) : undefined;
    if (prev && keep) {
        SEARCH_INDEX_KEEP.delete(prev);
        if (added && keep.model === added.from) {
            const next = extendSearchIndex(keep, model, parentOf, added);
            if (next) {
                SEARCH_INDEX_KEEP.set(next, keep);
                return next;
            }
        }
    }
    const into = {};
    const entries = buildSearchIndex(model, parentOf, into);
    if (into.keep)
        SEARCH_INDEX_KEEP.set(entries, into.keep);
    return entries;
}
function isWordBoundary(str, idx) {
    if (idx <= 0)
        return true;
    const prev = str.charCodeAt(idx - 1);
    return (prev === 47 ||
        prev === 45 ||
        prev === 95 ||
        prev === 46 ||
        prev === 58 ||
        prev === 35 ||
        prev === 32);
}
function subsequenceScore(q, target) {
    const qLen = q.length;
    const tLen = target.length;
    if (qLen === 0 || qLen > tLen)
        return 0;
    let qi = 0;
    let bonus = 0;
    let firstIdx = -1;
    let prevMatchIdx = -2;
    for (let ti = 0; ti < tLen && qi < qLen; ti++) {
        if (target.charCodeAt(ti) === q.charCodeAt(qi)) {
            if (firstIdx < 0)
                firstIdx = ti;
            if (ti === prevMatchIdx + 1) {
                bonus += 18;
            }
            else if (isWordBoundary(target, ti)) {
                bonus += 14;
            }
            prevMatchIdx = ti;
            qi++;
        }
    }
    if (qi < qLen)
        return 0;
    const spanPenalty = Math.min(80, prevMatchIdx - firstIdx + 1 - qLen);
    const startBonus = firstIdx === 0 ? 35 : isWordBoundary(target, firstIdx) ? 20 : 0;
    return Math.max(40, 220 + bonus + startBonus - spanPenalty);
}
function pathSegmentScore(qParts, segs) {
    if (qParts.length === 0 || segs.length === 0 || qParts.length > segs.length)
        return 0;
    let si = 0;
    let bonus = 0;
    for (let pi = 0; pi < qParts.length; pi++) {
        const qp = qParts[pi];
        let matched = false;
        while (si < segs.length) {
            const seg = segs[si];
            si++;
            if (seg === qp) {
                bonus += pi === qParts.length - 1 ? 140 : 70;
                matched = true;
                break;
            }
            if (seg.startsWith(qp)) {
                bonus += pi === qParts.length - 1 ? 110 : 55;
                matched = true;
                break;
            }
            const subIdx = seg.indexOf(qp);
            if (subIdx > 0) {
                bonus += 35;
                matched = true;
                break;
            }
        }
        if (!matched)
            return 0;
    }
    return 680 + bonus - segs.length * 3;
}
function scoreSearchEntry(e, q, qMask, qSlashParts, qUrlPath) {
    const maskHit = (e.charMask & qMask) === qMask;
    if (!maskHit && !(qUrlPath && e.routeRegex))
        return 0;
    let best = 0;
    if (e.group === "Routes") {
        if (e.nameLower === q || e.routeLower === q)
            best = 1480;
        else if (e.routeLower && e.routeLower.startsWith(q))
            best = Math.max(best, 1080 - e.routeLower.length);
        else if (e.nameLower.startsWith(q))
            best = Math.max(best, 1060 - e.nameLower.length);
        else if (qUrlPath && e.routeRegex && e.routeRegex.test(qUrlPath))
            best = Math.max(best, 1020);
        else if (e.nameLower.includes(q))
            best = Math.max(best, 760 - e.nameLower.indexOf(q) * 3);
    }
    if (!maskHit)
        return best;
    if (e.stemLower === q || e.baseLower === q || e.nameLower === q) {
        best = Math.max(best, 1450 - Math.min(40, e.nameLower.length));
    }
    else if (e.stemLower.startsWith(q) || e.baseLower.startsWith(q)) {
        best = Math.max(best, 1050 - Math.min(60, e.baseLower.length * 2));
    }
    else if (e.nameLower.startsWith(q)) {
        best = Math.max(best, 980 - Math.min(60, e.nameLower.length));
    }
    else {
        const baseIdx = e.baseLower.indexOf(q);
        if (baseIdx > 0) {
            best = Math.max(best, (isWordBoundary(e.baseLower, baseIdx) ? 840 : 660) - baseIdx * 4);
        }
        const nameIdx = e.nameLower.indexOf(q);
        if (nameIdx > 0) {
            best = Math.max(best, (isWordBoundary(e.nameLower, nameIdx) ? 810 : 630) - nameIdx * 3);
        }
    }
    const pathOwnerDiscount = e.group === "Routes" || e.group === "Functions" ? 40 : 0;
    if (qSlashParts && e.segmentsLower.length > 0) {
        const ps = pathSegmentScore(qSlashParts, e.segmentsLower) - pathOwnerDiscount;
        if (ps > best)
            best = ps;
    }
    if (e.pathLower) {
        if (e.pathLower === q)
            best = Math.max(best, 1420 - pathOwnerDiscount);
        else {
            const pIdx = e.pathLower.indexOf(q);
            if (pIdx >= 0) {
                best = Math.max(best, (isWordBoundary(e.pathLower, pIdx) ? 740 : 540) - Math.min(80, pIdx * 2) - pathOwnerDiscount);
            }
        }
    }
    if (best < 500 && q.length >= 2) {
        const subBase = subsequenceScore(q, e.baseLower);
        if (subBase > 0)
            best = Math.max(best, subBase + 160);
        const subName = e.nameLower !== e.baseLower ? subsequenceScore(q, e.nameLower) : 0;
        if (subName > 0)
            best = Math.max(best, subName + 120);
        const subPath = e.pathLower ? subsequenceScore(q, e.pathLower) : 0;
        if (subPath > 0)
            best = Math.max(best, subPath + 60);
        if (e.routeLower) {
            const subRoute = subsequenceScore(q, e.routeLower);
            if (subRoute > 0)
                best = Math.max(best, subRoute + 140);
        }
    }
    if (best === 0) {
        if (e.id.toLowerCase().includes(q))
            best = 420;
        else if (e.techLower && e.techLower.includes(q))
            best = 320;
        else if (e.ancestorsLower && e.ancestorsLower.includes(q))
            best = 260;
        else if (e.kindLower && e.kindLower.includes(q))
            best = 220;
    }
    if (best > 0) {
        if (e.group === "Files")
            best += 12;
        else if (e.group === "Components")
            best += 8;
        else if (e.group === "Routes" && qUrlPath)
            best += 14;
        if (e.planned)
            best -= 15;
    }
    return best;
}
export function searchArchitectureMap(modelOrEntries, query, opts = {}) {
    return searchMapEntries(Array.isArray(modelOrEntries) ? modelOrEntries : buildMapSearchIndex(modelOrEntries), query, opts);
}
export function searchMapEntries(entries, query, opts = {}) {
    const includePlanned = opts.includePlanned ?? true;
    const limitPerGroup = opts.limitPerGroup !== undefined && Number.isFinite(opts.limitPerGroup)
        ? Math.max(1, Math.floor(opts.limitPerGroup))
        : 200;
    const trimmed = String(query ?? "").trim();
    const q = trimmed.toLowerCase();
    const byGroup = new Map();
    for (const g of TUX_MAP_SEARCH_GROUPS)
        byGroup.set(g, []);
    if (!q) {
        let totalHits = 0;
        for (const e of entries) {
            if (!includePlanned && e.planned)
                continue;
            const bucket = byGroup.get(e.group);
            totalHits++;
            if (bucket.length < limitPerGroup) {
                bucket.push({ entry: e, score: 1 });
            }
        }
        const groups = [];
        const flatHits = [];
        for (const g of TUX_MAP_SEARCH_GROUPS) {
            const hits = byGroup.get(g);
            if (hits.length === 0)
                continue;
            groups.push({ group: g, hits, topScore: 1 });
            for (const h of hits)
                flatHits.push(h);
        }
        return { query: trimmed, totalHits, groups, flatHits };
    }
    const qMask = computeAsciiMask(q);
    const qSlashParts = q.includes("/") ? q.split("/").filter(Boolean) : null;
    const urlMatch = trimmed.match(HTTP_ROUTE_TEXT_RE);
    const qUrlPath = urlMatch ? urlMatch[2] : trimmed.startsWith("/") ? trimmed : null;
    let totalHits = 0;
    for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        if (!includePlanned && e.planned)
            continue;
        const score = scoreSearchEntry(e, q, qMask, qSlashParts, qUrlPath);
        if (score <= 0)
            continue;
        totalHits++;
        byGroup.get(e.group).push({ entry: e, score });
    }
    const groups = [];
    for (const g of TUX_MAP_SEARCH_GROUPS) {
        const hits = byGroup.get(g);
        if (hits.length === 0)
            continue;
        hits.sort((a, b) => b.score - a.score ||
            a.entry.name.length - b.entry.name.length ||
            cmpCodepoint(a.entry.id, b.entry.id));
        const topScore = hits[0].score;
        const capped = hits.length > limitPerGroup ? hits.slice(0, limitPerGroup) : hits;
        groups.push({ group: g, hits: capped, topScore });
    }
    groups.sort((a, b) => b.topScore - a.topScore ||
        (SEARCH_GROUP_RANK.get(a.group) ?? 0) - (SEARCH_GROUP_RANK.get(b.group) ?? 0));
    const flatHits = [];
    for (const grp of groups) {
        for (const h of grp.hits)
            flatHits.push(h);
    }
    return { query: trimmed, totalHits, groups, flatHits };
}
