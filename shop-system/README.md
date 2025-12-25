# Shop Management System

A local-first, web-based Shop Management System built with **Next.js**, **Prisma**, and **SQLite**. Designed for offline reliability, ease of use, and automated backups to Google Drive.

## Features
- **Inventory Management**: Add, edit, delete products. Bulk upload via CSV.
- **Point of Sale (POS)**: Fast billing interface with barcode support (future) and search.
- **User Management**: Admin and Staff roles. Secure login.
- **Reporting**: Daily and monthly sales reports.
- **Backup**: Automated daily backups of the database (synced via Google Drive Desktop).

## Prerequisites

Before running this project, you must have the following installed on your system:

1.  **Node.js** (LTS Version)
    *   Download from: [nodejs.org](https://nodejs.org/)
    *   Verify installation by running `node -v` in your terminal.
2.  **Google Drive for Desktop** (Optional, for Backups)
    *   Install to sync the backup folder automatically.

## Quick Start (Installation)

Follow these steps to set up the project on any new system:

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd shop-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
Initialize the SQLite database:
```bash
npx prisma migrate dev --name init
```
This will create a `dev.db` file in the `prisma` folder and set up the tables.

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management
- **View Database UI**: Run `npx prisma studio` to see and edit data manually.
- **Backup**: backups are stored in the `/backups` directory (configure this path in `.env` if needed).

## Deployment (Local)
To run in production mode (faster):
```bash
npm run build
npm start
```
