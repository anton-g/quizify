FROM mhart/alpine-node:11 AS builder

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD ["run", "start"]