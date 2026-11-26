import { readFileSync } from "node:fs";
import path from "node:path";

const dimensionsCache = new Map();

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function parseWebp(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (chunk === "VP8X" && data + 10 <= buffer.length) {
      return {
        width: 1 + readUInt24LE(buffer, data + 4),
        height: 1 + readUInt24LE(buffer, data + 7),
        format: "webp",
      };
    }

    if (chunk === "VP8 " && data + 10 <= buffer.length) {
      if (buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
        return {
          width: buffer.readUInt16LE(data + 6) & 0x3fff,
          height: buffer.readUInt16LE(data + 8) & 0x3fff,
          format: "webp",
        };
      }
    }

    if (chunk === "VP8L" && data + 5 <= buffer.length && buffer[data] === 0x2f) {
      const b1 = buffer[data + 1];
      const b2 = buffer[data + 2];
      const b3 = buffer[data + 3];
      const b4 = buffer[data + 4];
      return {
        width: 1 + (b1 | ((b2 & 0x3f) << 8)),
        height: 1 + ((b2 >> 6) | (b3 << 2) | ((b4 & 0x0f) << 10)),
        format: "webp",
      };
    }

    offset = data + chunkSize + (chunkSize % 2);
  }

  return null;
}

function parseJpeg(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;

  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    while (offset < buffer.length && buffer[offset] === 0xff) offset += 1;
    if (offset >= buffer.length) break;

    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break;

    if (sofMarkers.has(marker) && segmentLength >= 7) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
        format: "jpeg",
      };
    }

    offset += segmentLength;
  }

  return null;
}

function parseSvg(buffer) {
  const text = buffer.toString("utf8");
  const svgTag = text.match(/<svg\b[^>]*>/i)?.[0];
  if (!svgTag) return null;

  const widthValue = svgTag.match(/\bwidth=["']([\d.]+)(?:px)?["']/i)?.[1];
  const heightValue = svgTag.match(/\bheight=["']([\d.]+)(?:px)?["']/i)?.[1];
  let width = widthValue ? Number.parseFloat(widthValue) : null;
  let height = heightValue ? Number.parseFloat(heightValue) : null;

  if ((!width || !height) && /\bviewBox=["'][^"']+["']/i.test(svgTag)) {
    const viewBox = svgTag.match(/\bviewBox=["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
    if (viewBox) {
      width ||= Number.parseFloat(viewBox[1]);
      height ||= Number.parseFloat(viewBox[2]);
    }
  }

  return width > 0 && height > 0 ? { width, height, format: "svg" } : null;
}

export function readImageDimensions(filePath) {
  const absolutePath = path.resolve(filePath);
  if (dimensionsCache.has(absolutePath)) return dimensionsCache.get(absolutePath);

  let result = null;
  try {
    const buffer = readFileSync(absolutePath);

    if (buffer.length >= 24 && buffer.toString("hex", 0, 8) === "89504e470d0a1a0a") {
      result = {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
        format: "png",
      };
    } else if (buffer.length >= 10 && buffer.toString("ascii", 0, 3) === "GIF") {
      result = {
        width: buffer.readUInt16LE(6),
        height: buffer.readUInt16LE(8),
        format: "gif",
      };
    } else {
      result = parseWebp(buffer) || parseJpeg(buffer) || parseSvg(buffer);
    }
  } catch {
    result = null;
  }

  dimensionsCache.set(absolutePath, result);
  return result;
}

function resolvePublicImage(src) {
  if (typeof src !== "string" || !src.trim() || /^(?:https?:)?\/\//i.test(src) || /^[a-z][a-z\d+.-]*:/i.test(src)) {
    return null;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(src, "https://local.invalid").pathname);
  } catch {
    return null;
  }

  const publicDir = path.resolve(process.cwd(), "public");
  const filePath = path.resolve(publicDir, `.${pathname}`);
  if (filePath !== publicDir && !filePath.startsWith(`${publicDir}${path.sep}`)) return null;
  return filePath;
}

function visit(node, callback) {
  if (!node || typeof node !== "object") return;
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, callback);
  }
}

export default function rehypeLocalImageAttributes() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "img") return;

      node.properties ||= {};
      if (node.properties.loading == null) node.properties.loading = "lazy";
      if (node.properties.decoding == null) node.properties.decoding = "async";

      const filePath = resolvePublicImage(node.properties.src);
      if (!filePath) return;

      const dimensions = readImageDimensions(filePath);
      if (!dimensions) return;

      if (!(Number(node.properties.width) > 0)) node.properties.width = dimensions.width;
      if (!(Number(node.properties.height) > 0)) node.properties.height = dimensions.height;
    });
  };
}
