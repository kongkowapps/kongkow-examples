/**
 * Kongkow Echo Bot Example
 *
 * A simple bot that:
 * 1. Echoes back any text message it receives.
 * 2. Responds to /start with a welcome message and button.
 * 3. Handles button callbacks.
 *
 * Uses the official @kongkow/sdk from npm.
 */

import express from "express";
import { KongkowBot } from "@kongkow/sdk";

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN || "YOUR_BOT_TOKEN";
const PORT = process.env.PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

// Initialize bot
const bot = new KongkowBot(BOT_TOKEN, { webhookSecret: WEBHOOK_SECRET });

// Register command handlers
bot.onCommand("start", async (update) => {
    await bot.sendMessage(update.message.chat.id, "Hello! I am an Echo Bot. Send me anything and I will say it back.", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Click Me", callback_data: "click_1" }],
                [{ text: "Open Mini App", web_app: { url: "https://kongkow.xyz" } }],
            ],
        },
    });
});

// Echo all other messages
bot.onMessage(async (update) => {
    const text = update.message?.text;
    if (text) {
        await bot.sendMessage(update.message.chat.id, `You said: ${text}`);
    }
});

// Handle inline keyboard callbacks
bot.onCallback(async (update) => {
    const chatId = update.callback_query.message.chat.id;
    await bot.sendMessage(chatId, `Callback received: ${update.callback_query.data}`);
});

// Express server
const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
    try {
        const secret = req.headers["x-kongkow-bot-api-secret-token"];
        await bot.handleUpdate(req.body, secret);
    } catch (err) {
        console.error("Error handling update:", err);
    }
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Echo Bot running on port ${PORT}`);
    console.log(`Set webhook URL to: <YOUR_URL>/webhook`);
});
