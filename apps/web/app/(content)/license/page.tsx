import { MarkdownToHTML } from "~/components/MarkdownToHTML";

export default function PrivacyPage() {
  return (
    <main className="prose" data-testid="page-body">
      <h1 data-testid="page-title" role="heading" aria-level={1}>
        License
      </h1>
      <article data-testid="page-copy">
        {process.env.NEXT_PUBLIC_GITHUB_USERNAME ? (
          <MarkdownToHTML
            url={`https://raw.githubusercontent.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/.github/main/LICENSE.txt`}
          />
        ) : (
          <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded">
            Missing GitHub username
          </div>
        )}
      </article>
    </main>
  );
}
