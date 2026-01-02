
<div align="center">
  <img src="frontend/public/logo.svg" alt="Soundfeed" width="120" height="120">
  
  # Soundfeed
  
  Follow artists *you* want to hear
  
  A music release tracker built for music lovers, against the algorithm.
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
</div>

## About

Soundfeed tracks your favorite Spotify artists and displays new releases in a clean, chronological feed.

## Features

- **Subscribe to Spotify artists** - Add artists by pasting searching or pasting their Spotify URL
- **Sync existing account** - Recover your feed using a recovery code

## Planned Features

- Unsubscribe from artists
- Dismiss already seen feed entries
- Manual sync

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Spotify API credentials

### Quick Start

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Soundfeed
   ```

2. Create `.env` file
   ```env
   POSTGRES_DB=soundfeed
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-password
   SPOTIFY_CLIENT_ID=your-client-id
   SPOTIFY_CLIENT_SECRET=your-client-secret
   COOKIE_SECRET_KEY=your-32byte-secret-key
   ALLOWED_ORIGINS=http://localhost:3000
   VITE_API_URL=http://localhost:8080
   ```

Get Client ID and Client Secret [here](https://developer.spotify.com/documentation/web-api)

3. Start services
   ```bash
   docker-compose up -d --build
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENCE) file for details.
