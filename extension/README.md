# lmb

lmb is a browser extension designed to secure your entire browsing session. It locks all your open tabs and windows behind a personal PIN, ensuring your work and personal information remain private, even if you step away from your computer.

## Key Features

- **Instant Session Lock:** Immediately lock all open tabs and windows with a single click or the `Ctrl+Shift+K` keyboard shortcut.
- **PIN-Protected Access:** Your browsing session is secured behind a numeric PIN. Unlock with a clean, full-screen lock page.
- **Automatic Idle Lock:** Automatically locks the browser after a configurable period of inactivity (1, 5, 10, 15, or 30 minutes).
- **Seamless Restoration:** Upon unlocking, all your tabs and windows are restored to their original state, just as you left them.
- **Privacy-First Design:** Tab content is hidden before the lock screen appears, preventing content flashes and protecting your privacy.
- **Secure Account Recovery:** A simple recovery process using your email and a password in case you forget your PIN.
- **Easy Configuration:** Manage auto-lock settings and reset your PIN through the extension popup and a dedicated settings page.

## How It Works

When the lock command is triggered, lmb performs the following actions:

1.  It records the URLs and states of all open tabs and windows.
2.  It navigates all active tabs to a blank page to hide their content for privacy.
3.  It opens a single, full-screen lock window where you can enter your PIN.
4.  A content script ensures that any new tabs or pages opened while locked are immediately redirected to the lock screen.

When you enter the correct PIN, the service worker restores all your windows and tabs to their previous URLs and states, closing the lock screen.

## Installation

To install the extension from the source code:

1.  Clone the repository:
    ```sh
    git clone https://github.com/harshuh/lmb.git
    cd lmb/extension
    ```
2.  Install the dependencies using `pnpm`:
    ```sh
    pnpm install
    ```
3.  Build the extension for production:
    ```sh
    pnpm run build
    ```
4.  Load the unpacked extension in your browser:
    - Navigate to `chrome://extensions` (or the equivalent URL in your Chromium-based browser).
    - Enable "Developer mode" using the toggle switch.
    - Click the "Load unpacked" button.
    - Select the `extension/dist` directory from your local repository.

## Usage

- **Onboarding:** After installation, a setup page will open. You'll be prompted to create a recovery email, password, and a numeric PIN to secure the extension.
- **Locking the Browser:**
  - Click the lmb icon in your browser's toolbar and press the "Lock Browser" button.
  - Alternatively, use the keyboard shortcut: `Ctrl+Shift+K` (or `Command+Shift+K` on macOS).
- **Unlocking:** Enter your PIN on the lock screen that appears.
- **Configuration:**
  - Access settings by clicking the "Settings" button in the extension popup or by navigating to the extension's options page from `chrome://extensions`.
  - In settings, you can enable or disable the auto-lock feature, adjust the timer, and reset your PIN.

## Development

To run the extension in development mode with Hot Module Replacement (HMR):

1.  Clone the repository and install dependencies as described in the installation section.
2.  Run the development server:
    ```sh
    pnpm run dev
    ```
3.  Load the unpacked extension as described above, but this time, select the root `extension/` directory. The Vite development server will manage the build artifacts in memory.
