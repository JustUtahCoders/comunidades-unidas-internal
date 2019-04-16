# comunidades-unidas-internal

[![Build Status](https://travis-ci.org/JustUtahCoders/comunidades-unidas-internal.svg?branch=master)](https://travis-ci.org/JustUtahCoders/comunidades-unidas-internal)

The code for comunidades unidas internal website

This project uses Node + Express to interact with a MySQL Database and provide JSON APIs. The frontend is a React SPA that uses Typescript, babel, and webpack.

## API Documentation

comunidades-unidas-internal exposes JSON REST APIs at https://database.cuutah.org/api.

[API Documentation](/api-docs)

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
```

Now create a file inside of the comunidades-unidas-internal directory called `.env`. Ask Joel or Leonel for the values to use.

```sh
GOOGLE_CLIENT_ID=<insert_id_here>
GOOGLE_CLIENT_SECRET=<insert_client_secret_here>
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
KEYGRIP_SECRET=123
```

Now run the following command:

```sh
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

## Connecting to the database

#### Local development

From a terminal in the comunidades-unidas-internal directory, run the following commands:

```sh
docker-compose exec db bash
mysql -u root -ppassword # yep, it has two p's. The first is for password, the second is for the word password which is the password

# Now you'll be in the mysql shell
use local_db;
show tables;
SELECT * FROM Dummy;
# etc etc
```

#### Production database

Run the following commands in a terminal. Replace `$HOSTNAME`, `$USERNAME`, and `$PASSWORD` with the correct values.

```sh
mysql -h$HOSTNAME -u$USERNAME -p$PASSWORD
# OR, if you don't have `mysql` installed on your computer
docker run -it --rm mysql mysql -h$HOSTNAME -u$USERNAME -p$PASSWORD

# Now you'll be in the mysql shell
use ebdb;
show tables;
```

## SSH access

Install [ebcli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). Then run `eb ssh`. Our code is
inside of the `/var/app/current/` directory.

## Diagnosing problems / outages

If the production environment is having issues, you'll need access to Comunidades Unidas' AWS account to diagnose. Once you have access,
you'll need to install [Python3](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) and
[ebcli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). Then run `eb status`, `eb logs`, and other commands
to try to diagnose.
