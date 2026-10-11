# ---- Stage 1: build the React app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# react-nice-dates declares a peer dep on React 16 while the app uses React 18,
# so strict peer resolution fails. --legacy-peer-deps skips that check.
RUN npm ci --legacy-peer-deps

COPY . .

# CRA bakes REACT_APP_* values into the JS bundle at BUILD time,
# so they must be passed as build args (not runtime env vars).
ARG REACT_APP_API
ARG REACT_APP_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_API=$REACT_APP_API \
    REACT_APP_URL=$REACT_APP_URL \
    REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

RUN npm run build

# ---- Stage 2: serve static files with nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
