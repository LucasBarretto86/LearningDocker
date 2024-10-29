# Learning Docker

- [Learning Docker](#learning-docker)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
      - [Installation errors](#installation-errors)
  - [Images](#images)
    - [Pulling images](#pulling-images)
    - [Listing images](#listing-images)
    - [Remove images](#remove-images)
    - [Create images](#create-images)
      - [Generate `Dockerfile`](#generate-dockerfile)
      - [Build image](#build-image)
  - [Containers](#containers)
    - [Creating containers](#creating-containers)
    - [Listing containers](#listing-containers)
    - [Inspect containers](#inspect-containers)
    - [Starting containers](#starting-containers)
    - [Stopping containers](#stopping-containers)
      - [Stopping all at once](#stopping-all-at-once)
    - [Removing containers](#removing-containers)
    - [Prune containers](#prune-containers)
  - [`Dockerfile`](#dockerfile)
    - [`Dockerfile` directives](#dockerfile-directives)
  - [Docker Compose](#docker-compose)
    - [Docker compose Installation](#docker-compose-installation)
    - [`docker-compose.yml` directives](#docker-composeyml-directives)
  - [Commands References](#commands-references)
    - [Container commands](#container-commands)
    - [Image commands](#image-commands)
    - [Docker Compose commands](#docker-compose-commands)

## Getting Started

### Installation

**Adding official repository:**

```sh
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

**Install:**

```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Granting docker privileges from the user:**

Grant privileges to run `docker` instead of `sudo docker`

```sh
sudo usermod -aG docker %USER%
```

> replace `%USER%` for your user

Then logout and login again

**Testing installation:**

```sh
docker run hello-world
```

**Output:**

```mono
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

```

#### Installation errors

If you encounter this error:

```mono
docker: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Head "http://%2Fvar%2Frun%2Fdocker.sock/_ping": dial unix /var/run/docker.sock: connect: permission denied.
See 'docker run --help'.
```

1. Log out and Log Back In:
   - `newgrp docker`
2. Verify Group Membership:
   - `groups $USER`
3. Test again:
   - `docker run hello-world`

**Output:**

```mono
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

```

## Images

### Pulling images

To download an existing image from Docker Hub we need to run de pull command

```sh
docker pull node
```

> Docker Hub is a cloud-based registry service where Docker users and developers can share container images. It's essentially a central repository for Docker images, allowing you to find, store, and download pre-built images for various applications, environments, and services.

### Listing images

To list existing images, pulled or created we use

```sh
docker images
```

### Remove images

To remove images

```sh
# NAME
docker rmi node:latest

# OR

# IMAGE ID
docker rmi f7dc0beaca7e


```

### Create images

To create a runnable Docker Image there's 2 steps

1. Generate `Dockerfile`
2. Build Image
3. Run created image

> `Dockerfile` is like the blueprint to create a runnable container, so it requires

#### Generate `Dockerfile`

within the root of our project we need to create the `Dockerfile`

```sh
touch Dockerfile
```

```mono
<!-- Example from our example project /src/projects/dummy-api -->
.
├── app.js
├── Dockerfile
└── package.json
```

After the file is created the next step is structure the [Dockerfile directives](#dockerfile-directives), that will specify how the image has to be built, here is simple example of a `Dockerfile` with basic directives:

```Dockerfile
# ./Dockerfile

FROM node:18-alpine

WORKDIR dummy-api/

COPY . .

RUN yarn install
```

#### Build image

With a valid `Dockerfile` we create a runnable image like this

```sh
docker build -t my-dummy-api .
```

> The option `-t` allow us to give a name for our image and the `.` means where the `Dockerfile` is, relatively to where the build command is called

We could also create image with tag use `:` like this:

```sh
docker build -t my-dummy-api:v1 .
```

After that if we list the images `docker images` you can see the name and the tag we specified:

```mono
REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
my-dummy-api   v1        2d4a40f2d79f   11 seconds ago   139MB
node           latest    b866e35a0dc4   2 weeks ago      1.2GB
```

## Containers

Containers are running instances of images, since images are the blueprint of a container a running image produces a container

### Creating containers

To create a containers is required a `image`, for that we use the `run` command using an existing or created image.

The `run` command creates and starts a container

```sh
# In this example is used the image pulled from the Docker Hub

docker run node:latest 
```

**Additional running options:**

The `run` command also accepts multiple options that allow us to define containers properties, like name, port etc..:

Here is a example setting name, port and image:

```sh
docker run --name my-node --p 5005 -d node:latest
```

**Interactive mode option:**

The `run` creates the container and starts it but it does in a detached mode, meaning, that the running container is not interactive, to be able to interact with the container itself we need to use the option `-it` to get a shell prompt within the container

```sh
docker run -it node:latest
```

**Mapping local folder with volumes:**

In development there's simple instances where you might want the container to be aware for changes on the project file for that we can run the container setting a volume on the root of the project so that it will be an "open chanel" between the container and the local host filesystem

```sh
docker run -p 5500:5500 -v "$(pwd):/app" my-image
```

### Listing containers

To list running containers we use:

```sh
# Running containers
docker ps

# OR 

# Regardless of container state
docker ps -a
```

### Inspect containers

You can also inspect a container

```sh
docker inspect my-node

# OR

docker inspect 800c589eed29
```

**Output:**

```mono
[
    {
        "Id": "800c589eed2956b6a0bef434abcaf5c65d6a61cfe837d7fe6722d00406fb2a04",
        "Created": "2024-09-24T21:15:11.764551608Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "node"
        ],
        "State": {
            "Status": "exited",
            "Running": false,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 0,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2024-09-24T21:15:11.872015028Z",
            "FinishedAt": "2024-09-24T21:15:12.069486918Z"
        },
        "Image": "sha256:2ef13a9c33b09953afea4d8c6c6cfd76e04e97a24a63b109c0ea3670d3df4ccc",
        "ResolvConfPath": "/var/lib/docker/containers/800c589eed2956b6a0bef434abcaf5c65d6a61cfe837d7fe6722d00406fb2a04/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/800c589eed2956b6a0bef434abcaf5c65d6a61cfe837d7fe6722d00406fb2a04/hostname",
        "HostsPath": "/var/lib/docker/containers/800c589eed2956b6a0bef434abcaf5c65d6a61cfe837d7fe6722d00406fb2a04/hosts",
        "LogPath": "/var/lib/docker/containers/800c589eed2956b6a0bef434abcaf5c65d6a61cfe837d7fe6722d00406fb2a04/800c589eed2956b6a0bef434abcaf5c65d6a61cfe837d7fe6722d00406fb2a04-json.log",
        "Name": "/my-node",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "docker-default",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "bridge",
            "PortBindings": {
                "5005/tcp": [
                    {
                        "HostIp": "",
                        "HostPort": ""
                    }
                ]
            },
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "ConsoleSize": [
                47,
                183
            ],
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "private",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": [],
            "BlkioDeviceWriteBps": [],
            "BlkioDeviceReadIOps": [],
            "BlkioDeviceWriteIOps": [],
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": null,
            "PidsLimit": null,
            "Ulimits": [],
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware",
                "/sys/devices/virtual/powercap"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/c0ca811f0767d8c0b19546856b202365c5c07b3b176cf6d1e34790e76600d7d8-init/diff:/var/lib/docker/overlay2/d6fc63bcff73f78738c407ced716b12628e408f1d741887cc667fbe7bfe50c3f/diff:/var/lib/docker/overlay2/f06048741a33d7a4e29a5af0b25ef1f68e8127e62fe048b33e97166288b5aa0d/diff:/var/lib/docker/overlay2/063d25a9c7a428081dbeff52f79ce210f25f970feee1f6a7f1ba097897d056a2/diff:/var/lib/docker/overlay2/12f64e970d9acaae0395ebcb40859019573fb7fbfb42fd312c0f2b8188532f84/diff:/var/lib/docker/overlay2/47d43fbde5a71b69d31a76e834b3703f5d632c06d679686d921c46b46d88cd81/diff:/var/lib/docker/overlay2/86925120a20cfa8e94c64deb5188a7a1b600109e45f1f6e1f442c8f991195365/diff:/var/lib/docker/overlay2/73349c741202b4fdf516e4e34d7aab8e8285d6d64b32e0703accdae0361bd486/diff:/var/lib/docker/overlay2/77265145bd151e68831e57755bf9f294b077b1468c6cf9acc964e9c4dcf67c79/diff",
                "MergedDir": "/var/lib/docker/overlay2/c0ca811f0767d8c0b19546856b202365c5c07b3b176cf6d1e34790e76600d7d8/merged",
                "UpperDir": "/var/lib/docker/overlay2/c0ca811f0767d8c0b19546856b202365c5c07b3b176cf6d1e34790e76600d7d8/diff",
                "WorkDir": "/var/lib/docker/overlay2/c0ca811f0767d8c0b19546856b202365c5c07b3b176cf6d1e34790e76600d7d8/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "800c589eed29",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "5005/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NODE_VERSION=22.9.0",
                "YARN_VERSION=1.22.22"
            ],
            "Cmd": [
                "node"
            ],
            "Image": "node:latest",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": [
                "docker-entrypoint.sh"
            ],
            "OnBuild": null,
            "Labels": {}
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "",
            "SandboxKey": "",
            "Ports": {},
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "",
            "Gateway": "",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "",
            "IPPrefixLen": 0,
            "IPv6Gateway": "",
            "MacAddress": "",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "",
                    "DriverOpts": null,
                    "NetworkID": "3d30eb9f215e1a89ee556a6d7c502b879c7dc7c97a7db877509dd33f4597a6fb",
                    "EndpointID": "",
                    "Gateway": "",
                    "IPAddress": "",
                    "IPPrefixLen": 0,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DNSNames": null
                }
            }
        }
    }
]
```

### Starting containers

To start an existing container we need to run the `start` command passing `CONTAINER ID` or `NAMES` as argument

```sh
# NAME
docker start my-node

# OR

#  CONTAINER ID
docker start 800c589eed29
```

### Stopping containers

To stop container we need to run the `stop` command passing `CONTAINER ID` or `NAMES` as argument

```sh
# NAME
docker stop my-node

# OR

#  CONTAINER ID
docker stop 800c589eed29
```

#### Stopping all at once

We could also stop various containers giving multiple ids or tags on a single
command, but in cases you want stop all at once there's a small trick:

```sh
docker stop $(docker ps -q)
```

### Removing containers

To remove a containers first we need to be sure they are stopped

```sh
# NAME
docker rm my-node

# OR

# CONTAINER ID
docker rm 800c589eed29
```

> It's also possible to force a removal by isn't recommended, in that case we would use `rmi` instead of `rm`

### Prune containers

To remove a single stopped container we use `rm` or `rmi`, but we can remove all at once from the disk:

```sh
#  Removes only stopped containers
docker container prune
```

## `Dockerfile`

### `Dockerfile` directives

Here's a table of common `Dockerfile` directives

| Directive    | Description                                                                                                                            | Example                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `FROM`       | Specifies the base image to use for the new image.                                                                                     | `FROM node:18-alpine`                              |
| `COPY`       | Copies files or directories from the host file system to the image.                                                                    | `COPY . /app`                                      |
| `ADD`        | Similar to `COPY`, but also supports URL sources and automatically extracts tar files.                                                 | `ADD file.tar.gz /app`                             |
| `RUN`        | Executes a command in the shell to build the image, often used to install packages.                                                    | `RUN apt-get update && apt-get install -y python3` |
| `CMD`        | Specifies the default command to run when a container is started from the image.                                                       | `CMD ["node", "app.js"]`                           |
| `ENTRYPOINT` | Configures a container that will run as an executable.                                                                                 | `ENTRYPOINT ["python3", "script.py"]`              |
| `ENV`        | Sets environment variables in the image.                                                                                               | `ENV NODE_ENV=production`                          |
| `EXPOSE`     | Informs Docker that the container listens on the specified network ports at runtime.                                                   | `EXPOSE 5500`                                      |
| `WORKDIR`    | Sets the working directory for any `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, and `ADD` instructions.                                         | `WORKDIR /app`                                     |
| `VOLUME`     | Creates a mount point with the specified path and marks it as holding externally mounted volumes from native host or other containers. | `VOLUME ["/data"]`                                 |

## Docker Compose

Docker Compose defines, configures, and runs multi-container applications with a YAML file (`docker-compose.yml`) , making it easy to manage and set up multi-service environments with one docker-compose up command. In development, it provides consistency across services, simplifies dependency management, and supports seamless code changes.

### Docker compose Installation

```sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### `docker-compose.yml` directives

Docker Compose directives are configuration keys used in a docker-compose.yml file to define and manage multi-container applications, specifying aspects like services, networks, and volumes.

| Directive     | Description                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| `version`     | Specifies the version of the Docker Compose file format being used.                                       |
| `services`    | Defines the different services (containers) that make up the application, including their configurations. |
| `build`       | Specifies the context or Dockerfile for building the image for a service.                                 |
| `image`       | Specifies the image to use for a service, either from a registry or a locally built image.                |
| `command`     | Overrides the default command for a container when it starts.                                             |
| `ports`       | Maps ports from the host to the container, allowing external access to the service.                       |
| `environment` | Sets environment variables for the service's container.                                                   |
| `volumes`     | Specifies volume mappings between the host and the container, allowing data persistence and sharing.      |
| `networks`    | Defines custom networks that the services can connect to, enabling communication between them.            |
| `depends_on`  | Specifies service dependencies, ensuring that one service starts only after another has started.          |

**Example:**

Here’s a complete example of a `docker-compose.yml` file using these directives:

```yaml
version: '3.8'

services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - my_network
    depends_on:
      - db

  db:
    image: postgres
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypassword
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - my_network

volumes:
  db_data:

networks:
  my_network:
    driver: bridge
```

This example defines a web service using Nginx and a database service using Postgres, with appropriate configurations for ports, volumes, and networks.

## Commands References

### Container commands

Use `docker container` to check all the available commands for containers

| **Command** | **Description**                                                               |
| :---------- | :---------------------------------------------------------------------------- |
| attach      | Attach local standard input, output, and error streams to a running container |
| commit      | Create a new image from a container's changes                                 |
| cp          | Copy files/folders between a container and the local filesystem               |
| create      | Create a new container                                                        |
| diff        | Inspect changes to files or directories on a container's filesystem           |
| exec        | Execute a command in a running container                                      |
| export      | Export a container's filesystem as a tar archive                              |
| inspect     | Display detailed information on one or more containers                        |
| kill        | Kill one or more running containers                                           |
| logs        | Fetch the logs of a container                                                 |
| ls          | List containers                                                               |
| pause       | Pause all processes within one or more containers                             |
| port        | List port mappings or a specific mapping for the container                    |
| prune       | Remove all stopped containers                                                 |
| rename      | Rename a container                                                            |
| restart     | Restart one or more containers                                                |
| rm          | Remove one or more containers                                                 |
| run         | Create and run a new container from an image                                  |
| start       | Start one or more stopped containers                                          |
| stats       | Display a live stream of container(s) resource usage statistics               |
| stop        | Stop one or more running containers                                           |
| top         | Display the running processes of a container                                  |
| unpause     | Unpause all processes within one or more containers                           |
| update      | Update configuration of one or more containers                                |
| wait        | Block until one or more containers stop, then print their exit codes          |

### Image commands

Use `docker image` to list all available images commands

| **Command** | **Description**                                                          |
| :---------- | :----------------------------------------------------------------------- |
| build       | Build an image from a Dockerfile                                         |
| history     | Show the history of an image                                             |
| import      | Import the contents from a tarball to create a filesystem image          |
| inspect     | Display detailed information on one or more images                       |
| load        | Load an image from a tar archive or STDIN                                |
| ls          | List images                                                              |
| prune       | Remove unused images                                                     |
| pull        | Download an image from a registry                                        |
| push        | Upload an image to a registry                                            |
| rm          | Remove one or more images                                                |
| save        | Save one or more images to a tar archive (streamed to STDOUT by default) |
| tag         | Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE                    |

### Docker Compose commands

Use `docker-compose` to list all available images commands

| Command                  | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| up      | Starts the defined services and builds images if needed.           |
| down    | Stops and removes the containers, networks, and volumes.           |
| build   | Builds the images for the services defined in the Compose file.    |
| start   | Starts stopped services without recreating containers.             |
| stop    | Stops running services without removing them.                      |
| restart | Stops and then starts services.                                    |
| logs    | Displays the logs for the services.                                |
| exec    | Executes a command in a running container.                         |
| run     | Runs a one-off command in a new container.                         |
| ps      | Lists the containers for the services defined in the Compose file. |
| config  | Validates and displays the Compose file.                           |
| rm      | Removes stopped service containers.                                |
