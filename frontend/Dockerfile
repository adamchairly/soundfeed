FROM node:20-alpine AS deps
WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm ci

# build stage
FROM deps AS build
COPY . .

ARG VITE_CONTACT_EMAIL
ENV VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL
RUN npm run build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]