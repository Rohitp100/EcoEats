# EcoEats - Scan for Ingredients Daily Limit.

We frequently turn to YouTube or other sources to discover suitable foods, as understanding ingredients and their impact is crucial. This app assists users by scanning
ingredients, providing insights into their daily limits.


# Setup

Download the project files to your local machine.

# Start the Client

Open Git Bash in the project directory.

Navigate to the client folder:
cd client

Install the necessary dependencies:
npm install

Start the client server:
npm start

# Start the Ingredients Server

Open another Git Bash window.

Navigate to the Ingrdnts_server directory:
cd Ingrdnts_server

Install the required dependencies:
npm install

Create a .env file and add your Spoonacular API Key in the following format:
SPOONACULAR_API_KEY=Your_API_Key

Start the server:
node server.js

# Start the OCR Server

Open another Git Bash window.

Navigate to the ocr_server directory:
cd ocr_server

Install the necessary dependencies:
npm install

Start the OCR server:
node index.js
