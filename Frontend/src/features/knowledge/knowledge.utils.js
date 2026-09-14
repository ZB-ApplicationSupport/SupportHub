const decodeXmlEntities = (value) =>
  String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const inflateRaw = async (bytes) => {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("This browser cannot read .docx files");
  }
  const stream = new Blob([bytes]).stream().pipeThrough(
    new DecompressionStream("deflate-raw")
  );
  const buffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(buffer);
};

const readZipEntry = async (buffer, entryName) => {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const nameBytes = new TextEncoder().encode(entryName);

  for (let offset = 0; offset < bytes.length - 30; offset += 1) {
    if (view.getUint32(offset, true) !== 0x04034b50) {
      continue;
    }

    const method = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = bytes.subarray(nameStart, nameStart + nameLength);
    const matches =
      name.length === nameBytes.length &&
      name.every((value, index) => value === nameBytes[index]);

    if (!matches) {
      offset = dataStart + compressedSize - 1;
      continue;
    }

    const compressed = bytes.subarray(dataStart, dataStart + compressedSize);
    const inflated = method === 0 ? compressed : await inflateRaw(compressed);
    return new TextDecoder("utf-8").decode(inflated);
  }

  return "";
};

const xmlToPlainText = (xml) =>
  decodeXmlEntities(
    String(xml || "")
      .replace(/<w:tab\s*\/>/g, "\t")
      .replace(/<w:br\b[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const extractDocxText = async (file) => {
  const xml = await readZipEntry(await file.arrayBuffer(), "word/document.xml");
  return xmlToPlainText(xml);
};

export const filterArticles = (items, query, system, category, tag) => {
  return items.filter((item) => {
    const keywords = item.keywords || [];
    const matchesQuery =
      !query ||
      (item.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (item.summary || "").toLowerCase().includes(query.toLowerCase()) ||
      keywords.some((word) =>
        String(word).toLowerCase().includes(query.toLowerCase())
      );
    const matchesSystem = !system || item.system === system;
    return matchesQuery && matchesSystem;
  });
};

export const sortArticles = (items, sortKey) => {
  const sorted = [...items];
  if (sortKey === "recent") {
    return sorted.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }
  if (sortKey === "views") {
    return sorted.sort((a, b) => b.views - a.views);
  }
  if (sortKey === "rating") {
    return sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
};

export const getRelatedArticles = (items, relatedMap, currentId) => {
  const relatedIds = relatedMap[currentId] || [];
  return items.filter((item) => relatedIds.includes(item.id));
};
