# VLearning - Client Application

A modern online learning platform built with React and Vite. This client application provides users with a rich learning experience, offering course browsing, enrollment, and interactive learning features.

## Features

### User Features

- **Authentication and Authorization**

  - User registration and login
  - Role-based access (student, teacher, admin)
  - Password recovery functionality

- **Course Browsing**

  - Browse courses by category
  - Search functionality
  - Detailed course information
  - Course previews and reviews

- **Learning Experience**

  - Interactive course content viewer
  - Progress tracking
  - Certificate generation on completion
  - Bookmarking and notes

- **Shopping Features**
  - Shopping cart
  - Wishlist functionality
  - Secure checkout
  - Payment integration

### Student Dashboard

- View enrolled courses
- Track learning progress
- Access certificates
- Manage account settings
- View purchase history

### Teacher Dashboard

- Course management
- Student progress monitoring
- Statistics and analytics
- Wallet and payment history

## Tech Stack

- **Framework**: React with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: Context API
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Form Validation**: Yup
- **HTTP Client**: Axios
- **Chart Visualization**: Chart.js

## Project Structure

```
src/
├── assets/           # Images, fonts, and other static files
├── components/       # Reusable UI components
│   ├── common/       # Layout, header, footer components
│   ├── CourseDetails/# Course detail related components
│   ├── student/      # Student-specific components
│   ├── teacher/      # Teacher-specific components
│   └── ui/           # Core UI components (buttons, cards, etc.)
├── contexts/         # React context providers
├── hooks/            # Custom hooks
├── lib/              # Utility functions
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   ├── guest/        # Public pages
│   ├── payment/      # Payment related pages
│   ├── student/      # Student dashboard pages
│   ├── survay/       # Survey pages
│   └── teacher/      # Teacher dashboard pages
├── routes/           # Router configuration
├── services/         # API service functions
└── utils/            # Helper functions
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd FE/client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   VITE_API_URL=http://localhost:8080/api
   VITE_APP_NAME=VLearning
   VITE_COURSE_IMAGE_URL=http://localhost:8080/api/files/course
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## API Integration

The application connects to a Spring Boot backend API. API calls are handled through service functions located in the `services/` directory, which use Axios for HTTP requests.

## Features Overview

### Course Detail Page

The course detail page provides comprehensive information about a course, including:

- Course description and objectives
- Instructor information
- Course content and curriculum
- Student reviews
- Pricing options

### Learning Dashboard

Students can access their learning materials through an intuitive dashboard that includes:

- Progress tracking
- Course navigation
- Video player
- Downloadable resources
- Notes taking capability

### Payment System

The platform includes a complete e-commerce flow:

- Shopping cart management
- Different payment methods
- Order history
- Receipt generation

## Development Guidelines

- Use functional components with React Hooks
- Follow the established folder structure
- Implement responsive design for all components
- Handle errors appropriately using try/catch blocks
- Document complex logic with comments

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[License information goes here]
