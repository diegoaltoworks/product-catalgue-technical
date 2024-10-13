# Product Catalogue Technical

Started witha [Turbo](https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository) monorepo.

## Running this project

Run the following commands:

```sh
nom install
npm run dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: core service on [Express](https://github.com/ansh/express-prisma-trpc-starter), [Primsa](https://www.prisma.io/docs/getting-started/quickstart) and [tRPC](https://trpc.io/docs/server/routers)
- `web`: another [Next.js](https://nextjs.org/) app
- `docs`: a [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [TRPC Playground on](http://localhost:3002/trpc-playground)


### TODO

So many things to do, no limited to...

- add auto openapi spec
- add RESTful api
- add auto docs
- add on-the-fly edit and retry for failed uploads

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
