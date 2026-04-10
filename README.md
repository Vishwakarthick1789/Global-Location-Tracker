# 📍 Global Location Tracker

A full-stack, premium web application designed to track and log your global footprint. Built with a modern tech stack to provide an intuitive map interface and secure data logging.

## 🚀 Features

- **Interactive Global Map**: View all your logged locations on a beautiful CartoDB Dark Matter map powered by Leaflet.js.
- **One-Click Tracking**: Quickly fetch and log your exact coordinates using your browser's Geolocation API.
- **Robust Database**: All coordinates are safely stored in a local MySQL database.
- **FastAPI Backend**: Rapid, modern Python backend serving as a robust bridge between the database and the frontend.
- **Premium Aesthetics**: Engineered with deep dark-mode support, modern typography (Outfit), and smooth UI animations.

## 🛠️ Technology Stack

- **Frontend:** HTML5, Vanilla JavaScript, CSS3, Leaflet.js
- **Backend:** Python (FastAPI, Uvicorn, nest-asyncio for Jupyter compatibility)
- **Database:** MySQL Workbench

## ⚙️ Setup & Installation

### 1. Database Setup
1. Launch **MySQL Workbench**.
2. Execute the `schema.sql` script located in the `database` folder to create the `location_db` database and `locations` table.

### 2. Backend Setup
The backend is neatly packaged into a Jupyter Notebook that runs locally, making it easy to see exactly what's happening.
1. Open terminal in the `backend` folder and run:
   ```bash
   pip install -r requirements.txt
   ```
2. Open `Backend.ipynb` in your preferred IDE (e.g., Jupyter Notebook, VS Code).
3. In the setup cell, update the `DB_CONFIG` credentials with your MySQL root password.
4. Run all notebook cells to start the FastAPI server on `http://127.0.0.1:8000`.

### 3. Frontend Setup
1. Open the `frontend` folder.
2. Double-click `index.html` to open it in your browser.
3. Allow location access when prompted and start tracking!
