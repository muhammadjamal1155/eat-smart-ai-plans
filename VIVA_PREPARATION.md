# Eat Smart AI Plans - Viva Preparation Guide

## 1. Introduction (The Elevator Pitch)
**Examiner:** "Tell us briefly about your project."

**Answer:**
"Eat Smart AI Plans is a **Hybrid Intelligent Nutrition System**. Unlike standard diet apps that give generic plans, this is a web application that acts as a 'Digital Dietitian.' It calculates a user's exact biological needs using the **Mifflin-St Jeor equation** and then uses a **multi-model AI approach**—combining **K-Nearest Neighbors (KNN)** for nutritional precision and **Generative AI (LLM)** for reasoning—to generate a fully personalized 7-day meal plan. My goal was to solve the problem of 'generic advice' by making nutrition mathematically accurate yet accessible."

---

## 2. Core Algorithms & Mathematics (The "Hard" Technical Questions)

### Q1: Which Machine Learning models did you use and why?
**Answer:** "I used a **Hybrid Architecture** consisting of three parts:
1.  **TF-IDF & Cosine Similarity:** For semantic search (e.g., filtering out allergies or matching 'vegan' tags).
2.  **K-Nearest Neighbors (KNN):** This is the core engine. It uses **Euclidean Distance** to find recipes that mathematically match the user's specific protein, carb, and fat targets.
3.  **GPT-4o (LLM):** For structuring the weekly plan and providing the 'human' reasoning, ensuring variety."

### Q2: Why KNN? Why not Collaborative Filtering or Deep Learning?
**Answer:**
*   **No Cold Start Problem:** Collaborative Filtering requires user history (likes/clicks). My system is **Content-Based**—it relies on the user's *Biology* (Height/Weight), so it works instantly for new users.
*   **Precision:** KNN ensures mathematical accuracy for nutrition values using Euclidean distance.
*   **Interpretability:** Unlike Black Box Deep Learning, KNN matches are explainable ("This meal is closest to your target").

### Q3: Mathematical Formulas Used
1.  **BMR (Basal Metabolic Rate):** Calculated using the **Mifflin-St Jeor Equation**.
    *   *Formula:* `(10 * weight) + (6.25 * height) - (5 * age) + s` (+5 for men, -161 for women).
2.  **TDEE (Total Daily Energy Expenditure):** `BMR * Activity Multiplier` (e.g., 1.2 for Sedentary).
3.  **Goal Logic:**
    *   Weight Loss: `TDEE - 500 calories`
    *   Weight Gain: `TDEE + 500 calories`
4.  **Vector Matching (Euclidean Distance):**
    *   Formula: `sqrt((User_Cal - Recipe_Cal)^2 + (User_Pro - Recipe_Pro)^2 ...)`
    *   Used to find recipes geometrically closest to the user's needs.
5.  **Text Similarity (Cosine Similarity):**
    *   Used for searching recipes by name/tag. Measures the angle between the query vector and recipe text vector involved.

---

## 3. System Workflow (Architecture)
**Examiner:** "Walk us through the flow when I click 'Generate'."

1.  **Input (Frontend):** User submits Profile (Weight, Aim, etc.) via React.
2.  **Calculation (Backend):** Flask calculates BMR, TDEE, and precise Macro Targets (e.g., 150g Protein).
3.  **Filtering (Pandas):** The system applies **Hard Filters** (Diet Type, Allergies) to the 8,260-recipe dataset using TF-IDF logic.
4.  **Matching (KNN):** The engine runs **KNN** to find the top 50 recipes that match the calculated Macro Targets (normalized using Z-Score).
5.  **Structuring (LLM):** The top 50 candidates are sent to **OpenAI (GPT-4o)**, which selects 21 unique meals for the week to ensure variety and generates a "Reasoning" summary.
6.  **Response:** The final JSON is sent to React to render the Dashboard and Charts.

---

## 4. Data & Engineering

### Q4: Data Source & Cleaning
**Answer:**
*   **Source:** **Food.com Dataset** (Kaggle).
*   **Cleaning:** Reduced from 36,000 to **~8,260 records**.
    *   Removed items with no images.
    *   Removed outliers (e.g., cooking time > 1000 mins).
    *   Parsed stringified nutritional lists (`"[12, 4]"` -> `[12, 4]`).

### Q5: Tech Stack Justification
*   **Frontend: React (TypeScript)** - For a responsive, component-based UI (Meal Cards, Graphs).
*   **Backend: Python (Flask)** - Chosen for native support of Data Science libraries (Pandas, Scikit-learn).
*   **AI: OpenAI API** - For generative reasoning and variety.

### Q6: Scalability
**Answer:** "Currently, it uses an in-memory DataFrame for speed (<100ms response). To scale to 100k users, I would:
1.  Use a Vector Database (Pinecone/pgvector) instead of in-memory KNN.
2.  Implement Redis Caching for common profiles.
3.  Containerize with Docker."

---

## 5. Testing & Validation

### Q7: How do you validate recommendations?
**Answer:** "Since there is no 'ground truth' (I don't know what users *would* eat), I used **Qualitative Validation**:
1.  **Constraint Checking:** Verified that 'Weight Loss' plans never exceed the calorie ceiling.
2.  **Logic Checking:** Verified that 'Vegan' filters return 0 meat recipes.
3.  **User Acceptance:** Peer testing confirmed the visualization (Charts) helped them understand the data."

### Q8: What if a user enters invalid data? (Edge Cases)
**Answer:**
*   **Unrealistic BMR:** If inputs result in a dangerous calorie count (<1200), the system defaults to the WHO safety minimum (1200 kcal).
*   **No Results:** If filters are too strict (e.g., "Vegan + Carnivore"), a fallback mechanism relaxes constraints to show "Safe Bet" highly-rated recipes instead of an empty screen.

---

## 6. Security, Ethics & Future Work

### Q9: Security
*   **Passwords:** Securely handled via Supabase Auth (or hashing).
*   **API Keys:** Managed via `.env` variables, never hardcoded.

### Q10: Ethics
*   **Guardrails:** The system has specific logic to prevent recommending starvation diets (min 1200 cal).
*   **Disclaimer:** Clearly states it is a lifestyle tool, not a medical device.

### Q11: Future Improvements
1.  **Wearable Integration:** Sync with Fitbit/Apple Health for real-time TDEE.
2.  **Image Recognition:** Snap a photo to log calories.
3.  **Shopping Integration:** Export grocery list to Instacart/Amazon.

---

## 7. Common "Trap" Questions
*   **"Is this AI?"** -> Yes. It uses Unsupervised Learning (KNN) for clustering/retrieving and Generative AI (LLM) for reasoning.
*   **"Why Normalize Data?"** -> To ensure Calories (large numbers) don't dominate Fats (small numbers) in the distance calculation.
*   **"Time Complexity?"** -> KNN brute force is $O(N \times D)$. For 8000 rows, it's instant. For millions, I'd use KD-Trees ($O(\log N)$).

---
**Summary Checklist:**
*   [ ] Laptop charged & Server running (`npm run dev` + `python app.py`).
*   [ ] Tabs ready: Code, Browser, Dataset.
*   [ ] Confidence: You built a Full-Stack AI app. Own it!
