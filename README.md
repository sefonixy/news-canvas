# NewsCanvas

NewsCanvas is a modern news aggregator that allows users to search, filter, and personalize their news feed. It fetches articles from multiple trusted sources including NewsAPI, The Guardian, and The New York Times.

## Features

- **Article Search and Filtering**: Search for articles by keyword and filter results by date, category, and source.
- **Personalized News Feed**: Customize your news feed by selecting preferred sources, categories, and authors.
- **Mobile-Responsive Design**: Optimized for viewing on all device sizes.
- **Multiple News Sources**: Aggregates news from NewsAPI, The Guardian, and The New York Times.

## Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: Tailwind CSS with Shadcn UI components
- **State Management**: React Context API
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (for containerized deployment)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_NEWSAPI_KEY=your_newsapi_key
NEXT_PUBLIC_GUARDIAN_API_KEY=your_guardian_api_key
NEXT_PUBLIC_NYTIMES_API_KEY=your_nytimes_api_key
```

You'll need to obtain API keys from:
- [NewsAPI](https://newsapi.org/)
- [The Guardian API](https://open-platform.theguardian.com/)
- [The New York Times API](https://developer.nytimes.com/)

### Running Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running with Docker

#### Option 1: Using the Dockerfile directly

1. Build the Docker image:
   ```
   docker build -t news-canvas .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 --env-file .env.local news-canvas
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Using Docker Compose (Recommended)

1. Make sure you have Docker Compose installed.

2. Run the application:
   ```
   docker-compose up -d
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. To stop the application:
   ```
   docker-compose down
   ```

#### Docker Deployment Notes

- The application runs on port 3000 by default.
- Environment variables are loaded from your `.env.local` file.
- For production deployment, consider using environment-specific configuration.
- The container is configured to restart automatically unless explicitly stopped.

## Project Structure

- `/app`: Next.js app router pages
- `/components`: React components
  - `/layout`: Layout components (Header, Footer)
  - `/news`: News-related components (ArticleCard, ArticleList, Filters, etc.)
  - `/ui`: UI components from Shadcn UI
- `/lib`: Utility functions and services
  - `/context`: React context providers
  - `/hooks`: Custom React hooks
  - `/services`: API service functions
  - `/types`: TypeScript type definitions

## Software Development Best Practices

This project follows key software development principles:

### DRY (Don't Repeat Yourself)
- Common utility functions are centralized in `/lib/utils.ts`
- Reusable components like `ArticleCard` are parameterized and reused
- Shared API handling logic is consolidated in service modules

### KISS (Keep It Simple, Stupid)
- Clear, straightforward component organization
- Intuitive project structure
- Minimal dependencies
- Self-explanatory function names

### SOLID Principles
- **Single Responsibility**: Each component and function has a specific purpose
- **Open-Closed**: UI components can be extended without modification
- **Liskov Substitution**: Type interfaces ensure consistent behavior
- **Interface Segregation**: Small, focused component props and function parameters
- **Dependency Inversion**: Higher-level components depend on abstractions

## License

This project is licensed under the MIT License.
