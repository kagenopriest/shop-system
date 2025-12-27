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
            // Check for Electron Config
            const userDataPath = process.env.USER_DATA_PATH;
            let sourcePath = path.join(process.cwd(), 'prisma', 'dev.db');
            let destFolder = path.join(os.homedir(), 'Downloads', 'ProShopBackups');

            if (userDataPath) {
                try {
                    const configPath = path.join(userDataPath, 'config.json');
                    if (fs.existsSync(configPath)) {
                        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                        if (config.dbPath) sourcePath = config.dbPath;
                        if (config.backupPath) destFolder = config.backupPath;
                    }
                } catch (e) {
                    console.error("Error reading config for backup:", e);
                }
            }

            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const destPath = path.join(destFolder, `shop-backup-${timestamp}.db`);

            fs.copyFileSync(sourcePath, destPath);
            console.log(`Database backed up successfully to: ${destPath}`);
        } catch (error) {
            console.error('Backup failed:', error);
        }
    });
}
