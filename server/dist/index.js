"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, morgan_1.default)('dev')); // Logging
app.use(express_1.default.json()); // Parse JSON body
app.use((0, cookie_parser_1.default)()); // Parse cookies
// Configure CORS - in production this would be more restrictive
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200', // Angular app URL
    credentials: true // Allow cookies to be sent
}));
// CSRF Protection middleware
const csrfProtection = (0, csurf_1.default)({
    cookie: {
        key: '_csrf', // Name of the cookie
        httpOnly: true,
        sameSite: 'strict', // Help prevent CSRF
        secure: process.env.NODE_ENV === 'production' // HTTPS only in production
    }
});
// API routes
const apiRouter = express_1.default.Router();
// Get CSRF token - this sets the CSRF cookie and returns a token
apiRouter.get('/csrf-token', csrfProtection, (req, res) => {
    // This generates a token based on the secret in the cookie
    const token = req.csrfToken();
    res.json({ token });
});
// Get user profile - protected by CSRF for demo purposes
apiRouter.get('/user-profile', csrfProtection, (req, res) => {
    // In a real app, you'd get this from a database
    res.json({
        name: 'Demo User',
        email: 'user@example.com'
    });
});
// Update user profile - protected by CSRF
apiRouter.post('/update-profile', csrfProtection, (req, res) => {
    const { name, email } = req.body;
    // Validate input
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Name and email are required'
        });
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
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            success: false,
            message: 'CSRF attack detected! Form submission blocked.'
        });
    }
    // Handle other errors
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
    next();
});
// Start server
app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});
