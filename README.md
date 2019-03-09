# comunidades-unidas-internal
The code for comunidades unidas internal website

This project uses Node + Express to interact with a MySQL Database and provide JSON APIs. The frontend is a React SPA that uses Typescript, babel, and webpack.

## Setup
Here are instructions to boot up this project locally so that you can change the code.

First, install the following:
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://www.docker.com/get-started). This will also install docker-compose.
- [Node](https://nodejs.org/en/download/). Feel free to use [nvm](https://github.com/creationix/nvm) for this if you prefer, but any installation will work.
- [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable). If you use Mac, this may require that you first install
  [Homebrew](https://brew.sh/).

Now, run the following commands in a terminal:
```sh
git clone git@github.com:JustUtahCoders/comunidades-unidas-internal.git
cd comunidades-unidas-internal
yarn install
yarn fix-everything
yarn develop
```

Now go to http://localhost:8080 in a browser.

## Deployments
This project is hosted by [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/). To deploy the code,
simply merge a pull request to master, which will automatically trigger a deployment via [Travis CI](https://travis-ci.org/).
You can see all current and previous deployments at https://travis-ci.org/JustUtahCoders/comunidades-unidas-internal.

## Database Migrations
If you need to make a change to the database schema, create a database migration by running the following command:
```sh
npx db-migrate create name-of-the-migration --sql-file
```

This will create a directory in the `migrations` folder that has an "up" and a "down" sql file. The up file should create tables or modify columns,
the down file should drop tables and unmodify columns.

After creating a migration, you'll have to run `npx db-migrate up` to run it against your local database. Alternatively, you can restart your local
environment (Ctrl + C and then `yarn develop`). The migration will automatically run on the production database during the deployment in Travis CI. 

## Diagnosing problems / outages
If the production environment is having issues, you'll need access to Comunidades Unidas' AWS account to diagnose. Once you have access,
you'll need to install [Python3](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) and
[ebcli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). Then run `eb status`, `eb logs`, and other commands
to try to diagnose.