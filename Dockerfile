# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package management files
COPY package.json yarn.lock ./

# Install dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the NestJS application
RUN yarn build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /usr/src/app

# Set Node to production environment
ENV NODE_ENV=production

# Copy only package files to install production dependencies
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy the built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Use the non-root user provided by the node image
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
