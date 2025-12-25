import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import os from 'os';

export function initCron() {
    console.log('Initializing Backup Cron Job...');

    // Schedule task to be run on the server.
    cron.schedule('0 0 * * *', () => {
        console.log('Starting daily backup...');

        try {
            const sourcePath = path.join(process.cwd(), 'prisma', 'dev.db');

            // System Independent: Try to find Downloads folder
            const homeDir = os.homedir();
            const downloadDir = path.join(homeDir, 'Downloads', 'ProShopBackups'); // Subfolder to be organized

            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const destPath = path.join(downloadDir, `shop-backup-${timestamp}.db`);

            fs.copyFileSync(sourcePath, destPath);
            console.log(`Database backed up successfully to: ${destPath}`);
        } catch (error) {
            console.error('Backup failed:', error);
        }
    });
}
