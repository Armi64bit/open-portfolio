import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, normalize, extname } from "node:path";

const outDir = join(fileURLToPath(new URL("./out/", import.meta.url)));
const port = 4321;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "text/xml",
  ".txt": "text/plain",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

async function resolve(pathname) {
  let p = normalize(decodeURIComponent(pathname)).replace(/\\/g, "/");
  if (p.startsWith("/")) p = p.slice(1);
  if (p === "") p = "index.html";
  const candidates = [];
  if (p.endsWith("/")) p = p + "index.html";
  if (extname(p) === "") {
    candidates.push(join(outDir, p, "index.html"));
    candidates.push(join(outDir, p + ".html"));
  } else {
    candidates.push(join(outDir, p));
  }
  for (const c of candidates) {
    if (c.startsWith(outDir)) {
      try {
        return { data: await readFile(c), file: c };
      } catch {}
    }
  }
  return null;
}

createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://localhost").pathname;
    const hit = await resolve(pathname);
    if (!hit) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[extname(hit.file)] ?? "application/octet-stream",
    });
    res.end(hit.data);
  } catch {
    res.writeHead(500);
    res.end("err");
  }
}).listen(port, () => console.log(`serving ${outDir} on :${port}`));