# ShopMaster - Premium Shop Management System

**ShopMaster** is a robust, local-first web application designed to streamline inventory management, sales tracking, and reporting for retail shops. Built with modern web technologies, it offers a premium user experience with offline capabilities and automated backups.

## 🚀 Features

-   **Inventory Management**:
    -   Add, edit, and delete products.
    -   **Bulk Upload**: Import products via CSV files.
    -   Real-time stock tracking.
-   **Point of Sale (POS)**:
    -   Fast and intuitive billing interface.
    -   Product search and instant cart calculations.
    -   Support for multiple payment modes.
-   **Reporting & Analytics**:
    -   **Dashboard**: At-a-glance view of daily revenue, orders, and stock alerts.
    -   **Sales Reports**: Detailed sales history and performance metrics.
    -   **User Performance**: Track sales by staff member.
-   **User Management**:
    -   Role-based access control (Admin vs. Staff).
    -   Secure authentication.
-   **Reliability**:
    -   **Local-First Database**: Uses SQLite for speed and simplicity.
    -   **Automated Backups**: Scheduled backups of your database (integrated with Google Drive for desktop if installed).
-   **Hybrid Architecture**:
    -   **Frontend**: Next.js 16 (App Router) for a responsive UI.
    -   **Backend**: Python FastAPI service for specialized tasks.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 16](https://nextjs.org/), React 19, TailwindCSS, Lucide Icons.
-   **Backend**: [Python FastAPI](https://fastapi.tiangolo.com/) (running on port 8000).
-   **Database**: SQLite with [Prisma ORM](https://www.prisma.io/).
-   **Language**: TypeScript & Python.

## 📋 Prerequisites

Ensure you have the following installed:

1.  **Node.js** (LTS version, e.g., v18+ or v20+).
2.  **Python** (v3.10+).
3.  **Git**.

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kagenopriest/shop-system.git
cd shop-system
```

### 2. Setup Frontend (Next.js)

Navigate to the main application directory:

```bash
cd shop-system
```

Install dependencies:

```bash
npm install
```

Initialize the database:

```bash
# This creates the dev.db SQLite file and runs migrations
npx prisma migrate dev --name init

# Seed the database with initial users (Admin/Staff)
npx prisma db seed
```

### 3. Setup Backend (Python)

Open a new terminal and navigate to the backend directory:

```bash
cd shop-system-py/backend
```

Create a virtual environment and install dependencies:

```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run the Python backend:

```bash
uvicorn main:app --reload
```
*The backend runs on http://localhost:8000*

## 🚀 Running the Application

To start the main application (Frontend):

```bash
cd shop-system
npm start
# OR for development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `123456` |
| **Staff** | `staff` | `123456` |

## 📂 Project Structure

```
├── shop-system/            # Next.js Frontend & Main App
│   ├── app/                # App Router Pages & API Routes
│   ├── components/         # React Components
│   ├── lib/                # Utilities (Prisma, etc.)
│   ├── prisma/             # Database Schema & Seeds
│   └── public/             # Static Assets
│
├── shop-system-py/         # Python Backend Services
│   └── backend/            # FastAPI App
│       └── main.py
│
└── README.md               # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
