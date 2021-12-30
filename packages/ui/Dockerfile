FROM quay.io/eraci/nginx:1.21.1-alpine

WORKDIR /usr/share/nginx/html

# https://askubuntu.com/a/20416 - change port from 80 to 8080
RUN sed -i 's/80/8080/' /etc/nginx/conf.d/default.conf

COPY packages/csm-ui/ui-dist .

ARG IMAGE_VERSION
RUN echo "${IMAGE_VERSION}" > image_version