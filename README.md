# ArcShield

ArcShield is a browser extension that enhances your browsing security by locking tabs with JWT-backed authentication. It consists of a backend server and a browser extension that work together to protect your browsing sessions.

## Features

- **Secure Authentication**: User registration and login system powered by JWTs.
- **Browser-Wide Lock**: Instantly lock all open tabs with a single action or shortcut.
- **Selective Tab Locking**: Configure specific URL patterns to be automatically locked.
- **Session Management**: Secure session handling with the ability to log out and revoke active sessions.
- **Password Verification**: Re-authenticate to unlock your browser without a full login.
- **Keyboard Shortcuts**:
    - `Ctrl+Shift+L` (or `Cmd+Shift+L` on Mac) to open the ArcShield popup.
    - `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac) to instantly lock all tabs.

## Tech Stack

- **Backend**:
    - **Framework**: Express.js
    - **Language**: TypeScript
    - **ORM**: Prisma with a PostgreSQL database (configured for Neon)
    - **Authentication**: `jsonwebtoken` (JWT)
    - **Validation**: Zod
- **Browser Extension**:
    - **Framework**: React
    - **Language**: TypeScript
    - **Bundler**: Vite

## Project Structure

This repository is a monorepo containing the two main components of ArcShield:

-   `/server`: The Express.js backend API that handles user authentication, session management, and stores locking preferences.
-   `/extension`: The browser extension built with React and Vite. It communicates with the server to enforce the locking rules.

## Getting Started

### Prerequisites

-   Node.js (>= 20.x)
-   pnpm (`npm install -g pnpm`)
-   A PostgreSQL database (e.g., from [Neon](https://neon.tech/))

### 1. Server Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `server` directory and add the following variables. A strong, random string is recommended for `JWT_SECRET`.

    ```env
    # Your PostgreSQL database connection string
    DATABASE_URL="postgresql://user:password@host:port/database"

    # A secret for signing JWTs
    JWT_SECRET="your-super-secret-jwt-key"

    # The origin of the browser extension for CORS
    CORS_ORIGIN="chrome-extension://your-extension-id"
    ```
    *Note: You can find your extension's ID by loading it into your browser (see Extension Setup below) and visiting `chrome://extensions`.*

4.  **Run database migrations:**
    This command will apply the schema to your database.
    ```bash
    pnpm prisma migrate dev
    ```

5.  **Start the development server:**
    The server will run on `http://localhost:1124`.
    ```bash
    pnpm dev
    ```

### 2. Extension Setup

1.  **Navigate to the extension directory:**
    ```bash
    cd extension
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Build the extension:**
    This will create a `dist` directory with the compiled extension files.
    ```bash
    pnpm build
    ```

4.  **Load the extension in your browser (e.g., Google Chrome):**
    -   Open your browser and navigate to `chrome://extensions`.
    -   Enable "Developer mode" (usually a toggle in the top-right corner).
    -   Click "Load unpacked".
    -   Select the `extension/dist` directory from this project.

## API Endpoints

The server exposes the following REST API endpoints. Protected routes require a `Bearer` token in the `Authorization` header.

### Authentication (`/auth`)

-   `POST /register`: Create a new user account.
-   `POST /login`: Log in and receive a JWT.
-   `POST /logout`: Revoke the current JWT session.
-   `POST /verify`: Verify a password to receive a new JWT for an unlocked session.

### User (`/me`) - *Protected*

-   `GET /`: Get the current user's profile information.
-   `PATCH /browser-lock`: Enable or disable the browser-wide lock.

### Locked Tabs (`/tabs`) - *Protected*

-   `GET /`: Get all locked tab configurations for the current user.
-   `POST /`: Create a new locked tab configuration.
-   `PATCH /:id`: Update an existing locked tab configuration.
-   `DELETE /:id`: Delete a locked tab configuration.

## Database Schema

The application uses a PostgreSQL database managed by Prisma. The schema is defined in `server/prisma/schema.prisma` and includes the following models:

-   **User**: Stores user credentials and a flag for the browser-wide lock.
-   **LockedTab**: Defines a URL pattern, label, and active status for tabs that should be locked. Each `LockedTab` is associated with a `User`.
-   **Session**: Tracks active JWTs for users, allowing for session revocation (logout). Each session is identified by its JWT ID (`jti`).
