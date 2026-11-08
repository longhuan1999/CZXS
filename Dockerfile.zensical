# ---- 构建阶段：用官方 zensical 镜像把 markdown 静态化 ----
FROM zensical/zensical:latest AS build
USER root
WORKDIR /docs
COPY . .
RUN zensical build

# ---- 运行阶段：用 nginx 托管构建产物 ----
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
