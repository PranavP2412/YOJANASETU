# 🚀 YojanaSetu - AI-Powered Government Scheme Discovery

> **Bridging the gap between Entrepreneurs and Government Funding.**
)
![Project Banner]
*(Replace this link with a screenshot of your Landing Page)*

## 📖 About The Project

Finding the right government scheme (Grant, Loan, or Subsidy) is often like finding a needle in a haystack. With thousands of schemes available, entrepreneurs struggle to identify which ones they actually qualify for.

**YojanaSetu** is a smart platform that solves this problem. We don't just search; we **consult**. By analyzing a user's business profile (Turnover, Sector, Stage, Needs), our AI engine filters through the noise and recommends the top schemes with a calculated **Match Score**.

---

## ✨ Key Features

- **🤖 AI Recommendation Engine:** Uses OpenAI to analyze eligibility criteria and rank schemes based on user profile.
- **📊 Match Score & Reasoning:** Doesn't just list schemes; tells you *why* it fits (e.g., "95% Match - Fits your Manufacturing sector needs").
- **🔍 Smart Discovery:** Hybrid search system combining MongoDB text search with AI reasoning.
- **🏢 Business Profile Management:** Users can update their turnover, sector, and needs to get real-time updated recommendations.
- **🔖 Bookmark & Save:** Save promising schemes to your dashboard for later application.
- **📱 Responsive Design:** Built with React & Tailwind CSS for a seamless experience on mobile and desktop.
- **🔐 Secure Authentication:** JWT-based robust authentication system.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Axios** (API integration)

### Backend
- **Node.js** & **Express.js**
- **OpenAI API** (Intelligence layer)
- **Mongoose** (ODM)

### Database
- **MongoDB** (Data storage)

---

## 🧠 How the Recommendation Engine Works

We built a unique **3-Stage Filtering Process** to ensure speed and accuracy:

1.  **Pre-Filtering (Database Layer):** - The system runs a smart Regex & Tag search on the database to shortlist ~50 relevant candidates based on the user's Sector and Needs.
2.  **AI Analysis (Intelligence Layer):**
    - These candidates are sent to the OpenAI model along with the User's Profile.
    - The AI reads the complex "Eligibility" text of each scheme.
3.  **Ranking & Scoring:**
    - The AI returns the **Top 5** schemes, assigning a **Match Score (0-100%)** and a one-line **Reason** for the recommendation.

---

## 📸 Screenshots

| Landing Page | Recommendation Page |
|:---:|:---:|
| ![Landing](https://via.placeholder.com/400x200?text=Landing+Page) | ![Recommend](https://via.placeholder.com/400x200?text=AI+Results) |

| Scheme Details | Dashboard |
|:---:|:---:|
| ![Details](https://via.placeholder.com/400x200?text=Scheme+Details) | ![Dashboard](https://via.placeholder.com/400x200?text=User+Dashboard) |

*(Upload your actual screenshots to the repo and link them here)*

---

## 🚀 Getting Started locally

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/yojanasetu.git](https://github.com/your-username/yojanasetu.git)
cd yojanasetu
