# Repo Setup

I took the following steps to initialise the monorepo with `nx`

## Initial setup: #55b7c178

1. Installed `nx` globally: `pnpm i -g nx`
2. Generated a new nx project: `pnpx create-nx-workspace`
    - Selected `Express monorepo` setup
    - Named Express app `api`

## Nextjs setup: #aeb5ed71

1. Installed the `@nx/next` plugin: `pnpm add -D @nx/next`
2. Generated Next.js project: `nx g @nx/next:app`

### Clean up

1. Removed test-related files, dependencies, and scripts manually
2. Removed unused files, dependencies, and scripts manually
3. Updated node packages: `pnpm install`
4. Confirmed client still works: `nx run client:dev`
5. Confirmed `api` still works: `nx serve api`
6. Added scripts to `package.json` file

## Setup shared library: #caf7672a

1. Ran `nx g @nrwl/workspace:lib shared`

## Fixed Cors Issue: #b3f049ab

Fixed cors issue using `app.use(cors())`

## Setup Docs

Setup docs using vocs

## Resources

- [Typescript NX Monorepo with NextJS and Express](https://www.youtube.com/watch?v=WOfL5q2HznI&t=323s)
- [Vocs](https://vocs.dev/docs)
