# Remix! (WIP)

- [Remix Docs](https://remix.run/docs)
- Implement basing on this [Tutorial](https://remix.run/docs/en/v1/tutorials/jokes#jokes-app-tutorial) with some tweaks.

Tweaks:

- App structure and architecture.
- Use slonik + node-pg-migrate instead of Prisma.
- Use zod for schema validation.
- ... to-be-updated ...

# TODO

- Testing.
- Use Styled-Component, Material UI.

## Development

### Requirement: nodenv

### Installation:

```sh
nodenv install
npm install yarn
```

Delete package-lock.json (to not conflict with yarn.lock)

```sh
yarn install
```

To start your app in development mode, rebuilding assets on file changes.

```sh
yarn dev
```

Create a migration file and run migrations:

```sh
yarn migrate create <migration-file-name>
yarn migrate up
```

## Known issues:

- https://github.com/remix-run/remix/issues/2737

Temporary work around: install pg-native

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
