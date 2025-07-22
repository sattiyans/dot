# Dot - Backend Setup Guide

This guide will help you set up the Supabase backend and authentication for the Dot application.

## 🚀 Quick Start

### 1. Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set Environment Variables**
   - Copy `env.example` to `.env.local`
   - Fill in your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Database Setup

1. **Run the SQL Schema**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL to create tables and policies

2. **Verify Tables Created**
   - Check that the following tables exist:
     - `users`
     - `sites`
     - `conversations`

### 3. Authentication Setup

1. **Configure Auth Settings**
   - In Supabase Dashboard → Authentication → Settings
   - Set your site URL (e.g., `http://localhost:3000`)
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/admin`
     - `http://localhost:3000/account`

2. **Email Templates (Optional)**
   - Customize email templates in Authentication → Email Templates
   - Update the magic link email template with your branding

### 4. Row Level Security (RLS)

The SQL schema includes RLS policies that:
- Users can only access their own data
- Site owners can view conversations for their sites
- Public access is restricted appropriately

## 🔧 Features Implemented

### ✅ Authentication
- **Magic Link Authentication** - Passwordless login via email
- **Session Management** - Automatic session handling
- **Protected Routes** - Admin and account pages require authentication
- **Middleware Protection** - Server-side route protection

### ✅ Database Schema
- **Users Table** - User profiles and metadata
- **Sites Table** - Chatbot sites with metrics
- **Conversations Table** - Chat history and analytics
- **Automatic Timestamps** - Created/updated timestamps
- **Foreign Key Relationships** - Proper data integrity

### ✅ Security
- **Row Level Security** - Data access control
- **JWT Authentication** - Secure token-based auth
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Type-safe database operations

## 🛠️ Development

### Running the Application

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Testing Authentication

1. **Visit the landing page** (`http://localhost:3000`)
2. **Click the chatbot widget** and enter your email
3. **Check your email** for the magic link
4. **Click the link** to authenticate
5. **You'll be redirected** to the admin dashboard

### Database Operations

The application includes TypeScript types for all database operations:

```typescript
import { Tables, Inserts, Updates } from '@/lib/supabase'

// Example: Creating a new site
const newSite: Inserts<'sites'> = {
  user_id: user.id,
  name: 'My Website',
  domain: 'example.com'
}
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly

### Database Security
- RLS policies ensure data isolation
- All queries are parameterized
- No raw SQL injection vulnerabilities

### Authentication Security
- Magic links expire automatically
- Sessions are managed securely
- HTTPS required in production

## 🚀 Production Deployment

### Environment Variables
```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Supabase Production Settings
1. **Update Site URL** in Authentication settings
2. **Add production redirect URLs**
3. **Enable email confirmations** if needed
4. **Set up monitoring** and logging

## 📊 Monitoring

### Supabase Dashboard
- Monitor database performance
- Check authentication logs
- Review RLS policy effectiveness

### Application Logs
- Check browser console for client-side errors
- Monitor server-side logs in production
- Track authentication success/failure rates

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Check environment variables
   - Verify Supabase project settings
   - Ensure redirect URLs are correct

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure tables exist

3. **Magic Link Not Received**
   - Check spam folder
   - Verify email templates
   - Check Supabase logs

### Getting Help

- Check Supabase documentation
- Review application logs
- Test with different email addresses
- Verify all environment variables are set

## 🎯 Next Steps

After setting up authentication, you can:

1. **Implement real data fetching** in admin pages
2. **Add site management** functionality
3. **Integrate OpenAI** for chatbot responses
4. **Add analytics** and reporting features
5. **Implement webhook** handling for real-time updates

---

**Need help?** Check the Supabase documentation or create an issue in the repository. 