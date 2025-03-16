# Mpilot - AI Model Finder

Mpilot is a modern web application that helps users find the perfect Hugging Face models for their tasks by simply describing their needs in plain text.

## Features

- **Natural Language Search**: Describe what you need in plain language, and let AI find the right models for you
- **AI-Powered Analysis**: Uses OpenAI or Azure OpenAI to understand queries and extract the relevant task categories
- **Semantic Matching**: Ranks models by similarity to your query using embeddings
- **Clean UI**: Modern, responsive design with dark mode support
- **Performance Stats**: See download counts and other metrics for each model
- **User Feedback**: Rate the quality of search results to help improve the system

## Tech Stack

- **Frontend**: Next.js, React, TypeScript with inline styles
- **AI**: OpenAI/Azure OpenAI API for query analysis and embeddings
- **API Integration**: Hugging Face Hub API for model discovery
- **Styling**: Dark/light mode, responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key or Azure OpenAI access
- Hugging Face API token

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mpilot.git
cd mpilot
```

2. Install dependencies
```bash
npm install
```

### Configuration

#### Option 1: Standard OpenAI API
Create a `.env.local` file in the root directory and add:
```
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
```

#### Option 2: Azure OpenAI API
Create a `.env.local` file in the root directory and add:
```
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_VERSION=2023-05-15
AZURE_OPENAI_CHAT_DEPLOYMENT=your-gpt-deployment-name
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=your-embedding-deployment-name
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
```

Note: For Azure OpenAI, you need to:
1. Create deployments in the Azure OpenAI Studio
2. Name your deployments and use those names in the .env file
3. Typically use "gpt-35-turbo" or "gpt-4" for chat completion deployment and "text-embedding-ada-002" for embedding deployment

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a description of what you're trying to accomplish (e.g., "I need a model to classify images of flowers")
2. Click "Search" or press Enter
3. View the recommended models, ranked by relevance
4. Click on a model card to view it on Hugging Face
5. Provide feedback on the results to help improve the system

## Future Enhancements

- Model comparison features
- Save favorite models
- Filter by model size, license, or other parameters
- Advanced search options
- User accounts and personalized recommendations

## License

MIT

# mpliot
