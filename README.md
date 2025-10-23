# 🚀 UniTrade Pro - Fintech Simulator

A comprehensive full-stack fintech simulator application built with React, Node.js, and MongoDB. Practice trading with simulated market data across multiple asset classes including stocks, cryptocurrencies, and fiat currencies.

## 🎯 Features

- **🔐 User Authentication** - Secure JWT-based login/registration
- **📊 Real-Time Trading** - BUY/SELL/CONVERT operations with live market data
- **💼 Portfolio Management** - Interactive pie charts and real-time portfolio tracking
- **📈 Market Simulation** - Realistic price movements and market conditions
- **📋 Transaction History** - Complete trading history with filtering
- **🎨 Modern UI** - Dark mode design with responsive layout
- **⚡ Real-Time Updates** - Automatic portfolio and market data synchronization

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Heroicons** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/unitrade-pro.git
   cd unitrade-pro
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/unitrade_pro
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

5. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Windows
   "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
   
   # macOS/Linux
   mongod --dbpath ./data/db
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend server** (in a new terminal)
   ```bash
   npm run dev
   ```

8. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
unitrade-pro/
├── src/                          # Frontend React App
│   ├── components/               # Reusable components
│   │   ├── Layout/              # Layout components
│   │   └── Market/              # Market components
│   ├── pages/                   # Page components
│   ├── store/                   # Zustand state management
│   ├── lib/                     # Utility libraries
│   └── ...
├── server/                      # Backend Node.js App
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Express middleware
│   ├── utils/                   # Utility functions
│   └── ...
├── .github/workflows/           # GitHub Actions
├── docs/                        # Documentation
└── ...
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Market Data
- `GET /api/market/overview` - Get market data
- `GET /api/market/rates` - Get exchange rates

### Trading
- `POST /api/transactions/execute` - Execute trade
- `GET /api/transactions/history` - Get transaction history

### Portfolio
- `GET /api/user/wallet` - Get portfolio data

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=your_backend_url`
3. Deploy automatically

### Backend (Railway/Render)
1. Deploy the `server` folder
2. Set environment variables:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_uri`
   - `JWT_SECRET=your_jwt_secret`

## 📚 Documentation

- [Complete Technical Documentation](PROJECT_DOCUMENTATION.md)
- [Project Pitch Presentation](PROJECT_PITCH_PRESENTATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Quick Deployment](QUICK_DEPLOYMENT.md)

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- Modern JavaScript ecosystem
- Database management with MongoDB
- Authentication and security
- API design and development
- State management patterns
- Responsive UI/UX design
- Real-time data synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the database
- All open-source contributors

---

**Built with ❤️ for learning and demonstration purposes**

## 📞 Contact

If you have any questions or suggestions, feel free to open an issue or contact me!

---

⭐ **Star this repository if you found it helpful!**