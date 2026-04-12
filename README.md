# 🧠 Mental Health Counselor — Anam AI Avatar

Welcome to the **Mental Health Counselor** project! This repository contains a conversational, empathetic mental health counselor powered by the amazing [Anam AI](https://anam.ai/) technology. This project uses an interactive AI avatar to provide a supportive and comforting chatting experience, mimicking real-time human interaction. 💬🤝

## 🛡️ Privacy First: Local Execution

> **Note on Privacy:** This application is explicitly designed to be run **locally** on your machine.
> Mental health conversations are highly sensitive by nature. By running the server and the frontend exclusively on your local computer (`localhost`), we ensure that your conversational data and private information remain completely secured on your device and are **not** transmitted to external application servers (other than the direct Anam AI API connection for generating the avatar's responses). This design choice prioritizes user privacy above all else! 🔒🏠

---

## ✨ Features

- **🗣️ Interactive AI Avatar**: Engage in real-time video and audio conversations using the seamlessly integrated Anam AI Client. It feels like talking to a real person!
- **🧘 Mental Health Persona**: The AI is programmed with a carefully contextualized character specifically tailored for counseling and mental health support (using a dedicated Persona ID).
- **🔑 Secure Token Generation**: A lightweight Express.js backend securely generates session tokens for the Anam API, ensuring your API keys are never exposed on the frontend client.
- **⚡ Super Fast Local Networking**: Designed to run optimally on localhost to minimize latency and ensure smooth video streaming.

---

## 🛠️ Tech Stack

- **Frontend Interface**: HTML5, Vanilla JavaScript, CSS3
- **Backend Server**: Node.js, Express.js
- **AI Integration**: Anam AI SDK (`@anam-ai/client`) + direct REST API communication.

---

## 🚀 Setup Instructions

Follow these super simple steps to get your very own private counselor running on your machine:

### 1. ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Anam AI credentials (API Key and Persona ID). (Currently embedded in the backend exclusively for local use).

### 2. 📥 Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/Devansh3000/mental-health-counselor-anam-ai.git
cd mental-health-counselor-anam-ai
npm install
```

### 3. ▶️ Running the Project
Spin up your local, private server:
```bash
npm start
```
Or alternatively, use the direct node command:
```bash
node server.js
```

Once you see the cool ASCII art header in your terminal, the application will be securely accessible at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Project Structure
- `server.js`: The heart of the project! Our Express server that handles serving static files and securely wrapping our Anam AI API credentials to fetch session tokens.
- `public/`: Contains all our frontend magic.
  - `index.html`: The main web portal where you interface with the avatar.
  - `style.css`: All the styling to make the interface calming and beautiful.
  - `app.js`: Client-side logic for connecting the video streams and handling the UI.
- `anam_stream.py`: An experimental Python script snippet for streaming the Anam API directly (useful for testing parameters).

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details. 

*Remember, you are never alone. This counselor is built to listen!* ❤️
