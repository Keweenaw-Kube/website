This is the source for [kubemtu.com](https://kubemtu.com/).

## Development

### Getting started

1. Install Node.js & Yarn (something like [nvm](https://github.com/nvm-sh/nvm) works well)
2. Clone this repo and install dependencies with `yarn install`
3. Copy `.env.example` to `.env` and populate with values
4. Copy `prisma/.env.example` to `prisma/.env` and populate with a URL to a local database
5. Migrate your database with `yarn migrations:run`
6. Start the application with `yarn dev`
7. If you make changes to the database models, make sure to run `yarn migrations:generate` before checking in to Git

### Deploying

To deploy, push to the `main` branch. The application will automatically be deployed after checks have passed.
