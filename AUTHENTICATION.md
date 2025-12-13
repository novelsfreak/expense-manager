# Authentication Setup

Your Expense Manager now has secure authentication! Only you (or users you create) can access the application.

## 🔐 Features

- **User Registration**: Create your account with username, email, and password
- **Secure Login**: JWT token-based authentication
- **Protected Routes**: All expense APIs require authentication
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **Session Management**: Tokens stored in localStorage (30-day expiration)
- **User Isolation**: Each user only sees their own expenses

## 🚀 First Time Setup

### 1. Create Your Account

When you first run the app, you'll see a login screen. Click "Sign up" to create your account:

- **Username**: Choose a unique username (3-30 characters)
- **Email**: Your email address
- **Password**: At least 6 characters

### 2. Set Environment Variables

Make sure your `.env` file includes:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
```

**Important**: Change `JWT_SECRET` to a random string in production!

## 🔒 Security Features

1. **Password Security**
   - Passwords are hashed with bcrypt (10 salt rounds)
   - Never stored in plain text
   - Minimum 6 characters required

2. **JWT Tokens**
   - Tokens expire after 30 days
   - Stored securely in localStorage
   - Automatically verified on each request

3. **Protected API Routes**
   - All expense endpoints require valid JWT token
   - Unauthorized requests return 401 error
   - Users can only access their own expenses

4. **User Isolation**
   - Each expense is linked to a user ID
   - Users cannot see or modify other users' expenses
   - Database queries filtered by user ID

## 📝 Usage

### Login
- Enter your email and password
- Click "Sign In"
- You'll be redirected to the expense manager

### Logout
- Click the "Logout" button in the top right
- Your session will be cleared
- You'll need to login again to access expenses

### Register New User
- Click "Don't have an account? Sign up"
- Fill in username, email, and password
- Click "Sign Up"
- You'll be automatically logged in

## 🛠️ API Endpoints

### Public Endpoints (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Protected Endpoints (Auth Required)
- `GET /api/expenses` - Get user's expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 🔧 Troubleshooting

### "Unauthorized - Please login again"
- Your token may have expired
- Click logout and login again
- Check that JWT_SECRET is set correctly

### Can't login after registration
- Check browser console for errors
- Verify MongoDB connection is working
- Ensure password is at least 6 characters

### Token verification fails
- Clear localStorage: `localStorage.removeItem('authToken')`
- Login again with your credentials

## 🚨 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use HTTPS for all connections
- [ ] Set secure cookie flags if using cookies
- [ ] Enable rate limiting on auth endpoints
- [ ] Add email verification (optional)
- [ ] Implement password reset functionality (optional)
- [ ] Add logging for security events
- [ ] Set up CORS properly for your domain

## 💡 Tips

- **Remember your password**: There's no password reset yet, so keep it safe!
- **Secure JWT_SECRET**: Use a long random string (at least 32 characters)
- **Multiple Users**: Each user account has separate expenses
- **Session Persistence**: Login persists for 30 days unless you logout

