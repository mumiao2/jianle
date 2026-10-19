import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Root } from "mdast";
import type { Plugin } from "unified";

export type NoteHeading = {
  depth: number;
  id: string;
  text: string;
};

type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
  data?: {
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
};

function textContent(node: MarkdownNode): string {
  if (typeof node.value === "string") return node.value;
  return node.children?.map(textContent).join("") ?? "";
}

function withHeadingIds(headings: NoteHeading[]): Plugin<[], Root> {
  return () => (tree) => {
    const usedIds = new Map<string, number>();

    const visit = (node: MarkdownNode) => {
      if (node.type === "heading") {
        const text = textContent(node).trim();
        const baseId =
          text
            .normalize("NFKC")
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-|-$/g, "") || "section";
        const count = usedIds.get(baseId) ?? 0;
        usedIds.set(baseId, count + 1);
        const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

        headings.push({ depth: node.depth ?? 2, id, text });
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, id },
        };
      }

      node.children?.forEach(visit);
    };

    visit(tree as unknown as MarkdownNode);
  };
}

export async function renderNoteMarkdown(content: string) {
  const headings: NoteHeading[] = [];
  const html = await remark()
    .use(withHeadingIds(headings))
    .use(remarkHtml)
    .process(content);

  return { html: String(html), headings };
}
