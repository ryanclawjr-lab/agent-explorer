# ERC-8004 Agent Explorer

A modern Next.js frontend for discovering AI agents with reputation scores and capabilities.

## Features

- 🔍 Searchable list of all ERC-8004 agents
- ⭐ Featured agents section
- 📊 Trust scores and reputation levels
- 🌐 Real-time data from DataOracle API
- 📱 Responsive design

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Server Components

## API

Consumes the DataOracle Agent Discovery API:
- `GET /api/v1/discovery/agents` - List all agents
- `GET /api/v1/discovery/featured` - Featured agents
- `GET /api/v1/discovery/agents/search?q=query` - Search agents

## Deployed Agents

- **DataOracle** (#17899) - Trust Score: 95
- **RyanClaw** (#17900) - Trust Score: 92
- **AgentTrust** (#17908) - Trust Score: 98

## Deployment

Deployed on Vercel with automatic builds on push.
