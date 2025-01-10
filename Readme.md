# E-commerce Application Documentation

## Project Overview
This is a full-stack e-commerce application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with modern features and integrations.

## Architecture

### Frontend (Client)
- **Technology**: React.js (v18.2.0)
- **Key Features**:
  - Responsive design using Bootstrap 5
  - Client-side routing with React Router
  - JWT-based authentication
  - Image optimization with lazy loading
  - PDF generation capabilities
  - Payment integration with Stripe
  - Social sharing functionality
  - Toast notifications for user feedback

### Backend (Server)
- **Technology**: Node.js with Express.js
- **Key Features**:
  - RESTful API architecture
  - MongoDB database integration
  - JWT authentication
  - Cookie-based session management
  - CORS enabled for cross-origin requests
  - Environment variable configuration
  - Static file serving

## Project Structure

```
├── Client/                 # Frontend React application
│   ├── src/               # Source code
│   ├── public/            # Public assets
│   ├── build/             # Production build
│   └── package.json       # Frontend dependencies
│
├── Server/                # Backend Node.js application
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── app.js            # Main server file
│   └── package.json      # Backend dependencies
│
└── Doc/                   # Project documentation
```

## Key Dependencies

### Frontend Dependencies
- React and React DOM
- React Router for navigation
- Stripe.js for payments
- Bootstrap for styling
- Axios for HTTP requests
- Various React utilities (lazy loading, JWT handling, PDF generation)

### Backend Dependencies
- Express.js for server framework
- MongoDB for database
- JWT for authentication
- Cookie-parser for session management
- CORS for cross-origin resource sharing

## API Documentation

### Authentication APIs (`/auth`)
1. **User Registration**
   - Endpoint: `/auth/signup`
   - Method: POST
   - Body:
     ```json
     {
       "username": "string",
       "email": "string",
       "password": "string"
     }
     ```

2. **User Login**
   - Endpoint: `/auth/login`
   - Method: POST
   - Body:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - Returns: JWT token

### Database APIs (`/db`)
1. **Get All Items**
   - Endpoint: `/db/items`
   - Method: GET
   - Returns: Array of all products in the store

2. **User Profile Management**
   - Update Phone
     - Endpoint: `/db/user_phone`
     - Method: POST
   - Update Address
     - Endpoint: `/db/user_address`
     - Method: POST
   - Get Order History
     - Endpoint: `/db/order_history`
     - Method: POST
   - Generate Invoice
     - Endpoint: `/db/invoice`
     - Method: POST

3. **Payment APIs**
   - Create Payment
     - Endpoint: `/db/payment`
     - Method: POST
   - Check Payment Status
     - Endpoint: `/db/payment_status`
     - Method: POST
     - Verifies the Stripe checkout session server side before marking the order paid

   Prices are always taken from the server's catalog (`Server/items.json`), never from the cart sent by the client.

### Webhook APIs (`/webhook`)
Optional Stripe webhook, enabled when `STRIPE_WEBHOOK_SECRET` is set:
- `checkout.session.completed` marks the order as paid even if the user never reaches the success page

## Screenshots

### Navigation and Header
![Navigation Bar](Doc/NavBar.png)
*Navigation bar showing main menu items and user controls*

### Home Page
![Home Page](Doc/Homepage.png)
*Main landing page with featured products*

### Header Section
![Header](Doc/Header.png)
*Header section with branding and key navigation elements*

### Footer Section
![Footer](Doc/Footer.png)
*Footer with additional links and information*

## Deployment
The application is configured for deployment with:
- Frontend: Netlify configuration present
- Backend: Vercel configuration available
- Docker support for both frontend and backend

## Security Features
- JWT-based authentication
- Passwords hashed with bcrypt
- Environment variable configuration (secrets are never committed, see `.env.example`)
- Cookie parsing and management
- CORS protection

## Development Setup

1. Backend:
   ```bash
   cd Server
   cp .env.example .env   # fill in MongoDB URI, JWT key and Stripe keys
   npm install
   npm run dev            # or npm start
   ```

2. Frontend:
   ```bash
   cd Client
   cp .env.example .env   # Stripe publishable key and API endpoint
   npm install
   npm start
   ```

## Additional Features
- Image magnification capabilities
- Lazy loading for improved performance
- PDF generation and handling
- Social sharing integration
- Loading spinners for better UX
- Toast notifications for user feedback

## Author
Deeptanshu Lal
