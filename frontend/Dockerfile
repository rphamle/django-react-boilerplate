FROM node:18.13.0-alpine

RUN apk --update --no-cache add python3 make g++

WORKDIR /app/
ADD package.json /app/package.json
RUN npm install
ADD . /app/

CMD ["npm", "run", "start"]