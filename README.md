# EduManage (Client)

## Overview

A MERN-based education management platform with role-based dashboards for students, teachers, and admins—covering classes, enrollments with payments, assignments, approvals, and comprehensive admin controls.  
This repository contains the client-side React application.

Live Preview:  
https://edu-manage-ed474.web.app/

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technology Used](#technology-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)
- [Contact / Support](#contact--support)

---

## Project Description

EduManage (Client) is an advanced, responsive ReactJS web application for education management. It connects students, teachers, and admins in a seamless, interactive environment to manage classes, assignments, enrollment, and platform-wide administration with a focus on usability, security, and performance.  
The client interacts with a separate backend API for data persistence, authentication, and payments.

---

## Features

- **Modern Responsive Design:** Fully responsive layout using CSS Grid and Flexbox.
- **Routing:** Client-side navigation with React Router.
- **Role-Based Dashboards:** Dedicated dashboards for students, teachers, and admins with tailored functionality.
- **Secure Authentication:** Email/password and Google authentication with JWT-based protected routes.
- **Class Management:** Teachers can add, update, and delete classes, pending admin approval before listing.
- **Class Enrollment & Payment:** Students can enroll and pay for classes; enrollment and transactions are tracked.
- **Assignment Workflow:** Teachers create assignments; students submit and track progress in real time.
- **Teaching Application:** Users can apply to become teachers; admins review and approve.
- **Admin Control:** Admins approve/reject teacher applications and classes, manage users, and oversee platform data.
- **Pagination and Search:** Paginated tables/cards and server-side search for efficient data handling.
- **Accessibility:** Focus states and screen reader-friendly markup.
- **Smooth Animations:** Subtle transitions for interactive elements.
- **Security Best Practices:** Sensitive keys (Firebase, etc.) are secured with environment variables.

---

## Technology Used

- **React** — Frontend library for building user interfaces
- **React Router DOM** — Declarative routing for React applications
- **Firebase Authentication** — Email/Password and Google sign-in
- **JSON Web Tokens (JWT)** — Client-side handling for protected routes
- **React Hook Form** — Form handling and validation
- **Axios/Fetch** — HTTP requests to the backend API
- **CSS3** — Styling and layout using Grid and Flexbox

---

## Installation

### Prerequisites

- [Git](https://git-scm.com/) (to clone the repository)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for dependency management)
- A modern web browser (Chrome, Edge, Firefox, Safari, etc.)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/usernayeem/edu-manage.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd edu-manage
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
4. Create and configure environment variables (see Configuration).

5. **Run locally:**
   ```bash
   npm run dev
   ```
   This will start the development server. The app will be available at `http://localhost:5173`.

---

## Usage

- **Sign In / Sign Up:** Authenticate via Email/Password or Google to access role-based dashboards.
- **Students:** Browse approved classes, enroll and pay, view enrolled classes, and submit assignments.
- **Teachers:** Apply to become a teacher, create and manage classes, post assignments, and review submissions.
- **Admins:** Review and approve teacher applications and classes, manage users/roles, and monitor platform activity.
- **Pagination & Search:** Use built-in pagination and search to navigate large datasets efficiently.

- **Admin Demo Credentials:**
  - Email/Password:
    - Email: `nayeem.edumanage@mailinator.com`
    - Password: `qwerty123`
  - Google:
    - Email: `nayeem.edumanage@gmail.com`
    - Password: `qwertynayeem`

---

## Configuration

- Environment variables (create a `.env` file in the project root):

  ```env
  VITE_API_BASE_URL=http://localhost:5173
  VITE_FIREBASE_API_KEY=your_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_firebase_app_id
  ```

- Styling: Modify the main stylesheet (e.g., `index.css`) or your chosen UI utility/classes to customize design.

---

## Testing

- **Automated Testing:**  
  The project can use Jest and React Testing Library for unit and component testing (if configured).

- **Run Tests:**

  ```bash
  npm test
  ```

- **For manual testing:**
  - Open the app in different browsers and devices.
  - Test keyboard navigation and accessibility.
  - Check responsiveness on various screen sizes.
  - Verify protected routes and role-based access control (student/teacher/admin).
  - Exercise CRUD flows (classes, assignments, enrollments) and confirm notifications.

---

### Admin Access (Email/Password)

**Admin Email:** nayeem.edumanage@mailinator.com<br>
**Password:** qwerty123

### Admin Access (Google)

**Admin Email:** nayeem.edumanage@gmail.com<br>
**Password:** qwertynayeem

---

## License

This project is licensed under the [MIT](LICENSE) License.

---

## Contact / Support

- **Author:** [Md Nayeem](https://www.github.com/usernayeem)
- **Repository**: https://github.com/usernayeem/edu-manage
- **Issues:** Please use the [GitHub Issues page](https://github.com/usernayeem/edu-manage/issues) for bug reports or feature requests.
