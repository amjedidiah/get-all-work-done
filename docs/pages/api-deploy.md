# API Deployment

> Make sure port in Node.js app is 8080

1. Setup Docker: `npx nx g @nx/node:setup-docker`
2. Sign up for [fly.io](https://fly.io)
3. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
4. Login to fly: `flyctl auth login`
5. Launch project: `fly launch --generate-name --no-deploy --dockerfile apps/api/Dockerfile`

    > The setup process of Fly asks about creating a .dockerignore file based on the current .gitignore. If you confirm that step, make sure to remove **/dist from the .dockerignore file, otherwise the build will fail because the Dockerfile copies the build output from the dist/ folder.

6. Build api: `nx build api`
7. Deploy api: `fly deploy`
8. Configure npm scripts: `nx api:deploy`

    > Info in commit for package.json file

9. Configure project.json for api

> For subsequent deployments, you can use the following command to deploy the api: `nx api:deploy`
