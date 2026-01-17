#  Real-Time Messenger Application

A modern, full-stack real-time messaging application built with Next.js 15, featuring instant messaging, user authentication, file sharing, and a beautiful responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC)

## 🚀 Live Demo

Check out the live application: **[https://real-time-messenger-application.vercel.app](https://real-time-messenger-application.vercel.app)**

##  Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery using Pusher WebSockets
- **User Authentication**: Secure authentication with NextAuth.js
- **Social Login**: Login with GitHub and Google OAuth
- **Group Chats**: Create and manage group conversations
- **File Sharing**: Upload and share images via Cloudinary
- **Message Status**: Read receipts and message delivery status
- **User Presence**: See who's online/offline in real-time
- **Profile Management**: Update user profiles and settings
- **Password Reset**: Email-based password recovery with OTP verification

### User Experience
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Dark/Light Theme**: Adaptive theme support
- **Real-time Notifications**: Toast notifications for new messages
- **Typing Indicators**: See when someone is typing
- **Message Search**: Find messages across conversations
- **Emoji Support**: Express yourself with emojis
- **Loading States**: Smooth loading animations and states

### Security & Performance
- **Email Verification**: OTP-based email verification
- **Rate Limiting**: API protection against abuse
- **Data Validation**: Input validation and sanitization
- **Image Optimization**: Automatic image compression and optimization
- **Caching**: Optimized data fetching and caching strategies

##  Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form handling and validation
- **React Icons**: Beautiful icon library
- **Headless UI**: Accessible UI components

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe database ORM
- **NextAuth.js**: Authentication solution
- **Pusher**: Real-time WebSocket communication
- **bcrypt**: Password hashing
- **Resend**: Email delivery service
- **Nodemailer**: Email sending capabilities

### Database & Storage
- **PostgreSQL/MySQL**: Relational database (configurable)
- **Cloudinary**: Image upload and optimization
- **Prisma Client**: Generated database client

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS post-processing
- **Autoprefixer**: CSS vendor prefixing

##  Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Database** (PostgreSQL, MySQL, or SQLite)
- **Git** for version control

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/messenger-app.git
cd messenger-app/messenger
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration
Copy the environment variables template and configure:
```bash
cp .env.sample .env
```

Fill in your `.env` file with the following variables:

#### Database
```env
DATABASE_URL="your-database-connection-string"
```

#### NextAuth Configuration
```env
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

#### OAuth Providers
```env
# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Google OAuth  
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Cloudinary (Image Upload)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
```

#### Pusher (Real-time Communication)
```env
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
```

#### Email Service (Resend)
```env
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM="your-verified-email@domain.com"
```

### 4. Database Setup
Generate Prisma client and run migrations:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Seed the database
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
# or  
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running.

##  Project Structure

```
messenger/
├── app/                    # Next.js 13+ App Directory
│   ├── (site)/            # Route groups
│   │   └── components/    # Landing page components
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── conversations/ # Message endpoints
│   │   ├── messages/     # Message management
│   │   └── settings/     # User settings
│   ├── components/        # Reusable UI components
│   │   ├── inputs/       # Form input components
│   │   └── sidebar/      # Sidebar components
│   ├── context/           # React context providers
│   ├── conversations/     # Chat interface
│   │   └── [conversationId]/ # Dynamic conversation routes
│   ├── hooks/            # Custom React hooks
│   ├── libs/             # Utility libraries
│   ├── types/            # TypeScript type definitions
│   └── users/            # User management pages
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── pages/api/pusher/     # Pusher authentication
└── configuration files
```

##  Key Features Explained

### Real-time Messaging
- Messages are delivered instantly using Pusher WebSockets
- Support for text messages, emojis, and image attachments
- Message status indicators (sent, delivered, read)

### User Authentication
- Multiple authentication methods (email/password, OAuth)
- Secure session management with NextAuth.js
- Email verification with OTP system
- Password reset functionality

### Conversations
- One-on-one private conversations
- Group chat functionality
- Conversation search and filtering
- Message history and pagination

### File Sharing
- Image upload and sharing via Cloudinary
- Automatic image optimization and compression
- Support for multiple image formats
- Image preview and modal display

##  Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production  
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint

# Database
npx prisma studio   # Open Prisma database browser
npx prisma generate # Regenerate Prisma client
npx prisma db push  # Push schema to database
```

##  API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `POST /api/conversations/[id]/seen` - Mark as read

### Messages
- `GET /api/messages` - Get conversation messages
- `POST /api/messages` - Send new message

### Settings
- `POST /api/settings` - Update user profile

## Environment Variables Explanation

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string |  
| `NEXTAUTH_SECRET` | NextAuth.js secret key | 
| `GITHUB_ID` | GitHub OAuth client ID | 
| `GITHUB_SECRET` | GitHub OAuth client secret | 
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | 
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | 
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | 
| `NEXT_PUBLIC_PUSHER_APP_KEY` | Pusher app key (public) | 
| `PUSHER_APP_ID` | Pusher app ID |
| `PUSHER_SECRET` | Pusher secret key | 
| `RESEND_API_KEY` | Resend email API key | 
| `RESEND_FROM` | Verified sender email | 

##  Troubleshooting

### Common Issues

#### Database Connection
```bash
# If database connection fails
npx prisma db push --force-reset
npx prisma generate
```

#### Missing Dependencies
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Pusher Connection Issues
- Verify your Pusher credentials in `.env`
- Check Pusher dashboard for connection logs
- Ensure CORS settings allow your domain

#### OAuth Setup
- Verify callback URLs in OAuth provider settings
- Check client ID and secret configuration
- Ensure proper redirect URIs are set

##  Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Other Platforms
- **Railway**: Easy database and app deployment
- **Heroku**: Traditional platform with add-ons
- **DigitalOcean**: App platform with database
- **AWS**: Full control with EC2 and RDS

### Database Hosting
- **PlanetScale**: MySQL-compatible serverless database
- **Supabase**: PostgreSQL with real-time features
- **Railway**: Integrated database hosting
- **MongoDB Atlas**: Document database option

##  Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Write clean, documented code
- Add tests for new features
- Follow the existing code style
- Update documentation as needed

##  License

This project is licensed under the MIT License 

##  Acknowledgments

- **Next.js Team** for the amazing framework
- **Prisma Team** for the excellent ORM
- **Pusher** for real-time communication
- **Vercel** for hosting and deployment
- **Tailwind CSS** for beautiful styling

##  Support

If you have any questions or need help:

- Email: swapnilshelke819@gmail.com
- Issues: [GitHub Issues](https://github.com/Swapnil454/messenger-app/issues)
- Discussions: [GitHub Discussions](https://github.com/Swapnil454/messenger-app/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Swapnil454">Swapnil Shelke</a></p>
  <p>⭐ Star this repository if it helped you!</p>
</div>
