FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# RUN npm install --only=dev 

# RUN CI=true npm test

# ENV REACT_APP_BACKEND_URL="http://localhost:8080/api"

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine
# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
