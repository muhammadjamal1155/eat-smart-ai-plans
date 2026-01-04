# Eat Smart AI Plans (NutriPlan)

**Eat Smart AI Plans** is an intelligent web application designed to generate personalized meal plans based on individual user data. By leveraging Artificial Intelligence and Machine Learning, the system calculates precise nutritional requirements and recommends meals that align with the user's health goals, dietary preferences, and restrictions.

## 🚀 Key Features

### User Dashboard (Protected)
*   **AI-Powered Meal Plans**: Generates daily breakfast, lunch, and dinner plans using a winning-algorithm tournament strategy (KNN, Cosine Similarity, TF-IDF).
*   **Personalized Intelligence**: Calculates BMR, TDEE, and macro targets based on age, weight, height, and goals.
*   **Smart Grocery List**: Automatically aggregates ingredients from your plan into a categorized shopping list.
*   **Insights & Analytics**: Visual charts showing how your plan meets your nutritional targets.
*   **Dietary Filtering**: robust support for diets (Vegan, Keto, Paleo) and allergy exclusions.

### Public Pages
*   **Landing Page**: Overview of features and value proposition.
*   **Authentication**: Secure Login, Registration, and Password Reset flows.
*   **Informational**: About Us, Contact, and Legal pages.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (v18) with TypeScript.
*   **Build Tool**: [Vite](https://vitejs.dev/) for fast development.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives).
*   **State Management**: React Context + React Query (@tanstack/react-query).
*   **Forms**: React Hook Form + Zod validation.
*   **Visualizations**: Recharts.

### Backend
*   **Server**: Python [Flask](https://flask.palletsprojects.com/).
*   **Data Processing**: Pandas & NumPy.
*   **Machine Learning**: Scikit-learn (KNN, Cosine Similarity, TF-IDF).
*   **API**: RESTful endpoints.

## ⚙️ Prerequisites

*   **Node.js** (v18+ recommended)
*   **Python** (v3.8+ recommended)
*   **npm** (comes with Node.js)

## 📦 Installation & Setup

Follow these steps to run the full application locally.

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd eat-smart-ai-plans
```

### 2. Backend Setup (Python)
The backend runs on port `5000`.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Activate the virtual environment:
    *   **Windows**:
        ```powershell
        ..\venv\Scripts\activate
        ```
    *   **Mac/Linux**:
        ```bash
        source ../venv/bin/activate
        ```
    *(Note: The virtual environment is located in the project root)*

3.  Install dependencies (if needed):
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the server:
    ```bash
    python app.py
    ```
    > The server will start at `http://127.0.0.1:5000`.

### 3. Frontend Setup (React)
The frontend runs on port `8080`.

1.  Open a new terminal window in the project root.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install Node dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    > The application will open at `http://localhost:8080`.

## 📖 Usage

1.  **Register/Login**: Create an account to access the dashboard.
2.  **Complete Profile**: Enter your physical stats (Age, Weight, Height) and Goals (Lose Weight, Muscle Gain, etc.) in the **Nutrition Form**.
3.  **Generate Plan**: The AI will process your data and unique preferences to build a custom meal plan.
4.  **View Insights**: Check the "Insights" tab to see nutritional breakdowns.
5.  **Get Groceries**: Go to the "Grocery List" to see what you need to buy.

## 📂 Project Structure

```
├── backend/                # Python Flask Backend
│   ├── app.py             # API Entry Point
│   ├── core/              # Core Logic (Recommendation Engine)
│   ├── routes/            # API Routes
│   ├── services/          # Business Logic Services
│   ├── scripts/           # Utility Scripts
│   └── data/              # Dataset (CSV/JSON)
├── frontend/               # React Frontend
│   ├── src/               # Source Code
│   │   ├── components/    # Reusable UI Components
│   │   ├── pages/         # Route Pages
│   │   ├── contexts/      # Global State
│   │   └── lib/           # Utilities
│   └── public/            # Static Assets
└── venv/                   # Python Virtual Environment
```

## 📄 License
This project is for educational and personal use.
