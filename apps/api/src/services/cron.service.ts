/**
 * Cron Service
 * Background jobs for auto-syncing data
 */

import * as taxUpdatesService from './tax-updates.service';

// Run daily at 6 AM IST to sync tax rules
export function startTaxSyncScheduler() {
    console.log('🕐 Starting tax sync scheduler...');

    // Sync immediately on startup
    taxUpdatesService.syncTaxRules();

    // Then sync every 24 hours
    setInterval(
        async () => {
            console.log('⏰ Daily tax sync triggered...');
            await taxUpdatesService.syncTaxRules();
        },
        24 * 60 * 60 * 1000
    ); // 24 hours

    console.log('✅ Tax sync scheduler started (runs every 24 hours)');
}

// Sync on server start
export function initializeCronJobs() {
    console.log('🚀 Initializing background jobs...');
    startTaxSyncScheduler();
}
