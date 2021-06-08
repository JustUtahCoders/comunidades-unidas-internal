# comunidades-unidas-internal

The code for comunidades unidas internal website.

This project uses Node + Express to interact with a MySQL Database and provide JSON APIs. The frontend is a React SPA that uses Typescript, babel, and webpack.

## API Documentation

comunidades-unidas-internal exposes JSON REST APIs at https://database.cuutah.org/api.

[API Documentation](/api-docs)

## Setup

Here are instructions to boot up this project locally so that you can change the code.

First, install the following:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://www.docker.com/get-started). This will also install docker-compose.
- [Node](https://nodejs.org/en/download/). Feel free to use [nvm](https://github.com/creationix/nvm) for this if you prefer, but any installation will work. Version >=13 is needed.
- [pnpm](https://pnpm.js.org/).

Now, run the following commands in a terminal:

```sh
git clone git@github.com:JustUtahCoders/comunidades-unidas-internal.git
cd comunidades-unidas-internal
pnpm install
pnpm run fix-everything
```

Now create a file inside of the comunidades-unidas-internal directory called `.env`.

```sh
# Required for local dev - can be any value
KEYGRIP_SECRET=123

# Only needed if you're testing specific features
# Ask Joel or Leonel for the values to use if you need them

# USE_GOOGLE_AUTH=true
# GOOGLE_CLIENT_ID=<insert_id_here>
# GOOGLE_CLIENT_SECRET=<insert_client_secret_here>
# GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
# GUEST_GITHUB_KEY=<insert_github_key_here>
# JPLS_USERNAME=<juntos_por_la_salud_ventanilla_username>
# JPLS_PASSWORD=<juntos_por_la_salud_ventanilla_password>
# TWILIO_ACCOUNT_SID=<twilio account sid>
# TWILIO_AUTH_TOKEN=<twilio auth token>
# TWILIO_SMS_SERVICE_SID=<twilio sid for the SMS service account>
# PUBLIC_PATH=<webpack public path>
```

Now run the following command:

```sh
pnpm run develop
```

Now go to http://localhost:8080 in a browser.

## DB Migrate errors

The nodejs server starts up before the database, so it's expected to see some database connection issues. If you're seeing other db-migrate errors, though, that are not related to connection, check if you have a `DATABASE_URL` environment variable set. If so, remove it.

```sh
# check if you have a database url env variable set, which can cause issues
printenv | grep DATABASE_URL

# remove the env variable
unset DATABASE_URL
```

## Deployments

This project is hosted by [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/). To deploy the code,
simply merge a pull request to main, which will automatically trigger a deployment via [Travis CI](https://travis-ci.org/).
You can see all current and previous deployments at https://travis-ci.org/JustUtahCoders/comunidades-unidas-internal.

## Database Migrations

If you need to make a change to the database schema, create a database migration by running the following command:

```sh
./node_modules/.bin/db-migrate create name-of-the-migration --sql-file
```

This will create a directory in the `migrations` folder that has an "up" and a "down" sql file. The up file should create tables or modify columns,
the down file should drop tables and unmodify columns.

After creating a migration, you'll have to run `./node_modules/.bin/db-migrate up` to run it against your local database. You can run either `pnpm run develop-database` or `pnpm run develop` to start up your database. `./node_modules/.bin/db-migrate down` should also be tested, to ensure that the migration can be undone. The migration will automatically run on the production database during the deployment in Travis CI.

## Connecting to the database

#### Local development

From a terminal in the comunidades-unidas-internal directory, run the following commands:

```sh
docker-compose exec db bash
mysql -u root -ppassword # yep, it has two p's. The first is for password, the second is for the word password which is the password

# Now you'll be in the mysql shell
use local_db;
show tables;
SELECT * FROM clients;
# etc etc
```

##### Windows Users

When using Windows, the above command does not work within the `Git for Windows` shell without using `winpty`. Fortunately, `winpty` comes installed with `Git for Windows` shell.

To be able to run the exact same command in a Windows environment, you need to add the following lines to your .bashrc file:

```
alias docker='winpty docker'
alias docker-compose='winpty docker-compose'
```

If you don't want to add these aliases, you will need to run the following command when starting `docker-compose`:

```sh
winpty docker-compose exec db bash
```

#### Production database

Run the following commands in a terminal. Replace `$HOSTNAME`, `$USERNAME`, and `$PASSWORD` with the correct values.

```sh
eb ssh
sudo yum install mysql
mysql -h $HOSTNAME -u $USERNAME -p$PASSWORD

# Now you'll be in the mysql shell
use ebdb;
show tables;
SELECT * FROM clients LIMIT 10;
```

## SSH access

Install [ebcli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). Then run `eb ssh`. Our code is
inside of the `/var/app/current/` directory.

## Diagnosing problems / outages

If the production environment is having issues, you'll need access to Comunidades Unidas' AWS account to diagnose. Once you have access,
you'll need to install [Python3](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) and
[ebcli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). Then run `eb status`, `eb logs`, and other commands to try to diagnose.

## Programmatic users

To provide someone with programmatic API access, perform the following steps:

1. Choose a username and password for them.
2. Choose a Google auth user for this programmatic user to "spoof". "Developers CU" is a decent one if no others make sense. This is the user that the programmatic user will inherit their permissions from. Use Developers CU if they need immigration access, but use a different, non-immigration account for those that don't need immigration access. Find the user id for this user.
3. Choose an expiration date for their access. It's better to give them short-lived access whenever possible, and have them ask for an extension if needed.
4. On your local machine, run `node script-utils/generate-password-hash.js`.
5. In the production database, run the following command. **Be sure to modify the values first!**

```mysql
INSERT INTO programmaticUsers (username, password, userId, expirationDate) VALUES ('username', 'password', 1, '2020-10-05 00:00:00');
```

6. Give the programmatic user the username and password. Tell them to read [this documentation](https://github.com/JustUtahCoders/comunidades-unidas-internal/tree/main/api-docs#how-to-use-your-api-key) on how to authenticate.
7. Verify that the account works. Install [httpie](https://httpie.org/) and run the following command: `http https://database.cuutah.org/api/clients -a username:password` and verify you get a client list back.
