FROM node:20-alpine

WORKDIR /app

# Build arguments
ARG MONGO_URI
ARG PORT=8080
ARG MAIL_ID
ARG MAIL_PASSWORD
ARG JWT_SECRET
ARG JUDGE0_API_URL

# Environment variables
ENV MONGO_URI=${MONGO_URI}
ENV PORT=${PORT}
ENV MAIL_ID=${MAIL_ID}
ENV MAIL_PASSWORD=${MAIL_PASSWORD}
ENV JWT_SECRET=${JWT_SECRET}
ENV JUDGE0_API_URL=${JUDGE0_API_URL}

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose application port
EXPOSE ${PORT}

# Start server
CMD ["npm", "start"]