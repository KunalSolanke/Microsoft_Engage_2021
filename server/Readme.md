# Connect backend

This is backend folder

<img align="center" src="./public/images/landing.png"/>

## Skeleton

Here is the basic skeletion:

```bash
├── bin/www(server file)
├── controllers(all the views)
├── routes(all the routes)
├── models (all database models)
├── views
│    ├── **/*.js(ejs views)
├── public
    ├──uploads(all the media uploaded by user)
│   ├── css
│   │   ├── **/*.css
│   ├── images
│   ├── js
│   │   ├── **/*.js
│   └── partials/template
├── README.md
--- socket.js
├── node_modules
├── Dockerfile
├── docker_compose.yaml
├── package.json
├── yarn.lock(if using yarn)
└── .gitignore
```

## Dev Setup

The docker files and environment variables are configured to be spin up mongo db inside one docker container and your applications inside another container.

```bash
  #To start the containers
  docker-compose up
  #Stop containers in diff terminal than docker
  docker-compose --volumes down
  #build docker images
  docker-compose up --build #if there are changes in installed deps
  #faster builds
  COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
  #windows
  set "COMPOSE_DOCKER_CLI_BUILD=1" & set "DOCKER_BUILDKIT=1" & docker-compose build
  # or to make this permanent add following to docker daemon /etc/docker/daemon.json
  { "features": { "buildkit": true } }
```

**Helpers:**

1. Remove dangling images: `docker rmi $(docker images -f dangling=true -q ) -f`
2. Remove all volumes: `docker volume rm $(docker volume ls -q)`

**Admin panel:**

<img align="center" src="./public/images/admin.png"/>
In dev you can use any valid email  pass can be anything for login into admin panel make sure to remove those in product

### docs are live [here](https://kunalsolanke.github.io/EngageNodeDocs/)
