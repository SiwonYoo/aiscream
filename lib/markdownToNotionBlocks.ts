type NotionRichText = {
  type: 'text';
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    color?: 'default';
  };
};

export type NotionBlock =
  | { object: 'block'; type: 'paragraph'; paragraph: { rich_text: NotionRichText[]; children?: NotionBlock[] } }
  | { object: 'block'; type: 'heading_1'; heading_1: { rich_text: NotionRichText[] } }
  | { object: 'block'; type: 'heading_2'; heading_2: { rich_text: NotionRichText[] } }
  | { object: 'block'; type: 'heading_3'; heading_3: { rich_text: NotionRichText[] } }
  | { object: 'block'; type: 'quote'; quote: { rich_text: NotionRichText[]; children?: NotionBlock[] } }
  | { object: 'block'; type: 'divider'; divider: Record<string, never> }
  | { object: 'block'; type: 'code'; code: { rich_text: NotionRichText[]; language: string } }
  | { object: 'block'; type: 'bulleted_list_item'; bulleted_list_item: { rich_text: NotionRichText[]; children?: NotionBlock[] } }
  | { object: 'block'; type: 'numbered_list_item'; numbered_list_item: { rich_text: NotionRichText[]; children?: NotionBlock[] } };

function rtText(content: string, opts?: Partial<NotionRichText['annotations']>, linkUrl?: string): NotionRichText {
  return {
    type: 'text',
    text: { content, link: linkUrl ? { url: linkUrl } : null },
    annotations: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      code: false,
      color: 'default',
      ...(opts ?? {}),
    },
  };
}

// **bold**, *italic*, ~~strike~~, `code`, [text](url)
function inlineToRichText(input: string): NotionRichText[] {
  if (!input) return [];
  const out: NotionRichText[] = [];
  let i = 0;

  const pushPlain = (t: string) => t && out.push(rtText(t));

  while (i < input.length) {
    // link
    if (input[i] === '[') {
      const close = input.indexOf(']', i + 1);
      const openParen = close !== -1 ? input.indexOf('(', close + 1) : -1;
      const closeParen = openParen !== -1 ? input.indexOf(')', openParen + 1) : -1;
      if (close !== -1 && openParen === close + 1 && closeParen !== -1) {
        const label = input.slice(i + 1, close);
        const url = input.slice(openParen + 1, closeParen);
        if (label) out.push(rtText(label, {}, url));
        i = closeParen + 1;
        continue;
      }
    }

    // inline code
    if (input[i] === '`') {
      const end = input.indexOf('`', i + 1);
      if (end !== -1) {
        const code = input.slice(i + 1, end);
        if (code) out.push(rtText(code, { code: true }));
        i = end + 1;
        continue;
      }
    }

    // bold
    if (input.startsWith('**', i)) {
      const end = input.indexOf('**', i + 2);
      if (end !== -1) {
        const t = input.slice(i + 2, end);
        if (t) out.push(rtText(t, { bold: true }));
        i = end + 2;
        continue;
      }
    }

    // strike
    if (input.startsWith('~~', i)) {
      const end = input.indexOf('~~', i + 2);
      if (end !== -1) {
        const t = input.slice(i + 2, end);
        if (t) out.push(rtText(t, { strikethrough: true }));
        i = end + 2;
        continue;
      }
    }

    // italic
    if (input[i] === '*') {
      const end = input.indexOf('*', i + 1);
      if (end !== -1) {
        const t = input.slice(i + 1, end);
        if (t) out.push(rtText(t, { italic: true }));
        i = end + 1;
        continue;
      }
    }

    const nexts = [input.indexOf('[', i), input.indexOf('`', i), input.indexOf('**', i), input.indexOf('~~', i), input.indexOf('*', i)].filter(n => n !== -1);

    const next = nexts.length ? Math.min(...nexts) : -1;
    if (next === -1) {
      pushPlain(input.slice(i));
      break;
    }
    if (next === i) {
      pushPlain(input[i]);
      i += 1;
      continue;
    }
    pushPlain(input.slice(i, next));
    i = next;
  }

  return out;
}

