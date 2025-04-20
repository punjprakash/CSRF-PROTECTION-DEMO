import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON body
app.use(cookieParser()); // Parse cookies

// Configure CORS - in production this would be more restrictive
app.use(cors({
  origin: 'http://localhost:4200', // Angular app URL
  credentials: true // Allow cookies to be sent
}));

// CSRF Protection middleware
const csrfProtection = csrf({
  cookie: {
    key: '_csrf', // Name of the cookie
    httpOnly: true,
    sameSite: 'strict', // Help prevent CSRF
    secure: process.env.NODE_ENV === 'production' // HTTPS only in production
  },
  //headerName: 'X-CSRF-TOKEN' // Check for token in this header
});

// API routes
const apiRouter = express.Router();

// Get CSRF token - this sets the CSRF cookie and returns a token
apiRouter.get('/csrf-token', csrfProtection, (req: Request, res: Response) => {
  // This generates a token based on the secret in the cookie
  const token = req.csrfToken();
  res.json({ token });
});

// Get user profile - protected by CSRF for demo purposes
apiRouter.get('/user-profile', csrfProtection, (req: Request, res: Response) => {
  // In a real app, you'd get this from a database
  res.json({
    name: 'Demo User',
    email: 'user@example.com'
  });
});

// Update user profile - protected by CSRF
apiRouter.post('/update-profile', csrfProtection, (req: Request, res: Response): void => {
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
    return;
  }

  // In a real app, you'd update in a database
  console.log('Profile update successful with CSRF protection', { name, email });

  // Return success
  res.json({
    success: true,
    message: 'Profile updated successfully'
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Error handler for CSRF errors
app.use((err: any, req: Request, res: Response, next: express.NextFunction): void => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      success: false,
      message: 'CSRF attack detected! Form submission blocked.'
    });
    return;
  }

  // Handle other errors
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
