# Personal always-on host for the Evolve web app (Render free web service).
# Build runs on Render's 8 GB pipeline. Runtime is the free 512 MB instance,
# so the Vite heap bump is scoped to the build RUN only.
FROM node:20-bookworm

WORKDIR /app

# Prisma engines need OpenSSL; ca-certificates for outbound HTTPS (RPC, etc.).
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY . .

# Include devDependencies (tsx, vite, prisma CLI) even if the platform
# injects NODE_ENV=production into the build environment.
RUN npm ci --include=dev

# Source maps off: they push the Vite build past a 4 GB heap.
# VITE_* is inlined by Vite. Default full so Communications/local chat are
# visible on this personal instance; override VITE_PRODUCT_MODE=safety to
# ship the public facade instead.
RUN cd apps/web \
  && VITE_SOURCEMAP=false \
     VITE_PRODUCT_MODE="${VITE_PRODUCT_MODE:-full}" \
     NODE_OPTIONS=--max-old-space-size=6144 \
     npm run build \
  && test -f dist/index.html

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000

RUN sed -i 's/\r$//' /app/docker/start.sh && chmod +x /app/docker/start.sh
CMD ["/app/docker/start.sh"]
