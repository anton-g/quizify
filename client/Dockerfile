# stage: 1
FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm rebuild node-sass
RUN npm run build
RUN npm install -g serve

EXPOSE 5000

ENTRYPOINT [ "serve" ]
CMD ["-s", "dist"]
