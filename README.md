# Project Setup Guide

## Prerequisites

Before you proceed, ensure that you have the following installed:
```
- Python 3.x and virtualenv for the backend.
- Node.js and npm for the frontend. 
```

## Backend Setup

### Steps to Run the Backend:

1. Navigate to the `backend` folder: `cd backend `
2. Activate the virtual environment: `venv\Scripts\activate`
3. Install the required dependencies: `pip install -r requirements.txt`
4. Update API Keys:
```
#### Backend - Replace the placeholder API `YOUR_GEMINI_KEY` Key in server.py with your actual key.
#### Frontend - Create `.env.local` file in the root frontend folder.
#### `REACT_APP_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY`
```

5. Start the backend server: `python server.py`

## Frontend Setup

### Steps to Run the Frontend:

1. Navigate to the frontend folder: `cd frontend`
2. Install the dependencies: `npm install`
3. Start the development server: `npm start`

### Additional Notes
Ensure that the backend is running before interacting with the frontend.
Use appropriate .env files or configuration settings to manage sensitive API keys securely.
For troubleshooting, check your terminal or console logs for error messages.
