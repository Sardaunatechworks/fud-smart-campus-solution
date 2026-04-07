# 🎓 FUD Smart Campus Solution - Lost & Found Platform

![FUD Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

**FUD Smart Campus Solution** is a modern, student-centric platform designed for the **Federal University Dutse (FUD)** community. It simplifies the process of recovering lost items and reporting found belongings on campus through a centralized, secure, and user-friendly interface.

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Smart Dashboard**: Personalized overview of campus activity and item statistics.
- **Reporting System**: Easily report "Lost" or "Found" items with detailed descriptions and image uploads.
- **Browse & Search**: Filter items by category (Phones, ID Cards, Laptops, etc.) and search by location or name.
- **Secure Contact**: Reach out to owners or finders directly via protected email information.

### 👮 For Administrators
- **Moderation Panel**: Review, approve, or reject pending item reports to ensure platform integrity.
- **User Management**: Monitor student accounts and suspend/activate users as needed.
- **Real-time Stats**: Track system-wide activity, from total users to success rates.

---

## 🛠️ Technology Stack

- **Frontend**: 
  - [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
  - [Tailwind CSS 4](https://tailwindcss.com/) for a premium, responsive UI.
  - [Lucide React](https://lucide.dev/) for intuitive iconography.
  - [Motion](https://motion.dev/) for smooth, professional animations.
- **Backend-as-a-Service**:
  - [Supabase](https://supabase.com/) for Authentication and PostgreSQL Database.
- **Deployment**:
  - [Vercel](https://vercel.com/) (Optimized for SPA routing).

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- A Supabase Project ([Create one here](https://supabase.com/))

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sardaunatechworks/fud-smart-campus-solution.git
   cd fud-smart-campus-solution
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🗄️ Database Schema & Triggers (Supabase)

The system relies on a PostgreSQL schema with Row Level Security (RLS) for data protection.

### 1. Database Setup
Run the following SQL in your Supabase SQL Editor:
- **`profiles` table**: Extends Auth data to store roles and matric numbers.
- **`items` table**: Stores lost/found item reports.
- **Security Policies**: Enables RLS so students can only modify their own reports.

### 2. Auto-Profile Trigger
This trigger automatically creates a entry in `public.profiles` whenever a student signs up:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🌍 Vercel Deployment

This project is configured for seamless deployment on Vercel.

1. **Import the repository** into Vercel.
2. **Add Environment Variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are added in the Vercel Dashboard.
3. **SPA Routing**: The included `vercel.json` ensures that client-side routing works correctly (preventing 404 on refresh).

---

## 🤝 Contributing & Credits

Developed by **Sardaunatechworks** for the **Federal University Dutse**. 

*If you find this project helpful, give it a ⭐ on GitHub!*
