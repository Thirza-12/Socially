**Live Link :** https://socially-yvkc.onrender.com/


{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon backend/index.js",
    "build": "cd frontend && npm install && npm run build",
    "start": "nodemon backend/index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.5.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "datauri": "4.1.0",
    "dotenv": "^16.4.5",
    "express": "4.21.2",
    "fs-extra": "^11.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "6.12.0",
    "mongoose": "^8.8.0",
    "multer": "^1.4.5-lts.1",
    "nodemon": "^3.1.7",
    "sharp": "^0.33.5",
    "socket.io": "4.8.1"
  }
}
