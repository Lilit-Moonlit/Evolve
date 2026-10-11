# Run a City Relay

This directory contains a reference setup for running a city-scoped Nostr relay for the EVOLVE project. A city relay is a volunteer-run server that handles local chat and group messaging for users in a specific geographic area (e.g., "Ukraine::Kyiv").

## What is a City Relay?

A city relay is the unit of volunteering in EVOLVE's decentralized architecture. Instead of a single global server handling millions of users, each city has its own relay run by a local volunteer (similar to running a Mastodon instance). This achieves:

- **Human-scale commitment**: One relay serves hundreds–thousands of connections, not millions.
- **Geographic sharding**: Users connect to their local city relay for local chat.
- **Free at scale**: The protocol scales because infrastructure is pushed to the edges.

See `docs/DECENTRALIZED-SCALING.md` in the project root for the full architecture.

## Quick Start

1. **Clone the project** (if you haven't already):

   ```bash
   git clone <repository-url>
   cd CFC/packages/p2p/relay
   ```

2. **Start the relay**:

   ```bash
   docker compose up -d
   ```

3. **Verify it's running**:

   ```bash
   curl http://localhost:7000
   ```

   You should see a JSON response with relay info.

4. **Access the relay from clients**:
   - WebSocket URL: `ws://localhost:7000` (local testing)
   - Public URL: `wss://your-domain.com` (production, requires reverse proxy + TLS)

## Configuration

### Customize the Relay Name

Edit `config.toml` to set your relay's metadata:

```toml
[info]
name = "EVOLVE Kyiv Relay"
description = "City relay for Kyiv, Ukraine"
contact = "admin@example.com"
pubkey = "your-admin-pubkey"
```

### Set the City Tag Convention

EVOLVE uses the `t` tag to filter messages by city. The canonical format is:

```
Country::City
```

Examples:

- `Ukraine::Kyiv`
- `USA::New York`
- `Germany::Berlin`

When publishing events to your city relay, include the tag:

```javascript
const tags = [["t", "Ukraine::Kyiv"]];
await nostrClient.publishEvent(1, "Hello Kyiv!", tags);
```

Relays filter by this tag to route local chat correctly. See `../src/city-tagging.ts` for helper functions.

## Production Deployment

### Expose Publicly

For production, you need:

1. **A domain name** (e.g., `kyiv.evolve.example.com`)
2. **Reverse proxy** (nginx, Caddy, or Traefik) with TLS
3. **Firewall rules** to allow WebSocket traffic on port 7000

Example nginx config:

```nginx
server {
    listen 443 ssl http2;
    server_name kyiv.evolve.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### Resource Requirements

A city relay typically needs:

- **CPU**: 1-2 cores
- **RAM**: 1-2 GB
- **Disk**: 10-20 GB (for event storage)
- **Bandwidth**: Depends on user count; 100-500 concurrent users is manageable on a $5-10/mo VPS

### Persistence

The relay stores data in the `./data` directory (mounted as a volume in `docker-compose.yml`). Ensure this directory is backed up regularly.

## Maintenance

### View Logs

```bash
docker compose logs -f nostr-relay
```

### Stop the Relay

```bash
docker compose down
```

### Update the Relay Image

```bash
docker compose pull
docker compose up -d
```

### Clear Old Events

Periodically clear old events to manage disk space:

```bash
# Stop the relay first
docker compose down

# Clear the database (CAUTION: deletes all events)
rm -rf ./data/*

# Restart
docker compose up -d
```

## Troubleshooting

### Relay Not Starting

Check logs:

```bash
docker compose logs nostr-relay
```

Common issues:

- Port 7000 already in use → Change the port in `docker-compose.yml`
- Permission denied on `./data` → Ensure the directory is writable

### Clients Cannot Connect

- Verify the relay is accessible: `curl http://localhost:7000`
- Check firewall rules allow traffic on port 7000
- For public deployment, ensure DNS resolves and TLS is configured

### High Memory Usage

Reduce event retention by configuring limits in `config.toml` (if supported by the relay implementation) or periodically clear old events.

## NIP-29 Group Support

This relay is configured with `nip29 = true` to support NIP-29 relay-based groups. This allows:

- Public groups (kind 34550 metadata events)
- Closed groups with admin approval (kind 34552 membership events, kind 34553 join requests)
- Group messages (kind 34554)

See `../src/nostr-client.ts` for helper methods like `createGroup`, `requestJoinGroup`, `approveJoinGroup`, `leaveGroup`, and `publishGroupMessage`.

## Join the Network

Once your relay is running, publish it as a kind 10002 relay list event so EVOLVE clients can discover it:

```javascript
const relayUrl = "wss://kyiv.evolve.example.com";
await nostrClient.publishEvent(10002, "", [["r", relayUrl]]);
```

## Support

For issues or questions:

- Check the main project documentation in `docs/`
- Review `docs/DECENTRALIZED-SCALING.md` for architecture details
- Open an issue in the project repository
