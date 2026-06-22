# LockMyBrowser

LockMyBrowser is a browser extension designed to secure your entire browsing session. It locks all your open tabs and windows behind a personal PIN, ensuring your work and personal information remain private, even if you step away from your computer.

## Key Features

- **Instant Session Lock:** Immediately lock all open tabs and windows with a single click or the `Ctrl+Shift+K` keyboard shortcut (`Command+Shift+K` on macOS).
- **PIN-Protected Access:** Your browsing session is secured behind a numeric PIN. Unlock via a clean, full-screen lock page.
- **Automatic Idle Lock:** Automatically locks the browser after a configurable period of inactivity (1, 5, 10, 15, or 30 minutes).
- **Seamless Restoration:** Upon unlocking, all your tabs and windows are restored to their original state.
- **Privacy-First Design:** Tab content is hidden by navigating to a blank page before the lock screen appears, preventing content flashes.
- **Secure Onboarding:** A simple setup process to create a recovery email, password, and a numeric PIN.
- **Easy Configuration:** Manage auto-lock settings and reset your PIN through the extension popup and a dedicated settings page.

## How It Works

When a lock is triggered, the extension's service worker performs the following actions:

1.  It records the URLs and states of all open tabs and windows.
2.  It navigates all active tabs to `about:blank` to hide their content for privacy.
3.  It opens a single, full-screen lock window (`lock.html`) where you can enter your PIN.
4.  A content script ensures that any new tabs or pages opened while the browser is locked are immediately redirected to the lock screen.

When you enter the correct PIN, the service worker restores all your windows and tabs to their previous URLs and states, then closes the lock screen.

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Bundler**: Vite
- **Browser Extension Tooling**: `@crxjs/vite-plugin`

## Project Structure

The project is contained within the `/extension` directory and is structured as follows:

- `src/background/service_worker.ts`: The core logic for locking, unlocking, and managing browser state.
- `src/content/inject.ts`: A content script that runs on all pages to enforce the lock when active.
- `src/pages/`: Contains the React applications for the different views of the extension.
  - `lock/`: The full-screen lock page.
  - `popup/`: The UI for the browser action popup.
  - `settings/`: The options page for configuring the extension.
  - `start/`: The onboarding flow for new users.
- `src/shared/`: Shared logic, including `lmbStorage.ts` for managing data in `chrome.storage`.
- `*.html`: HTML entry points for each React application (`lock.html`, `popup.html`, `settings.html`, `start.html`).
- `manifest.config.ts`: The configuration file that generates the `manifest.json`.

## Installation

To install and run the extension from the source code:

1.  Clone the repository:
    ```sh
    git clone https://github.com/harshuh/LockMyBrowser.git
    cd LockMyBrowser/extension
    ```
2.  Install the dependencies using `pnpm`:
    ```sh
    pnpm install
    ```
3.  Build the extension for production:
    ```sh
    pnpm run build
    ```
4.  Load the unpacked extension in your browser (e.g., Google Chrome):
    - Navigate to `chrome://extensions`.
    - Enable "Developer mode".
    - Click the "Load unpacked" button.
    - Select the `extension/dist` directory from your local repository.

## Usage

- **Onboarding:** After installation, a setup page will open. You'll be prompted to create a recovery email, password, and a numeric PIN.
- **Locking the Browser:**
  - Click the LockMyBrowser icon in your browser's toolbar and press the "Lock Browser" button.
  - Use the keyboard shortcut: `Ctrl+Shift+Q` (or `Command+Shift+Q` on macOS).
- **Unlocking:** Enter your PIN on the lock screen.
- **Configuration:**
  - Access settings through the extension popup or by navigating to the options page from `chrome://extensions`.
  - In settings, you can manage auto-lock timers and reset your PIN.

## Development

To run the extension in development mode with Hot Module Replacement (HMR):

1.  Follow steps 1 and 2 from the **Installation** section.
2.  Run the development server:
    ```sh
    pnpm run dev
    ```
3.  Load the unpacked extension as described in the installation steps, but this time, select the root `extension/` directory. The Vite development server will handle the build artifacts in memory.