type ListKind = 'bullet' | 'numbered';
type ListItem = { kind: ListKind; rich_text: NotionRichText[]; indent: number; children: ListItem[] };

function countIndent(line: string): number {
  let spaces = 0;
  for (const ch of line) {
    if (ch === ' ') spaces += 1;
    else if (ch === '\t') spaces += 2;
    else break;
  }
  return Math.floor(spaces / 2); // 2칸=1레벨 (필요하면 4로 바꿔)
}

function buildListTree(flat: ListItem[]): ListItem[] {
  const root: ListItem[] = [];
  const parents: { item: ListItem; indent: number }[] = [];

  for (const item of flat) {
    item.children = [];
    while (parents.length && parents[parents.length - 1]!.indent >= item.indent) parents.pop();
    if (!parents.length) root.push(item);
    else parents[parents.length - 1]!.item.children.push(item);
    parents.push({ item, indent: item.indent });
  }

  return root;
}

function listItemsToBlocks(items: ListItem[]): NotionBlock[] {
  return items.map(it => {
    const children = it.children.length ? listItemsToBlocks(it.children) : undefined;
    return it.kind === 'bullet' ? { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: it.rich_text, children } } : { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: it.rich_text, children } };
  });
}

function isDividerLine(trimmed: string) {
  return trimmed === '---' || trimmed === '***' || trimmed === '___';
}

export function markdownToNotionBlocks(markdown: string): NotionBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: NotionBlock[] = [];

  let i = 0;
  let paraBuf: string[] = [];
  let listBuf: ListItem[] = [];
  let inList = false;

  const flushParagraph = () => {
    const text = paraBuf.join('\n').trimEnd();
    paraBuf = [];
    if (!text.trim()) return;
    blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: inlineToRichText(text) } });
  };

  const endList = () => {
    if (!inList) return;
    inList = false;
    const tree = buildListTree(listBuf);
    listBuf = [];
    blocks.push(...listItemsToBlocks(tree));
  };

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // code fence
    if (trimmed.startsWith('```')) {
      flushParagraph();
      endList();
      const lang = trimmed.slice(3).trim() || 'plain text';
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) i += 1;

      blocks.push({
        object: 'block',
        type: 'code',
        code: { rich_text: [rtText(codeLines.join('\n'))], language: lang },
      });
      continue;
    }

    // blank
    if (trimmed === '') {
      flushParagraph();
      endList();
      i += 1;
      continue;
    }

    // divider
    if (isDividerLine(trimmed)) {
      flushParagraph();
      endList();
      blocks.push({ object: 'block', type: 'divider', divider: {} });
      i += 1;
      continue;
    }

    // heading
    const hm = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (hm) {
      flushParagraph();
      endList();
      const level = hm[1].length;
      const rich_text = inlineToRichText(hm[2] ?? '');
      if (level <= 1) blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text } });
      else if (level === 2) blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text } });
      else blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text } });
      i += 1;
      continue;
    }

    // quote
    if (trimmed.startsWith('>')) {
      flushParagraph();
      endList();
      const qLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        qLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ object: 'block', type: 'quote', quote: { rich_text: inlineToRichText(qLines.join('\n')) } });
      continue;
    }

    // list
    const indent = countIndent(raw);
    const noIndent = raw.trimStart();
    const bullet = /^([-*+])\s+(.*)$/.exec(noIndent);
    const numbered = /^(\d+)\.\s+(.*)$/.exec(noIndent);
    if (bullet || numbered) {
      flushParagraph();
      inList = true;
      const kind: ListKind = bullet ? 'bullet' : 'numbered';
      const content = (bullet ? bullet[2] : numbered?.[2]) ?? '';
      listBuf.push({ kind, rich_text: inlineToRichText(content), indent, children: [] });
      i += 1;
      continue;
    }

    // normal paragraph line
    endList();
    paraBuf.push(raw);
    i += 1;
  }

  flushParagraph();
  endList();

  return blocks.length ? blocks : [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [] } }];
}
