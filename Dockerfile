FROM node:15-alpine

RUN mkdir -p /opt/app
RUN apk add --no-cache libc6-compat curl

WORKDIR /opt/app

# Install dependencies
COPY package.json /opt/app
COPY yarn.lock /opt/app
COPY prisma/schema.prisma /opt/app/prisma/schema.prisma

RUN yarn install

COPY . /opt/app

# Set config variables
ENV NODE_ENV production
ENV PORT 3000

# rbx doesn't play nicely with TypeScript 🙃
ENV NODE_OPTIONS --max-old-space-size=4096

# Arguments for frontend build - only those prefixed with NEXT_ are necessary, others can be injected during runtime
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_DISCORD_INVITE

ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID "$NEXT_PUBLIC_GOOGLE_CLIENT_ID"
ENV NEXT_PUBLIC_DISCORD_INVITE "$NEXT_PUBLIC_DISCORD_INVITE"

# Cloudinary is an exception to the above since it's in next.config.js
ARG CLOUDINARY_NAME
ENV CLOUDINARY_NAME "$CLOUDINARY_NAME"

# Build app
RUN yarn build

RUN npx next telemetry disable

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

CMD [ "./prod-start.sh" ]
