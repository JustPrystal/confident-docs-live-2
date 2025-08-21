import React, { useMemo } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Options } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  type Document as ContentfulDocument,
  type Block,
  type Inline,
  type Text as ContentfulText,
} from "@contentful/rich-text-types";

import Feature from "@/components/Blog/Feature/Feature";

import Prism from "prismjs";
import "@/app/styles/prism-styles/prism-colddark-dark.scss";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";

import styles from "./styles.module.scss";

type ArticleContentProps = {
  content: ContentfulDocument;
  theme: "dark" | "light";
  isLast?: boolean;
};

const generateSlug = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://${url}`;
  return url;
};

const getNodePlainText = (node: Block | Inline): string => {
  // Contentful paragraphs typically contain an array of Text nodes
  const parts: string[] = [];

  const content = node?.content as
    | Array<ContentfulText | Block | Inline>
    | undefined;
  if (!content) return "";

  for (const c of content) {
    // Text nodes have 'value'
    if ((c as ContentfulText)?.value !== undefined) {
      parts.push((c as ContentfulText).value || "");
    } else if ((c as any)?.content) {
      parts.push(getNodePlainText(c as any));
    }
  }
  return parts.join("");
};

const parseDescriptionToNodes = (description: string): React.ReactNode[] => {
  // Turn basic markdown-style links [text](url) into <a> nodes.
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(description)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(description.slice(lastIndex, match.index));
    }
    nodes.push(
      <a
        key={`desc-link-${key++}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
      >
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < description.length) {
    nodes.push(description.slice(lastIndex));
  }

  return nodes;
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({
  language,
  code,
}) => {
  const highlighted = useMemo(() => {
    const lang = Prism.languages[language] || Prism.languages.plaintext;
    return Prism.highlight(code, lang, language);
  }, [language, code]);

  return (
    <div className={styles.codeWrap}>
      <pre style={{ backgroundColor: "#111b27" }}>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
};

export default function ArticleContent({
  content,
  theme,
  isLast = false,
}: ArticleContentProps) {
  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (
        node: Block | Inline,
        children: React.ReactNode
      ): React.JSX.Element | null => {
        // Join text of all children to detect a fenced code block starting the paragraph
        const text = getNodePlainText(node);

        // Match ```lang\n...\n``` at the start of the paragraph
        const codeMatch = text.match(/^```(\w+)?\n?([\s\S]*?)```/);
        if (codeMatch) {
          const language = codeMatch[1] || "plaintext";
          const code = (codeMatch[2] || "").trim();

          // Any content after the fenced block in the same paragraph
          const afterCode = text.slice(codeMatch[0].length).trim();

          return (
            <>
              <CodeBlock language={language} code={code} />
              {afterCode && <p>{afterCode}</p>}
            </>
          );
        }

        // Only render paragraph if there's meaningful content
        const hasMeaningfulChild = Array.isArray(children)
          ? children.some(child =>
              typeof child === "string" ? child.trim().length > 0 : !!child
            )
          : !!children;

        if (!hasMeaningfulChild) return null;
        return <p>{children}</p>;
      },

      [BLOCKS.EMBEDDED_ASSET]: (node: Block): React.JSX.Element | null => {
        const file = (node as any)?.data?.target?.fields?.file;
        if (!file?.url) return null;

        const title: string = (node as any)?.data?.target?.fields?.title || "";
        const description: string =
          (node as any)?.data?.target?.fields?.description || "";

        const src = normalizeUrl(file.url);
        const alt = description || title || "Blog image";

        return (
          <figure>
            <img
              src={src}
              alt={alt}
              loading="lazy"
              style={{ maxWidth: "100%" }}
            />
            {description && (
              <figcaption>{parseDescriptionToNodes(description)}</figcaption>
            )}
          </figure>
        );
      },

      [BLOCKS.HEADING_1]: (
        node: Block,
        children: React.ReactNode
      ): React.JSX.Element => {
        const text = getNodePlainText(node);
        const id = generateSlug(text);
        return <h1 id={id}>{children}</h1>;
      },
      [BLOCKS.HEADING_2]: (
        node: Block,
        children: React.ReactNode
      ): React.JSX.Element => {
        const text = getNodePlainText(node);
        const id = generateSlug(text);
        return <h2 id={id}>{children}</h2>;
      },
      [BLOCKS.HEADING_3]: (
        node: Block,
        children: React.ReactNode
      ): React.JSX.Element => {
        const text = getNodePlainText(node);
        const id = generateSlug(text);
        return <h3 id={id}>{children}</h3>;
      },
      [BLOCKS.HEADING_4]: (
        node: Block,
        children: React.ReactNode
      ): React.JSX.Element => {
        const text = getNodePlainText(node);
        const id = generateSlug(text);
        return <h4 id={id}>{children}</h4>;
      },
      [BLOCKS.HEADING_5]: (
        node: Block,
        children: React.ReactNode
      ): React.JSX.Element => {
        const text = getNodePlainText(node);
        const id = generateSlug(text);
        return <h5 id={id}>{children}</h5>;
      },
      [BLOCKS.HEADING_6]: (
        node: Block,
        children: React.ReactNode
      ): React.JSX.Element => {
        const text = getNodePlainText(node);
        const id = generateSlug(text);
        return <h6 id={id}>{children}</h6>;
      },
    },
  };

  return (
    <div
      className={`${styles.ArticleContent} ${styles[theme]}`}
      id="article-content"
    >
      {documentToReactComponents(content, options)}

      {isLast && (
        <>
          <hr />
          <p>
            Do you want to brainstorm how to evaluate your LLM (application)?
            Ask us anything in our{" "}
            <a
              href="https://discord.com/invite/a3K9c8GRGt"
              target="_blank"
              rel="noopener noreferrer"
            >
              discord
            </a>
            . I might give you an “aha!” moment, who knows?
          </p>
        </>
      )}

      <Feature theme={theme} />
    </div>
  );
}
