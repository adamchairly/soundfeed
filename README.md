
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

## Activity

![Alt](https://repobeats.axiom.co/api/embed/901ca3728b710d0548312c2391b642d46734a4c4.svg "Repobeats analytics image")

## About

Soundfeed tracks your favorite Spotify artists and displays new releases in a clean, chronological feed. 

No login, account or any personal detail required. 

## Features

- **Subscribe to Spotify artists** 
   - Subscribe to artists by pasting searching or pasting their Spotify URL
   - Unsubcribe from artists
- **Sync existing account** 
   - Recover your feed using a recovery code
- **Manage your feed** 
   - Trigger manual sync
   - Dismiss already seen feed entries
   - Order and navigate in your feed
- **Email notifications**
   - Receive optional weekly digest emails
   
## Project Structure

```
Soundfeed/
├── frontend/                    
│   └── src/
│       ├── api/                 
│       ├── assets/              # Images and static assets
│       ├── components/          # React components
│       │   └── layout/          # Layout components
│       ├── contexts/            # React Context providers
│       ├── hooks/               # Custom React hooks
│       ├── pages/               # Page components
│       ├── styles/              # Shared Tailwind constants
│       ├── types/               # TypeScript type definitions
|       └── utils/               # Utility functions
│
└── backend/                     
    ├── Soundfeed.Api/           # API layer
    │   ├── Controllers/         # REST API endpoints
    │   ├── Middlewares/         # Request/response middleware
    │   └── Extensions/          # Service configuration
    │
    ├── Soundfeed.Bll/          # Business logic layer
    │   ├── Features/           # Domain separated features
    │   │   ├── Artist/         
    │   │   ├── ....
    │   ├── Services/           # Business services
    │   ├── Jobs/               # Background jobs
    │   └── Models/             # DTOs and response models
    │
    └── Soundfeed.Dal/          # Data access layer
        ├── Entities/           # Entities
        ├── Contexts/           # DbContext and abstractions
        └── Migrations/         # Database migrations
```

## Getting Started

Contributions are welcome, please open a pull request based on the latest main branch.

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
