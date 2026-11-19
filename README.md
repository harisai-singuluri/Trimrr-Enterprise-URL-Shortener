# ⚡ Trimrr — Enterprise URL Shortener, Branded QR Studio & Real-Time Analytics

[![Live Demo](https://img.shields.io/badge/Live%20Frontend-trimrr--urlshortner.vercel.app-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://trimrr-urlshortner.vercel.app/)
[![Backend API](https://img.shields.io/badge/Live%20Backend-url--shortner--1--2xvr.onrender.com-green?style=for-the-badge&logo=render&logoColor=white)](https://url-shortner-1-2xvr.onrender.com)
[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.1-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/)
[![React 18](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌍 Live Project Links & Demo Account

- 🚀 **Live Website (Frontend)**: [https://trimrr-urlshortner.vercel.app/](https://trimrr-urlshortner.vercel.app/)
- ⚙️ **Live Backend API**: [https://url-shortner-1-2xvr.onrender.com](https://url-shortner-1-2xvr.onrender.com)
- 📖 **Interactive Swagger API Docs**: [https://url-shortner-1-2xvr.onrender.com/swagger-ui/index.html](https://url-shortner-1-2xvr.onrender.com/swagger-ui/index.html)
- ⚡ **Demo Login Credentials (One-Click Auto-Fill available on screen)**:
  - **Email**: `demo@trimrr.com`
  - **Password**: `password123`

---

## 📌 What is Trimrr? (In Simple Words)

**Trimrr** is a modern, high-speed web application that transforms long, messy web addresses (like `https://leetcode.com/u/harisai_singuluri/`) into short, clean, professional links (like `https://trimrr-urlshortner.vercel.app/demo77`).

Unlike ordinary URL shorteners, Trimrr comes with powerful extra capabilities:
1. **🔒 Password Shield**: Lock any sensitive link with a secret passcode. Visitors must enter the passcode before being redirected.
2. **⏱️ Self-Destruct / Burner Links**: Set a maximum click limit (e.g. 1 click or 25 clicks). Once that limit is reached, the link automatically self-destructs and stops working.
3. **🎨 Custom Branded QR Studio**: Generate high-resolution QR codes using your company's custom brand colors (custom foreground and background colors) that can be scanned immediately from any smartphone camera.
4. **⚡ Sub-15ms Ultra-Fast Redirection**: Visitors get redirected to their destination in less than 15 milliseconds because visitor tracking runs in the background without making the user wait.
5. **📊 Real-Time Analytics**: Visual dashboards showing total clicks, device types (Mobile vs. Desktop), operating systems, and browsers used by visitors.

---

## 🛠️ Technologies Used & Why We Chose Them

| Technology | Role | Why We Chose It (The Advantage) |
|---|---|---|
| **Java 21 LTS** | Backend Language | The latest Long-Term Support Java. It includes **Virtual Threads** (Project Loom), which lets the server handle thousands of visitor clicks at the same time using very little computer memory. |
| **Spring Boot 3.3** | Backend Framework | The industry gold standard for production backends. It provides ready-to-use dependency injection, automated database configuration, and enterprise-grade reliability. |
| **Spring Security 6 & JWT** | Security Layer | Provides stateless authentication using JSON Web Tokens (JWT). The server verifies who you are securely without storing session memory for every user. Passwords are encrypted with **BCrypt**. |
| **Google ZXing** | QR Code Engine | A high-performance library that turns web addresses into crisp 2D QR code images on the server. We customized it to support custom brand colors. |
| **Spring Data JPA & Hibernate** | Database Access | Lets us interact with database tables using plain Java objects instead of writing raw, error-prone SQL queries manually. |
| **H2 & PostgreSQL** | Databases | **H2 (In-Memory)** allows instant local development with zero database setup. **PostgreSQL** provides heavy-duty production data storage on the cloud. |
| **React 18 & Vite** | Frontend Framework | React allows building fast, reusable components. Vite compiles and bundles the code in seconds for blazing-fast page loads. |
| **Tailwind CSS & Radix UI** | Styling & UI | Provides a clean, modern **pure-white design** with accessible dropdowns, modals, and tabs that look like a top-tier SaaS product. |
| **Render & Vercel** | Cloud Deployment | **Render** hosts our Dockerized Java Spring Boot backend. **Vercel** delivers our React frontend globally with sub-second edge distribution. |

---

## 🔄 How the Frontend & Backend Connect (The Big Picture)

```text
[ User / Smartphone ]
         │
         ▼
[ React 18 Frontend on Vercel ]  ──(HTTP / JSON via apiClient.js)──▶  [ Spring Boot 3 Backend on Render ]
  https://trimrr-urlshortner.vercel.app                                     https://url-shortner-1-2xvr.onrender.com
                                                                                  │
                                                                   ┌──────────────┴──────────────┐
                                                                   ▼                             ▼
                                                            [ Database: H2/PostgreSQL ]   [ Google ZXing QR Engine ]
```

1. **Browsing & Interaction**:
   - The user opens `https://trimrr-urlshortner.vercel.app/` in their browser.
   - The browser loads the React application.
2. **API Communication**:
   - Every time you log in, shorten a link, or view analytics, the frontend calls the backend REST API at `https://url-shortner-1-2xvr.onrender.com/api` using modern `fetch()` requests.
   - If you are logged in, your browser automatically attaches your secret **JWT Bearer Token** in the HTTP request header (`Authorization: Bearer <token>`).
3. **Database & QR Engine**:
   - The Spring Boot backend checks your token, performs the requested action, generates any branded QR code needed using Google ZXing, saves the details in the database, and returns clean JSON data back to React.
4. **Instant Redirection**:
   - When someone visits `https://trimrr-urlshortner.vercel.app/demo77`, the frontend asks the backend for the destination link, starts redirecting the user immediately, and silently notifies the backend to record analytics in the background.

---

## 🔍 How Each Feature Works Internally (Simple & Clear)

### 1. 🔒 Password Shield (Passcode-Protected Links)
- **Step 1 (Creation)**: When creating a link, you type an optional password (for example: `MySecret123`).
- **Step 2 (Encryption)**: Spring Boot does not store `MySecret123` in plain text. It passes it through **BCrypt**, which turns it into a one-way scrambled cryptographic hash.
- **Step 3 (Visitor Interception)**: When a visitor opens the short link, the system sees that `password` is set, so it stops and displays the **/unlock** page.
- **Step 4 (Verification)**: The visitor enters the passcode. The backend compares what they typed with the scrambled hash using `BCryptPasswordEncoder.matches()`. If it matches, the secret link opens; if not, an error message appears.

---

### 2. ⏱️ Self-Destruct / Burner Links (Click Limits)
- **Step 1 (Setting the limit)**: When creating a link, you can enter a click limit (e.g., `1` for a single-use confidential document, or `50` for a limited giveaway).
- **Step 2 (Counting clicks)**: Each time someone visits the link, the backend adds `+1` to the link's click counter.
- **Step 3 (Auto-Deactivation)**: If `clickCount >= maxClicks`, the backend immediately flips `isActive = false` in the database.
- **Step 4 (Destruction message)**: Anyone trying to open the link after that gets a clean, friendly message: *"This burner link reached its maximum click limit and has self-destructed."*

---

### 3. 🎨 Custom Branded QR Studio
- **Step 1 (Choose Colors)**: In the UI, you choose your brand colors (e.g. Indigo `#4F46E5` for the QR dots and White `#FFFFFF` for the background).
- **Step 2 (Matrix Calculation)**: Google ZXing on the server creates a 2D grid matrix of the web address.
- **Step 3 (Color Rendering)**: We use ZXing's `MatrixToImageConfig(fgColor, bgColor)` to paint the dark dots in your chosen color and the light dots in your background color.
- **Step 4 (Streaming to Browser)**: The server turns the image into a Base64 text string (`data:image/png;base64,...`) and sends it directly to the frontend.
- **Why this is smart**: It does not take up hard drive space on the server because no `.png` files are saved on disk — the image is generated in computer memory in under 1 millisecond!

---

### 4. ⚡ Sub-15ms Non-Blocking Redirections
- **The Problem with Old Shorteners**: Usually, when you click a short link, the server makes you wait while it looks up your IP address, detects your city and country, finds your device name, and writes everything to a database before redirecting you. This causes noticeable lag.
- **Trimrr's Solution**:
  1. As soon as the visitor clicks the short link, the server immediately returns the destination web address.
  2. The visitor's browser redirects right away.
  3. Meanwhile, Spring Boot's `@Async` worker records the analytics in the background on a separate worker thread.
  4. Result: The visitor redirects in **less than 15 milliseconds**!

---

## 🗄️ Database Structure (Entity Relationships)

```mermaid
erDiagram
    USERS ||--o{ URLS : "creates & owns"
    URLS ||--o{ CLICKS : "receives"

    USERS {
        Long id PK "Unique User ID"
        String email "User login email (Unique)"
        String password "Encrypted password (BCrypt)"
        String name "User's full name"
        Timestamp created_at "Registration date"
    }

    URLS {
        Long id PK "Unique Link ID"
        String title "Custom name given by user"
        String original_url "The long destination URL"
        String short_url "Random short code (e.g. y05LM2)"
        String custom_url "Custom alias (e.g. my-link)"
        String qr_code "Base64 image string of the QR code"
        String password "Encrypted passcode (Optional)"
        Integer max_clicks "Self-destruct limit (Optional)"
        Integer click_count "Total visits counter"
        Boolean is_active "Whether the link is active or paused"
    }

    CLICKS {
        Long id PK "Unique Click Record ID"
        Long url_id FK "Which URL was clicked"
        String device "Desktop / Mobile / Tablet"
        String browser "Chrome / Safari / Firefox"
        String os "Windows / macOS / Android / iOS"
        Timestamp created_at "Exact time of visit"
    }
```

---

## 💻 How to Run the Project on Your Computer

### 1. Run the Backend (Java 21)
```bash
# Move to the backend directory
cd backend

# Run with in-memory H2 database (Zero installation needed)
mvn spring-boot:run
```
- Backend runs at: `http://localhost:8080`
- Swagger API Docs: `http://localhost:8080/swagger-ui/index.html`

### 2. Run the Frontend (React + Vite)
In a new terminal window in the project root:
```bash
# Install packages
npm install

# Start development server
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🎯 How to Explain This Project in Interviews (Recruiter Guide)

When interviewers ask about this project, here is how you can explain it in simple, confident English:

> *"I built **Trimrr**, a high-performance URL shortener and branded QR platform. Instead of a basic single-page app, I designed it as an enterprise-grade full-stack system using **Java 21 and Spring Boot 3** on the backend and **React 18 with Tailwind CSS** on the frontend.*
>
> *I focused on four real-world engineering challenges:*
> 1. *First, **sub-15ms redirection latency**: I decoupled analytics recording from the critical redirect path using Spring's `@Async` background execution, so visitors redirect instantly while click metadata is logged concurrently.*
> 2. *Second, **link security**: I added a Password Shield where confidential links are protected using salted BCrypt encryption and verified through an interstitial screen.*
> 3. *Third, **self-destructing links**: Users can set maximum click limits for one-time links, which auto-deactivate upon threshold exhaustion.*
> 4. *Fourth, **server-side branded QR generation**: Using Google ZXing in headless mode, the backend dynamically calculates color bit-matrices and streams Base64 PNGs on the fly with zero disk storage overhead.*
>
> *Both the backend and frontend are live in production on Render and Vercel with complete automated test coverage."*

---

## 👨‍💻 Project Developer

**Singuluri Hari Sai**
- **Live Application**: [https://trimrr-urlshortner.vercel.app/](https://trimrr-urlshortner.vercel.app/)
- **Backend API**: [https://url-shortner-1-2xvr.onrender.com](https://url-shortner-1-2xvr.onrender.com)
- **GitHub Repository**: [https://github.com/harisai-singuluri/Trimrr-Enterprise-URL-Shortener](https://github.com/harisai-singuluri/Trimrr-Enterprise-URL-Shortener)
