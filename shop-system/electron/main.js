const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { fork, spawn } = require('child_process');

let mainWindow;
let serverProcess;
const PORT = 3000;
const isDev = !app.isPackaged;

// Config file path (stored in UserData)
const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

// Get DB Path from config or return null
function getDbPath() {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const config = fs.readJsonSync(CONFIG_PATH);
            if (config.dbPath && fs.existsSync(config.dbPath)) {
                return config.dbPath;
            }
        } catch (e) {
            console.error('Error reading config:', e);
        }
    }
    return null;
}

// Start Next.js Server
function startServer(dbPath) {
    const logPath = path.join(process.resourcesPath, 'server-log.txt');
    const log = (msg) => {
        try {
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
        } catch (e) {
            // ignore
        }
    };

    log('Current User Data Path: ' + app.getPath('userData'));
    log('Resources Path: ' + process.resourcesPath);

    if (isDev) {
        console.log('Dev mode: Server expected to be running via npm run electron:dev');
        return;
    }

    // Set DB URL for the server process
    const env = { ...process.env, PORT: PORT.toString() };
    if (dbPath) {
        env.DATABASE_URL = `file:${dbPath}`;
    }

    // Path to standalone server
    // In production, we unpack .next/standalone into 'resources/app'
    const serverPath = isDev
        ? path.join(__dirname, '..', '.next', 'standalone', 'server.js')
        : path.join(process.resourcesPath, 'app', 'server.js');

    log('Starting server from: ' + serverPath);
    console.log('Starting server from:', serverPath);

    if (!fs.existsSync(serverPath)) {
        log('ERROR: Server file not found at ' + serverPath);
        return;
    }

    serverProcess = fork(serverPath, [], {
        env,
        cwd: isDev
            ? path.join(__dirname, '..', '.next', 'standalone')
            : path.join(process.resourcesPath, 'app'),
        stdio: ['ignore', 'pipe', 'pipe', 'ipc']
    });

    serverProcess.stdout.on('data', (data) => {
        log('STDOUT: ' + data);
        console.log('Server STDOUT:', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
        log('STDERR: ' + data);
        console.error('Server STDERR:', data.toString());
    });

    serverProcess.on('error', (err) => {
        log('Server failed to start: ' + err);
        console.error('Server failed:', err);
    });

    serverProcess.on('exit', (code, signal) => {
        log(`Server exited with code ${code} and signal ${signal}`);
        console.log('Server exited:', code, signal);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: 'ShopMaster System',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const dbPath = getDbPath();

    // Decide startup URL
    const loadUrl = async () => {
        // Wait for server if in prod
        if (!isDev) {
            // Simple wait loop
            const waitOn = require('wait-on');
            try {
                await waitOn({ resources: [`http://localhost:${PORT}`], timeout: 10000 });
            } catch (e) {
                console.error('Server timeout', e);
            }
        }

        // If no DB configured, go to Setup
        const targetPath = dbPath ? '/' : '/setup';
        mainWindow.loadURL(`http://localhost:${PORT}${targetPath}`);
    };

    loadUrl();

    // Open external links in browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });

    // FORCE DEBUGGING (Disabled for production)
    // mainWindow.webContents.openDevTools();
}

// IPC Handlers
ipcMain.handle('setup:check-status', async () => {
    return !!getDbPath();
});

ipcMain.handle('dialog:open-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory'],
    });
    return result.filePaths[0];
});

ipcMain.handle('dialog:open-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Database Backups', extensions: ['bak', 'db'] }],
    });
    return result.filePaths[0];
});

ipcMain.handle('setup:init-new', async (event, targetFolder) => {
    try {
        const targetDbPath = path.join(targetFolder, 'live.db');
        // Copy template DB
        let templatePath = isDev
            ? path.join(__dirname, '..', 'prisma', 'dev.db')
            : path.join(process.resourcesPath, 'prisma', 'dev.db');

        // If template doesn't exist (fresh repo?), might need to ensure seed runs. 
        // Assuming dev.db exists.
        await fs.copy(templatePath, targetDbPath);

        // Save Config
        await fs.outputJson(CONFIG_PATH, { dbPath: targetDbPath });

        // Relaunch to apply ENV vars
        app.relaunch();
        app.exit(0);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
});

ipcMain.handle('setup:restore-db', async (event, backupFile, targetFolder) => {
    try {
        const targetDbPath = path.join(targetFolder, 'live.db');
        await fs.copy(backupFile, targetDbPath);
        await fs.outputJson(CONFIG_PATH, { dbPath: targetDbPath });
        app.relaunch();
        app.exit(0);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
});

// App Lifecycle
app.whenReady().then(() => {
    if (!isDev) {
        const dbPath = getDbPath();
        startServer(dbPath);
    }
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    if (serverProcess) serverProcess.kill();
});
