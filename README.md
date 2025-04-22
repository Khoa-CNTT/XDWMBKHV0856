# VLearning - Online Learning Platform

![VLearning Logo](./FE/client/src/assets/images/logo.png)

## Project Overview

VLearning is a comprehensive e-learning platform designed to connect students with quality educational content created by expert instructors. The platform facilitates course creation, discovery, enrollment, and learning in a user-friendly environment.

## Key Features

### For Students

- Browse and search courses by categories, skills, and topics
- Course previews and detailed information pages
- Video-based learning with progress tracking
- Course reviews and ratings
- Wishlist functionality for saving courses
- Secure payment processing
- Learning dashboard to track enrolled courses
- Personalized course recommendations

### For Instructors

- Course creation and management tools
- Content organization with chapters and lectures
- Student progress monitoring
- Revenue tracking and wallet management
- Course analytics and student engagement metrics
- Instructor profile customization

### For Administrators

- User management
- Course approval workflow
- Content moderation
- Platform analytics
- System configuration

## Tech Stack

### Frontend

- React with hooks for component logic
- Context API for state management
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Vite as build tool

### Backend

- Spring Boot Java application
- JPA/Hibernate for database operations
- RESTful API architecture
- Authentication and authorization
- File storage for course materials

## Project Structure

```
/
├── BE/                 # Backend Spring Boot application
│   └── KLTN_final/     # Java project directory
│
└── FE/                 # Frontend applications
    ├── admin/          # Admin panel React application
    └── client/         # Main client React application
```

## Installation Requirements

### Backend Setup

- Add `application.properties` file to the `resources` folder
- Create a `storage` folder at the same level as `java` and `resources` with the following subfolders:
  - `avatar`
  - `background`
  - `course`
  - `lecture`

### Frontend Setup

- Run `npm install` in both `FE/admin` and `FE/client` directories
- Configure environment variables as needed

## Team Members

### Project Leader & Backend Developer

- **Nguyen Huu Thang**
  - Role: Project Leader, Backend Developer
  - Responsibilities: System architecture, database design, API development

### Frontend Developers

- **Nguyen Duong Truong Vu**
  - Responsibilities: Frontend architecture, component development
- **Tran Huu Khiem**

  - Responsibilities: UI/UX design, responsive layouts, user interactions

- **Nguyen Ba The Vien**

  - Responsibilities: State management, API integration, frontend features

- **Tran Duy Long**
  - Responsibilities: Course viewing experience, video integration, user dashboard

## License

© 2025 VLearning. All rights reserved.
