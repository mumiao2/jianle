import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  theme: string;
  tags: string[];
};

function formatPostDate(value: unknown): string {
  if (!value) return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const date = String(value);
  return date.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? date;
}

async function readEntry(collection: "posts" | "notes", slug: string): Promise<Post> {
  const source = await fs.readFile(
    path.join(contentDirectory, collection, `${slug}.md`),
    "utf8",
  );
  const { data: attributes, content: rawContent } = matter(source);
  const content = rawContent.trim();
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const excerptSource = content.replace(/^#\s+.+\r?\n?/, "").trim();
  const firstParagraph = excerptSource.split(/\r?\n\s*\r?\n/)[0] ?? "";
  const rawTags = attributes.tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.map(String)
    : typeof rawTags === "string"
      ? rawTags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  return {
    slug,
    title: String(attributes.title || heading || slug),
    date: formatPostDate(attributes.date),
    description: String(
      attributes.description ||
        attributes.excerpt ||
        firstParagraph.replace(/^#+\s*/, ""),
    ),
    content,
    theme: String(attributes.topic || attributes.theme || attributes.category || "随手记"),
    tags,
  };
}

async function getEntry(collection: "posts" | "notes", slug: string): Promise<Post | null> {
  if (!/^[\w-]+$/.test(slug)) return null;

  try {
    return await readEntry(collection, slug);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function getEntries(collection: "posts" | "notes"): Promise<Post[]> {
  const directory = path.join(contentDirectory, collection);
  let files: string[];
  try {
    files = await fs.readdir(directory);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map((file) => readEntry(collection, file.slice(0, -3))),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export const getPost = (slug: string) => getEntry("posts", slug);
export const getNote = (slug: string) => getEntry("notes", slug);
export const getPosts = () => getEntries("posts");
export const getNotes = () => getEntries("notes");

export async function getAdjacentNotes(slug: string) {
  const notes = await getNotes();
  const index = notes.findIndex((note) => note.slug === slug);

  return {
    previous: index >= 0 ? notes[index + 1] ?? null : null,
    next: index > 0 ? notes[index - 1] ?? null : null,
  };
}
