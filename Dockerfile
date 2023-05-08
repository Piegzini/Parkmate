FROM node:slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/parkmate

COPY package*.json ./

RUN npm install -g ts-node

RUN npm install -g typescript

RUN npm install

ARG email
ENV EMAIL $email

ARG password
ENV PASSWORD $password
ENV URL "https://smartoffice.ringieraxelspringer.pl/#!login"
ENV NODE_ENV "PROD"

COPY . .

CMD ["node", "--experimental-specifier-resolution=node","--loader", "ts-node/esm" , "./app.ts"]
