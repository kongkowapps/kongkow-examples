/**
 * Kongkow Echo Bot Example
 * 
 * A simple bot that:
 * 1. Echoes back any text message it receives.
 * 2. Responds to /start with a welcome message and button.
 * 3. Handles button callbacks.
 */

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Ensure you install node-fetch@2 for CommonJS

const app = express();
app.use(bodyParser.json());

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1/bots';
const PORT = process.env.PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'secret';

// Helper to call Bot API
async function callApi(method, payload) {
    const response = await fetch(`${API_URL}/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BOT_TOKEN}`
        },
        body: JSON.stringify(payload)
    });
    return await response.json();
}

// Webhook Handler
app.post('/webhook', async (req, res) => {
    // Verify secret token if set
    const token = req.headers['x-kongkow-bot-api-secret-token'];
    if (WEBHOOK_SECRET && token !== WEBHOOK_SECRET) {
        console.warn('Unauthorized webhook attempt');
        return res.sendStatus(403);
    }

    const update = req.body;
    console.log('Received update:', JSON.stringify(update, null, 2));

    try {
        if (update.message) {
            await handleMessage(update.message);
        } else if (update.callback_query) {
            await handleCallback(update.callback_query);
        }
    } catch (err) {
        console.error('Error handling update:', err);
    }

    res.sendStatus(200);
});

async function handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    if (!text) return;

    if (text === '/start') {
        await callApi('sendMessage', {
            chat_id: chatId,
            text: 'Hello! I am an Echo Bot. Send me anything and I will say it back.',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Click Me', callback_data: 'click_1' }],
                    [{ text: 'Open Mini App', web_app: { url: 'https://google.com' } }]
                ]
            }
        });
    } else {
        await callApi('sendMessage', {
            chat_id: chatId,
            text: `You said: ${text}`
        });
    }
}

async function handleCallback(query) {
    const chatId = query.message.chat.id;

    await callApi('sendMessage', {
        chat_id: chatId,
        text: `Callback received: ${query.data}`
    });
}

app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
    console.log(`Set webhook URL to: <YOUR_URL>/webhook`);
});
