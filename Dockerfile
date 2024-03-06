FROM node:18-alpine
WORKDIR /Weather-API-s-using-ReactJS/

COPY public/ /Weather-API-s-using-ReactJS/public
COPY src/ /Weather-API-s-using-ReactJS/src
COPY package.json /Weather-API-s-using-ReactJS/

RUN npm install

CMD ["npm", "start"]
