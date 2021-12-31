# Docker crib-notes

## Overview

*What is docker?* 

## Why Containers?
*The what is docker, what are containers, and why are they used goes here*

## Building our first image

We will start by creating a basic image for a small app built from the [hello.go](./hello.go) file. 
As we discussed earlier will create our image using other images as a base. For this container we will use 
the [scracth](https://hub.docker.com/_/scratch). The scratch image is meant to be used when creating base images 
or a super small image like the one we are about to build. 

<br/>

##  Step 1 - Creating a Dockerfile

The Dockerfile is a text file that describes how an image is to be built.  In our case, we will have three lines: 

```
FROM scratch  
COPY hello .
CMD ["/hello"]
```


### FROM scratch ###

The [`FROM`](https://docs.docker.com/engine/reference/builder/#from) instruction initializes a new build stage for
which all following instructions will be built on. Every `Dockerfile` must have at least one `FROM` instruction, 
typically it is the first line of a Dockerfile.  

In our case we are telling docker that we want to use the scratch image with the tag `latest`. if we wanted to
specify a version of the image to run we could have used `From scratch:v1.0.0` which would use that specific a
particular version of the image we want to use.

### COPY hello ###

As you might expect, the [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) command copies the file(s)
from the build machine and adds them to the container's file system in the path specified.  In our case, `COPY` takes
the `hello` binary and places it in the [`WORKDIR`](https://docs.docker.com/engine/reference/builder/#workdir) of the
image.

### CMD ["hello"] ###

The [`CMD`](https://doorknocker/engine/reference/builder/#CMD) instruction is how we inform docker as to what to run 
when the container starts.  Here, we are asking it to run the `hello` binary. There are three different ways to use 
the `CMD` instruction:

1. `CMD ["executable", "param1", "param2"]` this is the exec form, is the one we are using and is the preferred way to use the `CMD`instruction.
   
2. `CMD ["param1", "param2"]` which is used as default parameters to the [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) instruction, which is beyond the scope of this document.

3. `CMD executable param1 param2` known as the shell form.

We now have a Dockerfile that will create an image usin the `scratch` image to build upon.  The greetings binary is copied onto the images filesystem and when a container based off of this image is started it will run our `greetings` CLI app.  

With that introduction complete, let's create the greetings image.

<br/>

## Step 2 - Creating an Image

Docker images are used to create containers

The simplest way to create an image is to run `docker build .` in a directory where there is a Dockerfile. After running the command you'll see output similar to this.

```
Sending build context to Docker daemon  9.934MB
Step 1/3 : FROM scratch
 ---> 
Step 2/3 : COPY hello .
 ---> fd7957db532d
Step 3/3 : CMD ["/hello"]
 ---> Running in be4199375c65
Removing intermediate container be4199375c65
 ---> 2784fad72915
Successfully built 2784fad72915
```

One of the downsides of using this approach to image creation is that there's no easy way to 'see' your image.  Running `docker images` will give you alist of all docker images on your machine.  Her's the output of `docker images` on my machine.

```
REPOSITORY                        TAG       IMAGE ID       CREATED         SIZE
<none>                            <none>    2784fad72915   3 seconds ago   1.77MB
docker.elastic.co/kibana/kibana   7.16.2    8c46ec23123e   13 days ago     1.3GB
elasticsearch                     7.16.1    405db9d10ee0   2 weeks ago     642MB
```
Notice the first row with its `Repository` set to `<none>`?  That is our new image that we 
created. How do I know you ask? The only way I can tell is by using the `IMAGE ID` column. 
If you look at the ID, `2784fad72915`, you will see that the last line of the `docker build .` output reads `Successfully built 2784fad72915`.  If that was the only way to know what images is what, docker wouldn't have gotten as popular as it has.  

Ok, let's build an image with a Repository that makes it easier for us to find.  When I run:
`docker build . --tag hello` I will get the following output:

```
Sending build context to Docker daemon  9.934MB
Step 1/3 : FROM scratch
 ---> 
Step 2/3 : COPY hello .
 ---> Using cache
 ---> fd7957db532d
Step 3/3 : CMD ["/hello"]
 ---> Using cache
 ---> 2784fad72915
Successfully built 2784fad72915
Successfully tagged hello:latest
```
You might notice that the output of this build is slightly different than it was when we first ran it.  That is because docker used the cache from the previous build to generate the `hello:latest` image. Here's the output of `docker images` now:

```
REPOSITORY                        TAG       IMAGE ID       CREATED          SIZE
hello                             latest    2784fad72915   13 minutes ago   1.77MB
docker.elastic.co/kibana/kibana   7.16.2    8c46ec23123e   13 days ago      1.3GB
elasticsearch                     7.16.1    405db9d10ee0   2 weeks ago      642MB
```
Notice that the first row from the previous build has been replaced with an image that has the Repository name we gave it and has a tag value of `latest`. Since I didn't provide an tag for this build, docker created it with the default tag name of `latest`  That makes it easier for us to find an image we want to use when creating a container.

There's something else I want to point out about the output of our second build command, the time since the image was created.  I ran the `docker images` command right after I ran `docker build . --tag hello` but image listing says the image was created 13 minutes before, whats going on?  Since we didn't change the Dockerfile and the `hello` binary didn't change docker used the untagged, unnamed image and renamed it to `hello` with the tag `latest`. 

How can we ad our own tag to an image, you ask?  We will add a tag using nearly the same
command as before but this time we will pass `hello:v1.0.0` to the `--tag` option.  Running 
`docker build . --tag hello:v1.0.0` gives us the following output:

```
Sending build context to Docker daemon  9.936MB
Step 1/3 : FROM scratch
 ---> 
Step 2/3 : COPY hello .
 ---> Using cache
 ---> fd7957db532d
Step 3/3 : CMD ["/hello"]
 ---> Using cache
 ---> 2784fad72915
Successfully built 2784fad72915
Successfully tagged hello:v1.0.0
```

No changes to the binary or the Dockerfile so it used the cache to create our second hello image.

```
REPOSITORY                        TAG       IMAGE ID       CREATED          SIZE
hello                             latest    2784fad72915   23 minutes ago   1.77MB
hello                             v1.0.0    2784fad72915   23 minutes ago   1.77MB
docker.elastic.co/kibana/kibana   7.16.2    8c46ec23123e   13 days ago      1.3GB
elasticsearch                     7.16.1    405db9d10ee0   2 weeks ago      642MB
```
 
 Both images have the same created at time but they have different tags. This allows us to pick a particular version to use when we create a container.

 Now that we have a couple of images that we can recognize by a Repository and Tag values it's
 time to create and run a container!

<br/>

## Step 3 - Creating a container from our image

Run a container with `docker run hello` and show the output of `docker ps -a` and the `docker ps` output

Run the v1.0.0 contianer with the `--rm` option 

create a v1.0.1 version that says `Hello, friend` and create a new latest one with this version.
Run both newly tagged versions and then run v1.0.0

<br/>

## Creating a greetings API image

*walk through the new parts of the Dockerfile.greetings.js*

*create a greetings-api container running without the port mapping*

*run with the port mapping*

*extra credit if I can pass env variables from the command line so I can start a french and english service*

<br/>

## Summary
<br/>

## Links and Resuources

* [Docker's Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
  * [`FROM`](https://docs.docker.com/engine/reference/builder/#from) instruction
  * [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) instruction
  * [`CMD`](https://doorknocker/engine/reference/builder/#CMD) instruction
* [Docker build Referece]()
* [Docker run Reference]()