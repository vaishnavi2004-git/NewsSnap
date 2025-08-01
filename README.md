# 📰 NewsSnap

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/vaishnavi2004-git/NewsSnap?style=social)](https://github.com/vaishnavi2004-git/NewsSnap/stargazers)

A modern web application that provides AI-powered news summarization, helping users stay informed with concise news digests.

## ✨ Features

- 🔍 Search news by category, location, or keywords
- 📰 Get AI-generated summaries of news articles
- 💾 Save favorite stories for later reading
- 📱 Responsive design for all devices
- 🔒 User authentication and personalized feeds
- 🚀 Fast and efficient news aggregation

## 🛠 Tech Stack

### Frontend
- React.js
- Material-UI
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- SQLite database
- JWT Authentication
- NewsData.io API integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaishnavi2004-git/NewsSnap.git
   cd NewsSnap
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your API keys
   npm start
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Update REACT_APP_API_URL to point to your backend
   npm start
   ```

4. **Open your browser**
   Visit `http://localhost:3000` to see the application in action!

## 🌐 Deployment

### Backend (Railway)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=node&envs=PORT,NODE_ENV,JWT_SECRET,NEWS_API_KEY)

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvaishnavi2004-git%2FNewsSnap%2Ftree%2Fmain%2Fclient&env=REACT_APP_API_URL&project-name=newssnap&repo-name=NewsSnap)

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### News
- `GET /api/news` - Get news articles
  - Query params: `category`, `q` (search term), `state`, `city`

### Saved Stories
- `GET /api/saved` - Get saved stories (requires auth)
- `POST /api/saved` - Save a story (requires auth)

## 📸 Screenshots

![NewsSnap Homepage](screenshots/homepage.png)
*Homepage with featured news*

![News Categories](screenshots/categories.png)
*Browse news by category*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [NewsData.io](https://newsdata.io/) for the news API
- Material-UI for the UI components
- All contributors who have helped shape this project

---

Made with ❤️ by [Your Name]
