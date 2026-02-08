#!/usr/bin/env node

/**
 * Health Monitor Script
 *
 * Checks the health of CreatorIQ API and sends alerts if down.
 * Can be run as a cron job or scheduled task.
 *
 * Usage:
 *   node scripts/health-monitor.js
 *
 * Environment variables:
 *   - API_URL: The API URL to monitor (default: http://localhost:3001)
 *   - ALERT_WEBHOOK: Webhook URL for alerts (Slack, Discord, etc.)
 *   - ALERT_EMAIL: Email address for alerts
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const ALERT_WEBHOOK = process.env.ALERT_WEBHOOK;
const ALERT_EMAIL = process.env.ALERT_EMAIL;

// Parse URL
const url = new URL(`${API_URL}/health`);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

console.log(`[${new Date().toISOString()}] Checking health: ${url.href}`);

// Make health check request
const req = client.get(url.href, { timeout: 10000 }, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);

            if (res.statusCode === 200 && response.status === 'ok') {
                console.log(`✅ Health check passed: ${response.message}`);
                process.exit(0);
            } else {
                console.error(`❌ Health check failed: Status ${res.statusCode}`);
                console.error('Response:', data);
                sendAlert(`Health check failed with status ${res.statusCode}`);
                process.exit(1);
            }
        } catch (error) {
            console.error('❌ Invalid JSON response:', data);
            sendAlert(`Invalid health check response: ${error.message}`);
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Health check request failed:', error.message);
    sendAlert(`Health check request failed: ${error.message}`);
    process.exit(1);
});

req.on('timeout', () => {
    req.destroy();
    console.error('❌ Health check timed out');
    sendAlert('Health check request timed out after 10 seconds');
    process.exit(1);
});

/**
 * Send alert notification
 */
function sendAlert(message) {
    const timestamp = new Date().toISOString();
    const fullMessage = `🚨 CreatorIQ Alert\\n\\nTime: ${timestamp}\\nAPI: ${API_URL}\\nIssue: ${message}`;

    console.log('Sending alert:', fullMessage);

    // Send to webhook (Slack, Discord, etc.)
    if (ALERT_WEBHOOK) {
        sendWebhookAlert(ALERT_WEBHOOK, fullMessage);
    }

    // Send email alert
    if (ALERT_EMAIL) {
        console.log(`Alert email would be sent to: ${ALERT_EMAIL}`);
        // Implement email sending logic here (using nodemailer, SendGrid, etc.)
    }

    // If no alert method configured, just log
    if (!ALERT_WEBHOOK && !ALERT_EMAIL) {
        console.warn('⚠️ No alert methods configured. Set ALERT_WEBHOOK or ALERT_EMAIL environment variables.');
    }
}

/**
 * Send alert to webhook (Slack, Discord, etc.)
 */
function sendWebhookAlert(webhookUrl, message) {
    const url = new URL(webhookUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const payload = JSON.stringify({
        text: message,
        // For Slack
        username: 'CreatorIQ Monitor',
        icon_emoji: ':warning:',
        // For Discord
        content: message
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = client.request(url, options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Alert sent successfully');
        } else {
            console.error(`❌ Failed to send alert: Status ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        console.error('❌ Failed to send alert:', error.message);
    });

    req.write(payload);
    req.end();
}
