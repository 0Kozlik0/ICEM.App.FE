# Intelligent Assistant Application Frontend

A modern React-based web application for processing and analyzing histology slide with advanced machine learning models. This application serves as the frontend interface for evaluating, creating and downloading of predictions.

## Features

- 🖼️ **File Management**
  - Upload and manage files (currently only ome.tiff)
  - Multiple file processing
  - Real-time status tracking
  - File deletion with confirmation
- 🤖 **ML Model Integration**
  - Support for multiple ML models
  - IEDL (VPP 2024) model integration
  - Real-time processing status updates
- 🔐 **Authentication System**
  - Secure token-based authentication
  - Automatic session management
  - Protected routes and API endpoints
- 📊 **Modern UI/UX**
  - Material-UI components
  - Interactive notifications (in progress)
  - Progress tracking
  - Search and filter capabilities

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Hooks
- **Routing**: React Router
- **API Communication**: Fetch API
- **File Handling**: JSZip
- **Development Tools**: React Scripts, ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

### Development

Start the development server:
```bash
npm start
```

### Building for Production

Build the application:
```bash
npm run build
```

### Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up --build
```

### Deployment to live VGG server

1. Push updated code to github
2. Execute Github action to create build
    - open Actions tab in github
    - choose "Build and push Docker image for IKEM FE"
    - click "Run workflow", set docker tag to new version number
    - run workflow, wait for build to finish

## Project Structure

```
src/
├── application/        # Application logic and services
├── components/        # Reusable UI components
├── pages/            # Page components
└── styles/           # CSS styles
```

## Support

For support, please contact the development team.

Contact:

- Email: [xkozlik@stuba.sk](mailto:xkozlik@stuba.sk)
