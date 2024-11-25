# WindSurf Dashboard

A modern, responsive dashboard application built with Next.js 13, featuring advanced analytics, authentication, and user management.

## Features

- 🔐 **Authentication System**
  - Cookie-based authentication
  - Protected routes with middleware
  - Persistent user sessions
  - Demo credentials available

- 📊 **Analytics Dashboard**
  - Interactive charts and visualizations
  - Real-time statistics cards
  - Monthly overview trends
  - Device and geographic distribution
  - Session analytics

- 🎨 **Modern UI Components**
  - Built with Radix UI and Tailwind CSS
  - Fully responsive design
  - Dark mode support
  - Custom reusable components

- 👥 **User Management**
  - User overview and statistics
  - Role-based access control (coming soon)
  - User profile management

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Cookie-based with middleware
- **State Management**: React Context

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wind-surf-nextjs-app.git
cd wind-surf-nextjs-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=your_api_url_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- Email: demo@example.com
- Password: password

## Project Structure

```
wind-surf-nextjs-app/
├── app/                    # Next.js 13 app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # UI components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── middleware.ts         # Authentication middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
