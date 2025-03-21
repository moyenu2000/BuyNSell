# Project Documentation

## Overview

This project is a full-stack web application providing an online marketplace for buying and selling products. It is developed using React.js for the frontend and Node.js (Express) with OracleDB for the backend. The application includes user authentication, product listing and management, advanced filtering options, real-time chat functionality for buyers and sellers, and dynamic location selection.

## Tech Stack

### Frontend:
- **React.js**
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests
- **Bootstrap & React-Bootstrap** for UI components
- **Socket.IO Client** for real-time chat

### Backend:
- **Node.js & Express** for server-side handling
- **Oracle Database** for data storage
- **OracleDB Node.js module** for database interactions
- **Socket.IO** for real-time messaging
- **Crypto** for secure password hashing

## Features

### User Authentication
- **Registration:** Users can register with their personal details, including location.
- **Login:** Secure authentication using hashed passwords (SHA1).

### Buy & Sell Products
- **List Products:** Sellers can list products with details such as images, descriptions, pricing, brand, and categories.
- **Browse Products:** Buyers can explore products, filter by categories, subcategories, price ranges, and brands, and sort by price and date added.

### Real-Time Messaging
- Enables instant communication between buyers and sellers.
- Supports persistent chat history for all transactions.

### Location Selection
- Dynamic selection of locations (Division, District, Upazilla) for accurate seller and buyer information.

## Directory Structure

```
client/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── locationSelector.js
│   │   ├── Products.js
│   │   ├── chat.js
│   │   └── common/Button.jsx
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── UserContext.js
│   ├── pages/
│   │   ├── AddProducts.js
│   │   ├── Dashboard.js
│   │   ├── loginPage.js
│   │   └── signUp.js
│   ├── App.js
│   └── index.js

server/
├── routes/
│   └── users.js
├── connectToDatabase.js
├── database.js
├── password.js
├── runQuery.js
└── server.js
```

## Installation

### Frontend Setup
```sh
cd client
npm install
npm start
```

### Backend Setup
```sh
cd server
npm install
nodemon server.js
```

## Database Configuration
Update your Oracle DB configuration in:

- `server/connectToDatabase.js`
- `server/database.js`

```javascript
const dbConfig = {
    user: '<your_db_user>',
    password: '<your_db_password>',
    connectString: '<your_connection_string>'
};
```

## API Endpoints

- **Authentication:**
  - POST `/signup`
  - POST `/login`

- **Products:**
  - GET `/products`
  - POST `/filterProducts`
  - POST `/AddProduct`

- **Categories:**
  - GET `/rootCategories`
  - GET `/subCategories`

- **Location:**
  - GET `/locations`

- **Chat:**
  - Real-time chat via Socket.IO

## Real-Time Chat (Socket.IO)

- **Server-side Events:**
  - `send_message`
  - `fetch_chat_history`

- **Client-side Events:**
  - `receive_message`
  - `chat_history`

## Security
- Passwords securely hashed using SHA1.
- Data handling follows best security practices.

## Contribution

Feel free to fork this repository, submit issues, and create pull requests.

## License

This project is open-source under the [MIT License](LICENSE).

# moyenu2000.github.io
