# comunidades-unidas-internal
The code for comunidades unidas internal website

## Setup
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
yarn start
```

This should open up a browser tab with the app running. If it doesn't, try going to http://localhost:9018 directly

## Deployments
This project is hosted by AWS Elastic Beanstalk. To deploy the code, simply merge a pull request to master, which will
automatically trigger a deployment via Travis CI.
