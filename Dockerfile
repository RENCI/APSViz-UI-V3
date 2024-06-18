# Copyright (c) 2024, The University of North Carolina at Chapel Hill All rights reserved.
#
# SPDX-License-Identifier: BSD 3-Clause
# build phase one, create the build
FROM node:20-alpine3.17 as build

# get some credit
LABEL maintainer="powen@renci.org"

# Create and set the working directory
RUN mkdir /src
WORKDIR /src

# Add `.../node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH

# copy in the project package requirements spec
COPY package*.json /src/

# install package components
RUN npm install

# get the build arguments
ARG APP_VERSION=$(APP_VERSION)
ARG APP_GS_DATA_URL=$(APP_GS_DATA_URL)
ARG APP_UI_DATA_URL=$(APP_UI_DATA_URL)
ARG APP_UI_DATA_TOKEN=$(APP_UI_DATA_TOKEN)
ARG APP_UI_MAPBOX_TOKEN=$(APP_UI_MAPBOX_TOKEN)
ARG APP_UI_HURRICANE_ICON_URL=$(APP_UI_HURRICANE_ICON_URL)

# now add the values into ENV params
ENV REACT_APP_VERSION=$APP_VERSION
ENV REACT_APP_GS_DATA_URL=$APP_GS_DATA_URL
ENV REACT_APP_UI_DATA_URL=$APP_UI_DATA_URL
ENV REACT_APP_UI_DATA_TOKEN=$APP_UI_DATA_TOKEN
ENV REACT_APP_MAPBOX_TOKEN=$APP_UI_MAPBOX_TOKEN
ENV REACT_APP_HURRICANE_ICON_URL=$APP_UI_HURRICANE_ICON_URL

# create the env file
RUN printf "NODE_ENV=production\nREACT_APP_VERSION=$APP_VERSION\nREACT_APP_GS_DATA_URL=$APP_GS_DATA_URL\n" > .env
RUN printf "REACT_APP_UI_DATA_URL=$APP_UI_DATA_URL\nREACT_APP_UI_DATA_TOKEN=$APP_UI_DATA_TOKEN\n" >> .env
RUN printf "REACT_APP_MAPBOX_TOKEN=$REACT_APP_MAPBOX_TOKEN\nREACT_APP_HURRICANE_ICON_URL=$REACT_APP_HURRICANE_ICON_URL\n" >> .env

# Copy in source files
COPY . /src

# Build the app
RUN npm run build

###################
# startup the nginx server
###################
FROM nginxinc/nginx-unprivileged

# get the source files for the site in the right place
COPY --from=build /src/dist /usr/share/nginx/html

# disable nginx user because now this is running as non-root
RUN sed -i 's/user nginx;/#user nginx;/g' /etc/nginx/nginx.conf

# copy in the configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# start the web server
CMD ["nginx", "-g", "daemon off;"]
