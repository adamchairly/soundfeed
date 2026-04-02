<div align="center">
  <img src="frontend/public/logo.svg" alt="Soundfeed" width="120" height="120">
  
  # Soundfeed ![version](https://img.shields.io/github/package-json/v/adamchairly/soundfeed?filename=frontend/package.json&label=&color=gray&style=flat-square)
  
  Follow artists *you* want to hear

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Backend Tests](https://github.com/adamchairly/soundfeed/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/adamchairly/soundfeed/actions/workflows/backend-tests.yml)

  [![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
  [![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)](https://redis.io/)
</div>

## About

Soundfeed tracks your favorite Spotify artists and displays new releases in a clean, chronological feed.

No login, account or any personal detail required.

> [!WARNING]
> As of February 6, 2026, Spotify [introduced heavy limiting to their API](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide), and access is now tied to a premium subscription.

## Features

- **Follow Spotify artists**
  - Follow artists by searching
  - Unsubcribe from artists
  - Reorder followed artist in the grid
- **Sync existing account**
  - Recover your feed using a recovery code
- **Manage your feed**
  - Trigger manual sync
  - Dismiss already seen feed entries

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Spotify API credentials

### Quick Start

1. Clone the repository

   ```bash
   git clone https://github.com/adamchairly/soundfeed
   cd Soundfeed
   ```

2. Create `.env` file
   - Example structure is provided in `.env.example`
   - Get Spotify Client ID and Client Secret [here](https://developer.spotify.com/documentation/web-api)

3. Start services

   ```bash
   docker-compose up -d --build
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENCE) file for details.
