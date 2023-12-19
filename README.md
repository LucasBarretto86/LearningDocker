# Learning Docker

**GPT: What is Docker?**

> Docker allows you to package an application and its dependencies into a container, which is a lightweight, standalone, and executable software package. These containers run on a shared operating system kernel, but they are isolated from each other. Unlike virtual machines (VMs), which emulate an entire operating system and run on a hypervisor, containers share the host OS kernel and use resources more efficiently. Docker containers provide a consistent and reproducible environment, making it easier to develop, deploy, and scale applications across different environments.

**GPT: What is Docker images and containers?**

> **Docker Images:** It's a bundle that packs up all the necessary stuff your software needs to run, like code and tools. Think of it as a snapshot of a complete environment.
>
> **Docker Containers:** Now take that bundle, unpack it, and run it. A container is like a live, isolated version of your software, doing its job without messing with anything else on your system.

---

**Table of Contents:**

- [Learning Docker](#learning-docker)
  - [Get started](#get-started)
  - [Images](#images)
    - [Pulling images](#pulling-images)
    - [Listing pulled images](#listing-pulled-images)
    - [Removing pulled images](#removing-pulled-images)
  - [Containers](#containers)
    - [Starting containers](#starting-containers)
    - [Listing containers](#listing-containers)
    - [Stopping containers](#stopping-containers)
  - [Dockerfile](#dockerfile)
    - [Parent Image (a.k.a base image)](#parent-image-aka-base-image)
    - [Copy source code](#copy-source-code)
    - [Installing dependencies](#installing-dependencies)
    - [Exposing container port](#exposing-container-port)
    - [Running commands](#running-commands)
  - [Building image](#building-image)
  - [References](#references)

---

## Get started

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

**Installation:**

```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Granting docker privileges for an user:**

To grant privileges and be able to run `docker` instead of `sudo docker`

```sh
sudo usermod -aG docker %USER%
```

> replace `%USER%` for your user

Then logout and login again

**Testing installation:**

```sh
sudo docker run hello-world
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

## Images

The first use an image will be downloading it from [Docker hub](https://hub.docker.com/) in our example we will be looking for the official `node` parent image (a.k.a base image)

On the Docker Hub we search for `node`

![Docker hub search](src/images/docker-hub-search.png)

To download the official image that will be our parent image (a.k.a base image), you will notice a field with the respective command do download it:

![Download command](src/images/docker-hub-command.png)

But this the basic command, this will install the latest image version, if you want to install a specific version you will have to check the `Tag` section that lists all the available versions that can be used

![Downloadable tags](src/images/docker-hub-tags.png)

> `alphine` suggests that this tag has the slimmest size

But for now let's install the latest version

### Pulling images

To download an image we need to run de pull command

```sh
sudo docker pull node
```

**Output:**

```mono
Using default tag: latest
latest: Pulling from library/node
90e5e7d8b87a: Pull complete 
27e1a8ca91d3: Pull complete 
d3a767d1d12e: Pull complete 
711be5dc5044: Pull complete 
22956530cc64: Pull complete 
5a84ca09aa3e: Pull complete 
27379e7795cc: Pull complete 
3a3f52d0acb3: Pull complete 
Digest: sha256:db2672e3c200b85e0b813cdb294fac16764711d7a66b41315e6261f2231f2331
Status: Downloaded newer image for node:latest
docker.io/library/node:latest
```

### Listing pulled images

To list the images pulled run:

```sh
sudo docker images

# OR

sudo docker image ls
```

**Output:**

```mono
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
node          latest    b866e35a0dc4   12 days ago    1.1GB
hello-world   latest    9c7a54a9a43c   7 months ago   13.3kB
```

Alternatively you can list the version installed like this:

```sh
sudo docker images --format "{{.Repository}}:{{.Tag}}"
```

**Output:**

```mono
node:latest
hello-world:latest
```

### Removing pulled images

To remove a image that is no longer used we use the following syntax: `sudo  docker rmi [OPTIONS] IMAGE[:TAG|@DIGEST]`

Let's remove the `hello-world` image used to test docker installation

```sh
sudo docker rmi hello-world:latest
```

**Output:**

```mono
Error response from daemon: conflict: unable to remove repository reference "hello-world:latest" (must force) - container daef4bf20a61 is using its referenced image 9c7a54a9a43c
```

Okay since the image is installed with docker we have to force it to be removed, for that we use the option `-f` just like we do with github

```sh
sudo docker rmi hello-world:latest -f
```

**Output:**

```mono
Untagged: hello-world:latest
Untagged: hello-world@sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0
Deleted: sha256:9c7a54a9a43cca047013b82af109fe963fde787f63f9e016fdc3384500c2823d
```

Let's check if it worked:

```sh
sudo docker images
```

**Output:**

```mono
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
node         latest    b866e35a0dc4   12 days ago   1.1GB
```

## Containers

Containers are running instances of images, since images are the blueprint of a container a running image produces a container

### Starting containers

To start a containers we need to run the image we pulled from the Docker Hub

```sh
docker run node:latest 
```

You will notice that nothing will happen in some cases, but keep in mind that this is okay, alternatively you can use the option `-it` to run the container in interactive mode and get a shell prompt within the container

```sh
docker run -it node:latest
```

**Output:**

```mono
Welcome to Node.js v21.4.0.
Type ".help" for more information.
> 
```

### Listing containers

To check the list of running Docker containers, you can use the docker ps command. By default, this command shows you the currently running containers along with some basic information such as the container ID, names, ports, and status.

```sh
sudo docker ps
```

**Output:**

```mono
CONTAINER ID   IMAGE         COMMAND                  CREATED              STATUS              PORTS     NAMES
1e01607fe8fb   node:latest   "docker-entrypoint.s…"   About a minute ago   Up About a minute             great_mccarthy
```

If you want to check all containers including those which are stopped you ca add the option `-a`

```sh
sudo docker ps -a
```

**Output:**

```mono
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                      PORTS     NAMES
1e01607fe8fb   node:latest    "docker-entrypoint.s…"   3 minutes ago    Up 3 minutes                          great_mccarthy
0508d9e6575d   node:latest    "docker-entrypoint.s…"   4 minutes ago    Exited (0) 4 minutes ago              brave_wiles
cf851a3911a3   node:latest    "docker-entrypoint.s…"   9 minutes ago    Exited (0) 9 minutes ago              jolly_chebyshev
fb8990de47ae   node:latest    "docker-entrypoint.s…"   40 minutes ago   Exited (0) 38 minutes ago             cool_goodall
40e4b4aede28   node:latest    "docker-entrypoint.s…"   41 minutes ago   Exited (0) 41 minutes ago             fervent_wing
6d010bf3d669   9c7a54a9a43c   "/hello"                 3 hours ago      Exited (0) 3 hours ago                zealous_einstein
daef4bf20a61   9c7a54a9a43c   "/hello"                 10 days ago      Exited (0) 10 days ago                nice_herschel
```

> to show only the container id you can use `-q`

You can also inspect a container

```sh
sudo docker inspect 1e01607fe8fb

# OR

sudo docker inspect great_mccarthy
```

**Output:**

```mono
[
    {
        "Id": "1e01607fe8fb55ddf743ca5a9963b3b1a55f6944d3812f8a860f979cf373e324",
        "Created": "2023-12-18T21:11:15.465482575Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "node"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 34641,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2023-12-18T21:11:16.460797208Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:b866e35a0dc4df85e168524b368567023eb22b06fe16f2237094e937fcd24d96",
        "ResolvConfPath": "/var/lib/docker/containers/1e01607fe8fb55ddf743ca5a9963b3b1a55f6944d3812f8a860f979cf373e324/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/1e01607fe8fb55ddf743ca5a9963b3b1a55f6944d3812f8a860f979cf373e324/hostname",
        "HostsPath": "/var/lib/docker/containers/1e01607fe8fb55ddf743ca5a9963b3b1a55f6944d3812f8a860f979cf373e324/hosts",
        "LogPath": "/var/lib/docker/containers/1e01607fe8fb55ddf743ca5a9963b3b1a55f6944d3812f8a860f979cf373e324/1e01607fe8fb55ddf743ca5a9963b3b1a55f6944d3812f8a860f979cf373e324-json.log",
        "Name": "/great_mccarthy",
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
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "ConsoleSize": [
                52,
                205
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
            "Ulimits": null,
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
                "LowerDir": "/var/lib/docker/overlay2/3c5fea15736bc2e997488e2fa00464579f8be14c937db169e9d5c5b148cb91d6-init/diff:/var/lib/docker/overlay2/86cbd5491742bc67838f5b368433803621806a437302e31687c5acc8d38a1fd8/diff:/var/lib/docker/overlay2/a67b4b36d1d3570cd98117019a270bf1f323b2fc26e41bf1dd63e6a3856552f3/diff:/var/lib/docker/overlay2/91ffcd243591df5f0f930e191035ffb917502a6ba2457bf907d5d52f6619c43a/diff:/var/lib/docker/overlay2/5505d50b68159923351dce084cb9b1382903a15a2d095afe131b87f4a1fbbe3f/diff:/var/lib/docker/overlay2/0aa7ac21f3ce381f927f953a30f60b698ecc344061400e39f35cdf3ac6ebde07/diff:/var/lib/docker/overlay2/6ef5d962cb6fa176bfc3e95dd6c0ff632282f2ce88c57c1aafcc20f4a88665d0/diff:/var/lib/docker/overlay2/76e711ba5fa06de20314d995f5393b69d0a956f2710f87623b9256d4d241109f/diff:/var/lib/docker/overlay2/659a0ae5bdd02fdabe36e6fa7123e616b35690af56a5f3b2b081aebf4ac518c5/diff",
                "MergedDir": "/var/lib/docker/overlay2/3c5fea15736bc2e997488e2fa00464579f8be14c937db169e9d5c5b148cb91d6/merged",
                "UpperDir": "/var/lib/docker/overlay2/3c5fea15736bc2e997488e2fa00464579f8be14c937db169e9d5c5b148cb91d6/diff",
                "WorkDir": "/var/lib/docker/overlay2/3c5fea15736bc2e997488e2fa00464579f8be14c937db169e9d5c5b148cb91d6/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "1e01607fe8fb",
            "Domainname": "",
            "User": "",
            "AttachStdin": true,
            "AttachStdout": true,
            "AttachStderr": true,
            "Tty": true,
            "OpenStdin": true,
            "StdinOnce": true,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NODE_VERSION=21.4.0",
                "YARN_VERSION=1.22.19"
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
            "SandboxID": "a1acf55e021493149ee9705f5a384ef9460f07a8df6dcac7bb9952c2d02d434a",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {},
            "SandboxKey": "/var/run/docker/netns/a1acf55e0214",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "046ed095ab8eaf716698594286f39dbf1ad6d15b8e25ec4f13cd28ccced519d6",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "1f10cd67380ce84b4997df42ad59001d0baafb163e7605ed7e44db717085f4d1",
                    "EndpointID": "046ed095ab8eaf716698594286f39dbf1ad6d15b8e25ec4f13cd28ccced519d6",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

### Stopping containers

To stop a docker container you can use the syntax `docker stop [OPTIONS] CONTAINER [CONTAINER...]` in our example it would be like this:

```sh
sudo docker inspect 1e01607fe8fb

# OR

sudo docker stop great_mccarthy
```

## Dockerfile

Images are constituted by layers, these layers are responsible to define each part of the structure that our container will have

The initial layer of a image is called `parent image (a.k.a base image)`, it will include the OS and some other runtime environment configuration

The following layers are used to download the source code and its dependencies, and the last layer is the layer where we will run the necessary commands to make our container ready use

To be able to create a docker image and specify each layer behavior we will need to create a `Dockerfile`

**GPT: What is a Dockerfile?**

> A Dockerfile is a text file that contains instructions for building a Docker image. It serves as a blueprint for creating a lightweight, portable, and self-sufficient containerized application. The Dockerfile includes commands to specify the parent image (a.k.a base image), set up the environment, copy files, install dependencies, and configure the application. When the Dockerfile is used with the docker build command, it produces a Docker image that encapsulates the application and its dependencies, allowing for consistent deployment across different environments.

In order to learn hands-on I created a dummy project that will be used on the following topics

[Example: Project: dummy-api](/src/projects/dummy-api/app.js)

```tree
.
├── app.js
└── package.json
```

So to be able to run our dummy project within a container we gonna have to create an image that will be contain all the necessary configurations to run our application that's when dockerfile comes in.

So within our dummy project we are going to create a file called `Dockerfile` without any extension

```tree
.
├── app.js
├── Dockerfile
└── package.json
```

### Parent Image (a.k.a base image)

On or Dockerfile each instruction is a layer the first instruction will be reference to our parent image (a.k.a base image)

```Dockerfile
# ./Dockerfile

FROM node:18-alpine
```

> Notice that it doesn't need to be necessarily the on we pulled locally

### Copy source code

The second layer will be the copy of our source code, the syntax is `COPY %FROM% %TO%`, in our case `%FROM%` = `.` (current folder) `%TO%` = `dummy-api/`

```Dockerfile
# ./Dockerfile

FROM node:18-alpine

COPY . dummy-api/
```

### Installing dependencies

First to guarantee that the commands we are going to run on the container will be ran on the exact root of our project we are going to add the instruction `ẀORKDIR` soon after the `FROM` instruction, by that we specify the root folder of our container.

After that we will have to adjust the destination for our `COPY` instruction, since we are defining the `ẀORKDIR` we no longer need to specify the destination path as we copy because docker will already know where to put the project files.

Soon as we set this up we are ready to set the `RUN` to install our dependencies

```Dockerfile
# ./Dockerfile

FROM node:18-alpine

WORKDIR dummy-api/

COPY . .

RUN yarn install
```

### Exposing container port

To be specify tje port our containerized environment will be listening the application on the during runtime we need use the `EXPOSE` instruction, it's optional but it can be helpful.

```Dockerfile
# ./Dockerfile

FROM node:18-alpine

WORKDIR dummy-api/

COPY . .

RUN yarn install

EXPOSE 5500
```

> Keep in mind that `EXPOSE` doesn't mean that the local machine will have direct communication with the container itself, for that we use other options as we run the the container image

### Running commands

After we added the basic instruction to create or container we need to provide the necessary commands that needs to be executed as the container gets running, for that we will use the instruction `CMD`,sending an Array of strings with instruction as parameter:

```Dockerfile
# ./Dockerfile

FROM node:18-alpine

WORKDIR dummy-api/

COPY . .

RUN yarn install

EXPOSE 5500

CMD ["node", "app.js", "--port 5500"]
```

> In our case we are just ask node to run our application

## Building image

After creating the Dockerfile the next step will be to produce a Docker image from it:

```sh
sudo docker build -t my-dummy-api .
```

> The option `-t` allow us to give a tag name for our image and the `.` means where the Dockerfile is relatively to where the build command is called

**Output:**

```mono
[+] Building 16.2s (9/9) FINISHED                                                                                                                                            docker:default
 => [internal] load .dockerignore                                                                                                                                                      0.0s
 => => transferring context: 2B                                                                                                                                                        0.0s
 => [internal] load build definition from Dockerfile                                                                                                                                   0.0s
 => => transferring dockerfile: 104B                                                                                                                                                   0.0s
 => [internal] load metadata for docker.io/library/node:18-alpine                                                                                                                      2.5s
 => [1/4] FROM docker.io/library/node:18-alpine@sha256:b1a0356f7d6b86c958a06949d3db3f7fb27f95f627aa6157cb98bc65c801efa2                                                                9.1s
 => => resolve docker.io/library/node:18-alpine@sha256:b1a0356f7d6b86c958a06949d3db3f7fb27f95f627aa6157cb98bc65c801efa2                                                                0.0s
 => => sha256:0f158788f409a5decd9495205daf4aa17df26d8219d6dc12acab5949342866fe 40.24MB / 40.24MB                                                                                       1.5s
 => => sha256:f028dff98271801e449c3ebac94a319851128c0ec687e13e00a68b2d98ec4700 2.34MB / 2.34MB                                                                                         0.8s
 => => sha256:b1a0356f7d6b86c958a06949d3db3f7fb27f95f627aa6157cb98bc65c801efa2 1.43kB / 1.43kB                                                                                         0.0s
 => => sha256:8842b060b01af71c082cee310b428a2d825e940d9fd9e450e05d726aea66a480 1.16kB / 1.16kB                                                                                         0.0s
 => => sha256:f3776b60850deec9eb1da7746fa20b3f000bf153408dc896d6606704c83f948d 7.14kB / 7.14kB                                                                                         0.0s
 => => sha256:661ff4d9561e3fd050929ee5097067c34bafc523ee60f5294a37fd08056a73ca 3.41MB / 3.41MB                                                                                         1.1s
 => => sha256:18f25c33705ddc3351cc4893fdc0a38405bdd0741643798918fa2b0146fd5a9d 451B / 451B                                                                                             1.0s
 => => extracting sha256:661ff4d9561e3fd050929ee5097067c34bafc523ee60f5294a37fd08056a73ca                                                                                              0.5s
 => => extracting sha256:0f158788f409a5decd9495205daf4aa17df26d8219d6dc12acab5949342866fe                                                                                              6.5s
 => => extracting sha256:f028dff98271801e449c3ebac94a319851128c0ec687e13e00a68b2d98ec4700                                                                                              0.3s
 => => extracting sha256:18f25c33705ddc3351cc4893fdc0a38405bdd0741643798918fa2b0146fd5a9d                                                                                              0.0s
 => [internal] load build context                                                                                                                                                      0.6s
 => => transferring context: 2.16MB                                                                                                                                                    0.6s
 => [2/4] WORKDIR dummy-api/                                                                                                                                                           0.3s
 => [3/4] COPY . .                                                                                                                                                                     0.5s
 => [4/4] RUN yarn install                                                                                                                                                             3.2s
 => exporting to image                                                                                                                                                                 0.4s 
 => => exporting layers                                                                                                                                                                0.4s 
 => => writing image sha256:1f33c17521fc7195b7b4134a4063ced4d9ff064c49005651346db14b9a7a86da                                                                                           0.0s 
 => => naming to docker.io/library/my-dummy-api      
```

Now if we run the `Docker images` command:

```mono
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
my-dummy-api   latest    1f33c17521fc   4 minutes ago   136MB
node           latest    b866e35a0dc4   13 days ago     1.1GB
```

## References

[Installing Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
[Net Ninjas - Docker Crash Course](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7)
