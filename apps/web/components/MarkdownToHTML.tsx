import { marked } from "marked";
import { Suspense } from "react";

// Set options
marked.use({
  async: true,
  pedantic: false,
  gfm: true,
});

type MarkdownToHTMLUrl = string;
type MarkdownToHTMLProps = {
  url: MarkdownToHTMLUrl;
};

export const getMarkdownHTML = async (url: MarkdownToHTMLUrl) => {
  console.log("Fetching markdown from:", url);
  const md = await fetch(url).then((res) => res.text());
  const html = await marked.parse(md);
  return html;
};

const MarkdownToHTMLBody: React.FC<MarkdownToHTMLProps> = async ({ url }) => {
  const html = await getMarkdownHTML(url);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid="markdown-html"
      className={"prose"}
    />
  );
};

export const MarkdownToHTML: React.FC<MarkdownToHTMLProps> = ({ url }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarkdownToHTMLBody url={url} />
    </Suspense>
  );
};
