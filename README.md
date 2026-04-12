# Mental Health Counselor - Anam AI

A conversational mental health counselor powered by [Anam AI](https://anam.ai/). This project uses an interactive AI avatar to provide a supportive chatting experience.

## Features

- **Interactive AI Avatar**: Real-time video/audio streaming using the Anam AI Client.
- **Mental Health Persona**: Contextualized character tailored for counseling and mental health support.
- **Secure Token Generation**: Backend Express server to securely retrieve session tokens without exposing API keys on the frontend.

## Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, CSS
- **Backend**: Node.js, Express.js
- **AI Integration**: Anam AI SDK (`@anam-ai/client`)

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Anam AI credentials (API Key and Persona ID).

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/Devansh3000/mental-health-counselor-anam-ai.git
cd mental-health-counselor-anam-ai
npm install
```

### 3. Running the Project
Start the local server:
```bash
npm start
```
Or use the direct node command:
```bash
node server.js
```

The application will be accessible at: `http://localhost:3000`

## Structure
- `server.js`: Express server that handles serving static files and securely fetching Anam AI session tokens.
- `public/`: Contains frontend resources.
  - `index.html`: The main web page.
  - `style.css`: Styles for the interface.
- `anam_stream.py`: An experimental Python script for streaming Anam API.

## License
MIT
