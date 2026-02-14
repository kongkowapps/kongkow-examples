# Kongkow Echo Bot Example

A simple reference implementation of a Kongkow Bot using Node.js and Express.

## Features
- Handles incoming messages via Webhook.
- Responds to `/start` with interactive buttons.
- Echoes back user text.
- Validates the `X-Kongkow-Bot-Api-Secret-Token` header.

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure**:
   Set your environment variables in a `.env` file or passes them inline:
   ```bash
   export BOT_TOKEN="KBV1_..."
   export WEBHOOK_SECRET="my_secret"
   export PORT=3001
   ```

3. **Run**:
   ```bash
   npm start
   ```

4. **Expose to Internet**:
   Use ngrok or similar to expose port 3001:
   ```bash
   ngrok http 3001
   ```

5. **Set Webhook**:
   Talk to `@nova` bot to set your webhook URL to the ngrok address (e.g., `https://xxxx.ngrok.io/webhook`).

## Logic
See `index.js` for the implementation details.
