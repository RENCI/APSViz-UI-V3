# Copyright (c) 2024, The University of North Carolina at Chapel Hill All rights reserved.
#
# SPDX-License-Identifier: BSD 3-Clause
# build phase one, create the build
FROM node:20-alpine3.19 as build

# get some credit
LABEL maintainer="powen@renci.org"

# update the base image
RUN apk update
RUN apk add --upgrade apk-tools
RUN apk upgrade --available

# update the image
#apk upgrade --no-cache

# Create and set the working directory
RUN mkdir /src
WORKDIR /src

# Add `.../node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH

# copy in the project package requirements spec
COPY package*.json /src/

# install package components
RUN npm install

# get the common build arguments
ARG APP_VERSION=$(APP_VERSION)
ARG APP_UI_MAPBOX_TOKEN=$(APP_UI_MAPBOX_TOKEN)
ENV REACT_APP_VERSION=$APP_VERSION
ENV REACT_APP_MAPBOX_TOKEN=$APP_UI_MAPBOX_TOKEN

# get the namespace specific arguments and env params for AWS
ARG APP_GS_DATA_AWS_URL=$(APP_GS_DATA_AWS_URL)
ARG APP_UI_DATA_AWS_URL=$(APP_UI_DATA_AWS_URL)
ARG APP_UI_DATA_AWS_TOKEN=$(APP_UI_DATA_AWS_TOKEN)
ARG APP_UI_HURRICANE_ICON_AWS_URL=$(APP_UI_HURRICANE_ICON_AWS_URL)
ENV REACT_APP_GS_DATA_AWS_URL=$APP_GS_DATA_AWS_URL
ENV REACT_APP_UI_DATA_AWS_URL=$APP_UI_DATA_AWS_URL
ENV REACT_APP_UI_DATA_AWS_TOKEN=$APP_UI_DATA_AWS_TOKEN
ENV REACT_APP_HURRICANE_ICON_AWS_URL=$APP_UI_HURRICANE_ICON_AWS_URL

# get the namespace specific arguments and env params for prod
ARG APP_GS_DATA_PROD_URL=$(APP_GS_DATA_PROD_URL)
ARG APP_UI_DATA_PROD_URL=$(APP_UI_DATA_PROD_URL)
ARG APP_UI_DATA_PROD_TOKEN=$(APP_UI_DATA_PROD_TOKEN)
ARG APP_UI_HURRICANE_ICON_PROD_URL=$(APP_UI_HURRICANE_ICON_PROD_URL)
ENV REACT_APP_GS_DATA_URL_PROD=$APP_GS_DATA_PROD_URL
ENV REACT_APP_UI_DATA_URL_PROD=$APP_UI_DATA_PROD_URL
ENV REACT_APP_UI_DATA_TOKEN_PROD=$APP_UI_DATA_PROD_TOKEN
ENV REACT_APP_HURRICANE_ICON_URL_PROD=$APP_UI_HURRICANE_ICON_PROD_URL

# get the namespace specific arguments and env params for dev
ARG APP_GS_DATA_DEV_URL=$(APP_GS_DATA_DEV_URL)
ARG APP_UI_DATA_DEV_URL=$(APP_UI_DATA_DEV_URL)
ARG APP_UI_DATA_DEV_TOKEN=$(APP_UI_DATA_DEV_TOKEN)
ARG APP_UI_HURRICANE_ICON_URL_DEV=$(APP_UI_HURRICANE_ICON_DEV_URL)
ENV REACT_APP_GS_DATA_URL_DEV=$APP_GS_DATA_DEV_URL
ENV REACT_APP_UI_DATA_URL_DEV=$APP_UI_DATA_DEV_URL
ENV REACT_APP_UI_DATA_TOKEN_DEV=$APP_UI_DATA_DEV_TOKEN
ENV REACT_APP_HURRICANE_ICON_URL_DEV=$APP_UI_HURRICANE_ICON_DEV_URL

# start creating the env file. this first group is common all around
RUN printf "NODE_ENV=production\n" > .env
RUN printf "REACT_APP_VERSION=$APP_VERSION\n" >> .env
RUN printf "REACT_APP_MAPBOX_TOKEN=$REACT_APP_MAPBOX_TOKEN\n" >> .env

# create the env file params for AWS
RUN printf "REACT_APP_GS_DATA_URL_AWS=$APP_GS_DATA_AWS_URL\n" >> .env
RUN printf "REACT_APP_UI_DATA_URL_AWS=$APP_UI_DATA_AWS_URL\n"  >> .env
RUN printf "REACT_APP_UI_DATA_TOKEN_AWS=$APP_UI_DATA_AWS_TOKEN\n" >> .env
RUN printf "REACT_APP_HURRICANE_ICON_URL_AWS=$REACT_APP_HURRICANE_ICON_AWS_URL\n" >> .env

# create the env file params for PROD
RUN printf "REACT_APP_GS_DATA_URL_PROD=$APP_GS_DATA_PROD_URL\n" >> .env
RUN printf "REACT_APP_UI_DATA_URL_PROD=$APP_UI_DATA_PROD_URL\n"  >> .env
RUN printf "REACT_APP_UI_DATA_TOKEN_PROD=$APP_UI_DATA_PROD_TOKEN\n" >> .env
RUN printf "REACT_APP_HURRICANE_ICON_URL_PROD=$REACT_APP_HURRICANE_ICON_PROD_URL\n" >> .env

# create the env file params DEV AWS
RUN printf "REACT_APP_GS_DATA_URL_DEV=$APP_GS_DATA_DEV_URL\n" >> .env
RUN printf "REACT_APP_UI_DATA_URL_DEV=$APP_UI_DATA_DEV_URL\n"  >> .env
RUN printf "REACT_APP_UI_DATA_TOKEN_DEV=$APP_UI_DATA_DEV_TOKEN\n" >> .env
RUN printf "REACT_APP_HURRICANE_ICON_URL_DEV=$REACT_APP_HURRICANE_ICON_DEV_URL\n" >> .env

# Copy in source files
COPY . /src

# Build the app
RUN npm run build

####################
## startup the nginx server
####################
FROM ghcr.io/nginxinc/nginx-unprivileged:1.27-alpine3.19

# get the source files for the site in the right place
COPY --from=build /src/dist /usr/share/nginx/html

# disable nginx user because now this is running as non-root
RUN sed -i 's/user nginx;/#user nginx;/g' /etc/nginx/nginx.conf

# copy in the configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# start the web server
CMD ["nginx", "-g", "daemon off;"]
