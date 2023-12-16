FROM node:17

WORKDIR /app
ENV TZ Asia/Seoul

COPY bin/ /app/bin/
COPY src/ /app/src/

COPY package.json /app/
COPY tsconfig.json /app/

RUN npm install
RUN npm install -D pm2
RUN npx pm2 install typescript

EXPOSE 3000

ENTRYPOINT ["npx","pm2-runtime","start","bin/www.ts"]