FROM node:15-alpine

RUN mkdir -p /opt/app
RUN apk add --no-cache libc6-compat curl

WORKDIR /opt/app

COPY package.json /opt/app
COPY yarn.lock /opt/app
COPY prisma/schema.prisma /opt/app/prisma/schema.prisma

RUN yarn install

COPY . /opt/app

ENV NODE_ENV production
ENV PORT 3000

# rbx doesn't play nicely with TypeScript 🙃
ENV NODE_OPTIONS --max-old-space-size=4096

RUN yarn build

RUN npx next telemetry disable

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

CMD [ "./prod-start.sh" ]
