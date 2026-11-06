// AUTO-GENERATED from app/utils/tuxArchitectureMap.ts by scripts/build-map-runtime.mjs — DO NOT EDIT.
// SPDX-License-Identifier: Apache-2.0 (adapts MIT geometry/graph routines; see app/utils/tuxArchitectureMap.ts)
// SOURCE-SHA256: ae970779c51a7c2491f79517ad96c4a67aedbee130efd380bab7e01a86de4a72
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
    module: "Module / package",
    schema: "Data schema / index",
    symbol: "Code symbol (AST)",
    route: "HTTP route",
    external: "External system",
    resource: "Deployment node",
};
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
    const placed = [];
    const cardEntries = [];
    for (const k of Object.keys(rects)) {
        const r = rects[k];
        if (!r.bound) {
            cardEntries.push([k, r]);
            placed.push({ x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 });
        }
    }
    const cards = placed.slice();
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
            for (let ci = 0; ci < cardEntries.length; ci++) {
                const r = cardEntries[ci][1];
                if (i === 0 && r === a)
                    continue;
                if (i === lastSeg && r === b)
                    continue;
                if (segHitsRect(p0[0], p0[1], p1[0], p1[1], r))
                    return false;
            }
        }
        return true;
    }
    const paths = [];
    const ports = {};
    for (const rel of rels) {
        const a = rects[rel.from];
        const b = rects[rel.to];
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
    const labels = [];
    const wireSegments = [];
    paths.forEach((p, idx) => {
        const pts = simplifyOrthogonalPoints(p.pts);
        for (let si = 0; si < pts.length - 1; si++) {
            wireSegments.push([pts[si], pts[si + 1], idx]);
        }
        wires.push({
            id: `w-${idx}-${p.rel.from}-${p.rel.to}`,
            from: p.rel.from,
            to: p.rel.to,
            d: roundOrthogonalCorners(pts),
            planned: p.rel.status === "planned",
        });
        if (p.rel.label) {
            const t1 = p.rel.label;
            const t2 = p.rel.tech || "";
            const w = Math.max(t1.length * 6.1, (t2.length + 2) * 5.5) + 14;
            const h = t2 ? 32 : 19;
            const segs = [];
            for (let i = 0; i < pts.length - 1; i++) {
                const p0 = pts[i];
                const p1 = pts[i + 1];
                segs.push([p0, p1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1])]);
            }
            segs.sort((u, v) => v[2] - u[2]);
            const fractions = idx % 2 === 0
                ? [0.5, 0.34, 0.66, 0.24, 0.76, 0.18, 0.82]
                : [0.36, 0.64, 0.5, 0.24, 0.76, 0.18, 0.82];
            let box = null;
            for (let j = 0; j < segs.length && !box; j++) {
                const sg = segs[j];
                for (const f of fractions) {
                    const m = [
                        sg[0][0] + (sg[1][0] - sg[0][0]) * f,
                        sg[0][1] + (sg[1][1] - sg[0][1]) * f,
                    ];
                    const cand = { x: m[0] - w / 2, y: m[1] - h / 2, w, h };
                    const overlapsPlaced = placed.some((q) => cand.x < q.x + q.w &&
                        cand.x + cand.w > q.x &&
                        cand.y < q.y + q.h &&
                        cand.y + cand.h > q.y);
                    if (overlapsPlaced)
                        continue;
                    const clipsOtherWire = wireSegments.some(([s0, s1, wIdx]) => {
                        if (wIdx === idx)
                            return false;
                        const minX = Math.min(s0[0], s1[0]) - 2;
                        const maxX = Math.max(s0[0], s1[0]) + 2;
                        const minY = Math.min(s0[1], s1[1]) - 2;
                        const maxY = Math.max(s0[1], s1[1]) + 2;
                        return (cand.x < maxX &&
                            cand.x + cand.w > minX &&
                            cand.y < maxY &&
                            cand.y + cand.h > minY);
                    });
                    if (!clipsOtherWire) {
                        box = cand;
                        break;
                    }
                }
            }
            if (!box) {
                for (let j = 0; j < segs.length && !box; j++) {
                    const sg = segs[j];
                    for (const f of fractions) {
                        const m = [
                            sg[0][0] + (sg[1][0] - sg[0][0]) * f,
                            sg[0][1] + (sg[1][1] - sg[0][1]) * f,
                        ];
                        const cand = { x: m[0] - w / 2, y: m[1] - h / 2, w, h };
                        if (!placed.some((q) => cand.x < q.x + q.w &&
                            cand.x + cand.w > q.x &&
                            cand.y < q.y + q.h &&
                            cand.y + cand.h > q.y)) {
                            box = cand;
                            break;
                        }
                    }
                }
            }
            const forced = !box;
            if (forced) {
                let best = Infinity;
                for (const sg of segs) {
                    for (const f of [0.5, 0.35, 0.65, 0.22, 0.78, 0.15, 0.85]) {
                        const c = {
                            x: sg[0][0] + (sg[1][0] - sg[0][0]) * f - w / 2,
                            y: sg[0][1] + (sg[1][1] - sg[0][1]) * f - h / 2,
                            w,
                            h,
                        };
                        let cover = 0;
                        for (const q of cards) {
                            cover +=
                                Math.max(0, Math.min(c.x + w, q.x + q.w) - Math.max(c.x, q.x)) *
                                    Math.max(0, Math.min(c.y + h, q.y + q.h) - Math.max(c.y, q.y));
                        }
                        for (let pi = cards.length; pi < placed.length; pi++) {
                            const q = placed[pi];
                            cover +=
                                25 *
                                    Math.max(0, Math.min(c.x + w, q.x + q.w) - Math.max(c.x, q.x)) *
                                    Math.max(0, Math.min(c.y + h, q.y + q.h) - Math.max(c.y, q.y));
                        }
                        if (cover < best) {
                            best = cover;
                            box = c;
                        }
                    }
                }
            }
            if (box) {
                placed.push({ x: box.x - 2, y: box.y - 2, w: box.w + 4, h: box.h + 4 });
                labels.push({
                    id: `lbl-${idx}-${p.rel.from}-${p.rel.to}`,
                    from: p.rel.from,
                    to: p.rel.to,
                    x: Math.round(box.x),
                    y: Math.round(box.y),
                    w: Math.round(w),
                    h: Math.round(h),
                    t1,
                    t2,
                    forced,
                });
            }
        }
    });
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
    const activeLinks = links.filter((r) => rects[r.from] &&
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
export const TUX_MAP_VALID_BLAST_INTENTS = new Set([
    "default",
    "patch",
    "refactor",
    "cut",
    "supply-chain",
]);
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
function setOwnProp(obj, key, value) {
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
export function cmpCodepoint(a, b) {
    if (a === b)
        return 0;
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
        const spoofedRouteLoadContract = (k === "routes" || k === "links" || k === "loads") &&
            c !== "contract" &&
            c !== "runtime";
        const spoofedNonStopAux = !link.stop &&
            (k === "calls" || k === "runs" || k === "uses" || k === "imports" || k === "sources") &&
            (c === "build-exec" || c === "verification" || c === "artifact-stamp");
        const spoofedCallsBuildStamp = k === "calls" && (c === "build-exec" || c === "artifact-stamp");
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
    if (k === "tests" || k === "checks" || k === "suppresses")
        return "verification";
    if (k === "stamps" || k === "generates" || k === "provenance")
        return "artifact-stamp";
    if (k === "routes" ||
        k === "links" ||
        k === "handled-by" ||
        k === "reads-format" ||
        k === "copies" ||
        k === "copies-logic-of" ||
        k === "forks") {
        return "contract";
    }
    if (k === "loads" || k === "uses")
        return "runtime";
    if (k === "imports" || k === "sources")
        return link.stop ? "verification" : "contract";
    if (k === "calls" || k === "runs" || k === "reads" || k === "sends" || k === "denies") {
        return link.stop ? "verification" : "runtime";
    }
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
function collectSubgraphOwners(model) {
    const subgraphOwners = new Map();
    if (!model || typeof model !== "object")
        return subgraphOwners;
    const noteSubgraphRef = (ownerId, ref) => {
        if (ownerId && ref && typeof ref === "string" && ref !== ownerId && !subgraphOwners.has(ref)) {
            subgraphOwners.set(ref, ownerId);
        }
    };
    const scanInline = (pid, rawKids, depth = 0) => {
        if (depth >= MAX_TREE_DEPTH)
            return;
        const kids = asObjArray(rawKids);
        kids.forEach((k, i) => {
            const id = (typeof k.id === "string" && k.id) || `${pid}/${i}`;
            noteSubgraphRef(id, k.subgraphRef);
            if (Array.isArray(k.children) && k.children.length > 0) {
                scanInline(id, k.children, depth + 1);
            }
        });
    };
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
        }
    }
    return subgraphOwners;
}
export function buildMapParentIndex(model) {
    const parentOf = new Map();
    const subgraphOwners = collectSubgraphOwners(model);
    const inline = (pid, rawKids, depth = 0) => {
        if (!pid || depth >= MAX_TREE_DEPTH)
            return;
        const kids = asObjArray(rawKids);
        kids.forEach((k, i) => {
            const id = (typeof k.id === "string" && k.id) || `${pid}/${i}`;
            if (!parentOf.has(id))
                parentOf.set(id, pid);
            if (Array.isArray(k.children) && k.children.length > 0)
                inline(id, k.children, depth + 1);
        });
    };
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
export function levelForFocus(fid, model, parentOf = buildMapParentIndex(model)) {
    const walk = (id, seen) => {
        if (isLevel3Focus(id, model))
            return 3;
        const p = parentOf.get(id);
        if (!p || seen.has(p) || seen.size >= MAX_TREE_DEPTH || isLevel3Focus(p, model))
            return 5;
        seen.add(p);
        return walk(p, seen) + 1;
    };
    return walk(fid, new Set([fid]));
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
export function extractModelLinks(model, opts = {}) {
    const includePlanned = opts.includePlanned ?? false;
    const rawLinks = asObjArray(model?.links).filter((l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to));
    const hasCodeLinks = rawLinks.length > 0;
    if (hasCodeLinks && !opts.includeC4Rels && opts.bridgeUncovered === false) {
        return rawLinks;
    }
    let covered = null;
    let coveredPairs = null;
    const subgraphOwners = collectSubgraphOwners(model);
    if (hasCodeLinks && !opts.includeC4Rels) {
        const parentOf = buildMapParentIndex(model);
        const hostBridge = buildHostBridge(model, subgraphOwners);
        const l2ContainerIds = new Set(asObjArray(model?.level2?.elements)
            .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
            .map((e) => e.id));
        const boundary = typeof model?.level2?.boundary === "string" ? model.level2.boundary : "";
        if (opts.bridgeUncoveredPairs) {
            coveredPairs = new Set();
            const collectAncs = (id) => {
                const set = new Set();
                for (const anc of mapAncestorsOf(id, parentOf)) {
                    set.add(anc);
                    if (boundary && l2ContainerIds.has(anc))
                        set.add(boundary);
                    const hs = hostBridge.hostsByElement.get(anc);
                    if (hs) {
                        for (const hid of hs)
                            set.add(hid);
                    }
                }
                return [...set];
            };
            for (const l of rawLinks) {
                if (TUX_MAP_QUIET_LINK_KINDS.has(l.kind || ""))
                    continue;
                const fromAncs = collectAncs(l.from);
                const toAncs = collectAncs(l.to);
                for (const fa of fromAncs) {
                    for (const ta of toAncs) {
                        coveredPairs.add(`${fa}\u0000${ta}`);
                    }
                }
            }
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
    const out = [...rawLinks];
    const seen = new Set(out.map((l) => `${l.from}\u0000${l.to}\u0000${l.kind || "uses"}`));
    const push = (from, to, kind, label) => {
        if (typeof from !== "string" || typeof to !== "string" || !from || !to)
            return;
        if (covered && covered.has(to))
            return;
        if (coveredPairs && coveredPairs.has(`${from}\u0000${to}`))
            return;
        const normKind = kind || "uses";
        const key = `${from}\u0000${to}\u0000${normKind}`;
        if (seen.has(key))
            return;
        seen.add(key);
        out.push({ from, to, kind: normKind, label, coupling: "runtime", phase: "prod-runtime" });
    };
    for (const r of asObjArray(model?.level1?.rels)) {
        if (!includePlanned && r.status === "planned")
            continue;
        push(r.from, r.to, "uses", r.label);
    }
    for (const r of asObjArray(model?.level2?.rels)) {
        if (!includePlanned && r.status === "planned")
            continue;
        push(r.from, r.to, "uses", r.label);
    }
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
            for (const r of asObjArray(sg.rels)) {
                if (!includePlanned && r.status === "planned")
                    continue;
                push(r.from, r.to, "uses", r.label);
            }
        }
    }
    for (const l of asObjArray(model?.level4?.links)) {
        if (!includePlanned && l.state === "planned")
            continue;
        push(l.from, l.to, l.kind || "uses", l.label);
    }
    return out;
}
function topKinds(kinds) {
    return [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k).join(", ");
}
export function liftLinksToView(links, focusId, kidIds, parentOf, opts = {}) {
    const quiet = opts.quiet ?? TUX_MAP_QUIET_LINK_KINDS;
    const isKnown = opts.isKnown ?? ((id) => parentOf.has(id));
    const max = opts.maxPerSide ?? 8;
    const kids = new Set(kidIds);
    const focusChain = new Set(mapAncestorsOf(focusId, parentOf));
    const kidDepth = mapAncestorsOf(focusId, parentOf).length + 1;
    const outside = (id) => {
        if (!isKnown(id))
            return null;
        let pick = null;
        for (const a of mapAncestorsOf(id, parentOf)) {
            if (focusChain.has(a))
                break;
            pick = a;
            if (mapAncestorsOf(a, parentOf).length <= kidDepth)
                break;
        }
        return pick;
    };
    const sib = new Map();
    const spreading = { ins: new Map(), outs: new Map() };
    const side = (which, m, o, kid, l) => {
        const kind = l.kind || "uses";
        const byKid = m.get(o) ?? new Map();
        const kinds = byKid.get(kid) ?? new Map();
        kinds.set(kind, (kinds.get(kind) ?? 0) + 1);
        byKid.set(kid, kinds);
        m.set(o, byKid);
        if (!l.stop)
            spreading[which].set(o, (spreading[which].get(o) ?? 0) + 1);
    };
    const insM = new Map();
    const outsM = new Map();
    for (const l of links) {
        const kind = l.kind || "uses";
        if (quiet.has(kind))
            continue;
        const a = liftToSet(l.from, kids, parentOf);
        const b = liftToSet(l.to, kids, parentOf);
        if (a && b) {
            if (a === b)
                continue;
            const key = `${a}\u0000${b}`;
            const r = sib.get(key) ?? { from: a, to: b, kinds: new Map() };
            r.kinds.set(kind, (r.kinds.get(kind) ?? 0) + 1);
            sib.set(key, r);
        }
        else if (a) {
            const o = outside(l.to);
            if (o)
                side("outs", outsM, o, a, l);
        }
        else if (b) {
            const o = outside(l.from);
            if (o)
                side("ins", insM, o, b, l);
        }
    }
    const sides = (which, m) => [...m.entries()]
        .map(([id, byKid]) => ({
        id,
        count: [...byKid.values()].reduce((n, k) => n + [...k.values()].reduce((x, y) => x + y, 0), 0),
        spreading: spreading[which].get(id) ?? 0,
        wires: [...byKid.entries()].map(([kid, k]) => ({ kid, label: topKinds(k) })),
    }))
        .sort((x, y) => Number(y.spreading > 0) - Number(x.spreading > 0) || y.count - x.count || x.id.localeCompare(y.id));
    const ins = sides("ins", insM);
    const outs = sides("outs", outsM);
    return {
        rels: [...sib.values()].map((r) => ({ from: r.from, to: r.to, label: topKinds(r.kinds) })),
        ins: ins.slice(0, max),
        outs: outs.slice(0, max),
        moreIns: Math.max(0, ins.length - max),
        moreOuts: Math.max(0, outs.length - max),
    };
}
function buildHostBridge(model, subgraphOwners = collectSubgraphOwners(model)) {
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
function buildBlastNodeMeta(model, subgraphOwners = collectSubgraphOwners(model)) {
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
function repoPathForNodeId(id, meta) {
    if (meta?.path)
        return meta.path;
    if (id.startsWith("f:"))
        return id.slice(2);
    if (id.startsWith("s:"))
        return id.slice(2).split("#")[0] ?? "";
    return "";
}
function isPureDocNode(id, meta) {
    if (id.startsWith("s:") || meta?.kind === "symbol")
        return false;
    if (meta?.tech === "Markdown")
        return true;
    const p = repoPathForNodeId(id, meta).toLowerCase();
    return p.endsWith(".md") || p.endsWith(".mdx") || p.endsWith(".txt") || p.endsWith(".rst");
}
const AUX_NON_PROD_PATH_RE = /(?:^|\/)(?:tests?|__tests__|ci)\/|(?:^|\/)test_[^/]*$|\.(?:test|spec)\.[^/]+$|^(?:runner-smoke\/)?\.(?:forgejo|github)\/workflows\//i;
function isAuxNonProdSeed(id, meta) {
    const p = repoPathForNodeId(id, meta);
    if (!p && !id.startsWith("f:") && !id.startsWith("s:"))
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
    const kidsOf = new Map();
    for (const [c, p] of parentOf) {
        const k = kidsOf.get(p) ?? [];
        k.push(c);
        kidsOf.set(p, k);
    }
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
    const subgraphOwners = collectSubgraphOwners(opts.model);
    const hostBridge = opts.model ? buildHostBridge(opts.model, subgraphOwners) : null;
    const metaById = buildBlastNodeMeta(opts.model, subgraphOwners);
    if (opts.model && typeof opts.model === "object") {
        if (typeof opts.model.level2?.boundary === "string" && opts.model.level2.boundary && seeds.has(opts.model.level2.boundary)) {
            for (const e of asObjArray(opts.model.level2.elements)) {
                if (!e.ref)
                    addSeed(e.id);
            }
        }
        const l4NodeIds = new Set(asObjArray(opts.model.level4?.nodes)
            .filter((n) => typeof n.id === "string" && Boolean(n.id))
            .map((n) => n.id));
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
    const into = new Map();
    const outByFrom = new Map();
    for (const l of asObjArray(links)) {
        if (typeof l.from !== "string" || typeof l.to !== "string" || !l.from || !l.to)
            continue;
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
        if (seeds.has(y) || y.startsWith("d:"))
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
function stripLineSuffix(tech) {
    if (!tech)
        return "";
    return tech.replace(/\s*·\s*L\d+(?:[–-]\d+)?(?![0-9A-Za-z_])/g, "").trim();
}
function logicalParentOf(id, parentOf) {
    let p = parentOf.get(id);
    const seen = new Set([id]);
    while (p && p.startsWith("d:")) {
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
        if (!id || id.startsWith("d:") || elements.has(id))
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
    const links = extractModelLinks(model, { bridgeUncovered });
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
    const bothCodeOrNeither = Boolean(baseModel?.links?.length || headModel?.links?.length);
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
    const recommendedIntent = deletedIds.length > 0
        ? "cut"
        : movedIds.length > 0 || sigChangedIds.length > 0 || addedIds.length > 0
            ? "refactor"
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
        else if (pid.startsWith("d:") && logPid && hasOwn(mergedSubgraphs, logPid)) {
            mergedSubgraphs[logPid].elements.push(ghost);
        }
        else if (pid.startsWith("d:") &&
            logPid &&
            headIdx.validTargetIds.has(logPid) &&
            !headIdx.inlineParentIds.has(logPid) &&
            logPid !== headModel?.level2?.boundary) {
            setOwnProp(mergedSubgraphs, logPid, { elements: [ghost] });
        }
        else if (!pid.startsWith("d:") &&
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
        const routesRaw = Array.isArray(raw.routes)
            ? raw.routes
            : isPlainRecord(code) && Array.isArray(code.routes)
                ? code.routes
                : undefined;
        normalized = {
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
            generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : undefined,
            sourceBaseUrl: typeof raw.sourceBaseUrl === "string" ? raw.sourceBaseUrl : undefined,
            level1: { elements: [], rels: [] },
            level2: { boundary: "", elements: stubContainers, rels: [] },
            level3: {},
            level4: { groups: [], nodes: [], links: [] },
            subgraphs,
            links: asObjArray(raw.links),
            ...(Array.isArray(raw.routes) ? { routes: asObjArray(raw.routes) } : {}),
        };
    }
    else {
        normalized = raw;
    }
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
    const codeLinks = asObjArray(model?.links);
    feedStr(`#CL:${codeLinks.length}`);
    for (const l of codeLinks) {
        feedStr(typeof l.from === "string" ? l.from : "");
        feedStr(typeof l.to === "string" ? l.to : "");
        feedStr(typeof l.kind === "string" ? l.kind : "");
        feedStr(typeof l.at === "string" ? l.at : "");
        feedStr(l.stop ? "1" : "0");
        feedStr(typeof l.coupling === "string" ? l.coupling : "");
        feedStr(typeof l.phase === "string" ? l.phase : "");
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
    level1: { title: "System Context", elements: [], rels: [] },
    level2: { title: "Containers", boundary: "", elements: [], rels: [] },
    level3: {},
    level4: { title: "Deployment", groups: [], nodes: [], links: [] },
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
    if (isPlainRecord(model?.subgraphs)) {
        for (const [rawParentId, sg] of Object.entries(model.subgraphs)) {
            if (!isPlainRecord(sg))
                continue;
            const parentId = subgraphOwners.get(rawParentId) ?? rawParentId;
            const rawLvl = levelForFocus(parentId, model, parentOf);
            const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
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
    const validCodeLinks = asObjArray(model?.links).filter((l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to));
    const nonProseCodeLinks = [];
    validCodeLinks.forEach((l, idx) => {
        if (!nodes.has(l.from) || !nodes.has(l.to))
            return;
        const lnkEdge = {
            id: `lnk-${idx}-${l.from}-${l.to}`,
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
    const effectiveLinks = extractModelLinks(model);
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
const NODE_ID_PREFIX_RE = /^(?:p:pkg:|[fsdrp]:)/;
export function suggestCloseNodeIds(unknownId, nodes, maxSuggestions = 10) {
    const rawMax = Number.isFinite(maxSuggestions) ? maxSuggestions : 10;
    const cap = Math.min(10, Math.max(0, Math.floor(rawMax)));
    if (cap === 0)
        return [];
    const q = String(unknownId ?? "").trim().toLowerCase();
    const qStripped = q.replace(NODE_ID_PREFIX_RE, "");
    const tokens = qStripped.split(/[/:.#_-]+/).filter((t) => t.length >= 2);
    if (!q)
        return [];
    const scored = [];
    for (const n of nodes.values()) {
        const idLower = n.id.toLowerCase();
        const idStripped = idLower.replace(NODE_ID_PREFIX_RE, "");
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
        : extractModelLinks(model, { includePlanned, bridgeUncovered });
    const coarseParentSteps = [];
    const redirectParentByLink = new WeakMap();
    let blastLinks = links;
    const hasCodeLinks = asObjArray(model?.links).length > 0;
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
    const links = includePlanned ? extractModelLinks(model, { includePlanned: true }) : idx.effectiveLinks;
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
    if (kind === "route" || id.startsWith("r:"))
        return "Routes";
    if (kind === "symbol" || id.startsWith("s:"))
        return "Functions";
    if (id.startsWith("d:") ||
        (kind === "module" && !hasSourcePath && (name.endsWith("/") || /\bfolder\b/i.test(tech || "")))) {
        return "Folders";
    }
    if (id.startsWith("f:") || kind === "module" || kind === "schema")
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
function searchModelStamp(model) {
    const l1 = model.level1?.elements?.length ?? 0;
    const l2 = model.level2?.elements?.length ?? 0;
    const l3 = isPlainRecord(model.level3) ? Object.keys(model.level3).length : 0;
    const l4 = model.level4?.nodes?.length ?? 0;
    const sg = isPlainRecord(model.subgraphs) ? Object.keys(model.subgraphs).length : 0;
    const lk = model.links?.length ?? 0;
    const rt = model.routes?.length ?? 0;
    return `${l1}:${l2}:${l3}:${l4}:${sg}:${lk}:${rt}`;
}
export function buildMapSearchIndex(model = EMPTY_TTI_LEVEL_MODEL) {
    const isObjModel = model != null && typeof model === "object";
    const stamp = isObjModel ? searchModelStamp(model) : "empty";
    const cached = isObjModel ? MODEL_SEARCH_INDEX_CACHE.get(model) : undefined;
    if (cached && cached.stamp === stamp)
        return cached.entries;
    const parentOf = buildMapParentIndex(model);
    const nodes = new Map();
    const addNode = (n) => {
        if (n.id && !nodes.has(n.id))
            nodes.set(n.id, n);
    };
    const walkChildren = (ownerId, ownerLvl, kids, seen = new Set()) => {
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
            walkChildren(c.id, ownerLvl + 1, c.children, seen);
        }
        seen.delete(ownerId);
    };
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
    if (isPlainRecord(model?.subgraphs)) {
        for (const [ownerId, sg] of Object.entries(model.subgraphs)) {
            if (!hasOwn(model.subgraphs, ownerId) || !isPlainRecord(sg))
                continue;
            const lvl = levelForFocus(ownerId, model, parentOf);
            for (const e of asObjArray(sg.elements)) {
                addNode({
                    id: e.id,
                    name: e.name || e.id,
                    kind: e.kind || "module",
                    level: lvl,
                    parentId: ownerId,
                    tech: e.tech,
                    status: e.status,
                    source: e.source,
                });
                walkChildren(e.id, lvl, e.children);
            }
        }
    }
    const handlerByRouteId = new Map();
    for (const l of asObjArray(model?.links)) {
        if (l.kind === "handled-by" && l.from && l.to && nodes.has(l.to)) {
            if (!handlerByRouteId.has(l.from))
                handlerByRouteId.set(l.from, l.to);
        }
        else if (l.kind === "routes" &&
            l.from &&
            l.to &&
            (l.from.startsWith("r:") || nodes.get(l.from)?.kind === "route") &&
            nodes.has(l.to)) {
            if (!handlerByRouteId.has(l.from))
                handlerByRouteId.set(l.from, l.to);
        }
    }
    const entries = [];
    const seenRouteKeys = new Set();
    const buildAncestors = (id) => {
        const chain = mapAncestorsOf(id, parentOf);
        const names = [];
        for (let i = chain.length - 1; i >= 1; i--) {
            const ancId = chain[i];
            const n = nodes.get(ancId);
            names.push(n?.name || ancId);
        }
        if (names.length === 0) {
            const n = nodes.get(id);
            if (n?.parentId) {
                const pNode = nodes.get(n.parentId);
                names.push(pNode?.name || n.parentId);
            }
        }
        return names;
    };
    for (const n of nodes.values()) {
        const srcPath = n.source?.path ||
            (n.id.startsWith("f:") ? n.id.slice(2) : "") ||
            (n.id.startsWith("d:") ? n.id.slice(2).split(":").pop() || "" : "");
        const group = classifySearchGroup(n.id, n.kind, n.name, n.tech, Boolean(n.source?.path));
        const ancestors = buildAncestors(n.id);
        const linkedHandlerId = group === "Routes" ? handlerByRouteId.get(n.id) : undefined;
        const handlerNode = linkedHandlerId ? nodes.get(linkedHandlerId) : undefined;
        const routePattern = group === "Routes" ? (n.id.startsWith("r:") ? n.id.slice(2) : n.name) : undefined;
        if (routePattern) {
            seenRouteKeys.add(`${routePattern.toLowerCase()}\u0000${linkedHandlerId || n.id}`);
        }
        entries.push(makeSearchEntry({
            id: n.id,
            revealId: linkedHandlerId || n.id,
            group,
            level: n.level,
            kind: n.kind,
            name: n.name,
            path: handlerNode?.source?.path || srcPath,
            ancestors,
            tech: n.tech || "",
            routePattern,
            handlerName: handlerNode?.name,
            planned: n.status === "planned",
        }));
        if (group !== "Routes") {
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
    for (const rt of asObjArray(model?.routes)) {
        if (typeof rt.pattern !== "string" || !rt.pattern.trim())
            continue;
        const method = typeof rt.method === "string" && rt.method.trim() ? rt.method.trim().toUpperCase() : "";
        const pat = rt.pattern.trim();
        const disp = method ? `${method} ${pat}` : pat;
        const handlerId = typeof rt.handler === "string" && rt.handler ? rt.handler : "";
        const handlerNode = handlerId ? nodes.get(handlerId) : undefined;
        const revealId = handlerNode ? handlerNode.id : handlerId || `r:${disp}`;
        const rKey = `${disp.toLowerCase()}\u0000${revealId}`;
        if (seenRouteKeys.has(rKey))
            continue;
        seenRouteKeys.add(rKey);
        const ancestors = handlerNode ? [...buildAncestors(handlerNode.id), handlerNode.name] : [];
        entries.push(makeSearchEntry({
            id: `route:${disp}->${revealId}`,
            revealId,
            group: "Routes",
            level: handlerNode?.level ?? 5,
            kind: "route",
            name: disp,
            path: handlerNode?.source?.path || "",
            ancestors,
            tech: [rt.framework, handlerNode?.name || handlerId].filter(Boolean).join(" · "),
            routePattern: pat,
            handlerName: handlerNode?.name || handlerId || undefined,
            planned: handlerNode?.status === "planned",
        }));
    }
    if (isObjModel) {
        MODEL_SEARCH_INDEX_CACHE.set(model, { stamp, entries });
    }
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
    const entries = Array.isArray(modelOrEntries)
        ? modelOrEntries
        : buildMapSearchIndex(modelOrEntries);
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
