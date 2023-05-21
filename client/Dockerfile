FROM node:18 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

FROM nginx:1.19
COPY --from=build-stage app/dist/ /usr/share/nginx/html  
COPY --from=build-stage app/nginx/default.conf /etc/nginx/conf.d/default.conf  
