# 🎓 Eat Smart AI Plans (NutriPlan) — Ultimate Viva Defense Guide

> **Mentor Note:** Use this document to prepare for your defense. It is structured to help you answer "What", "Why", and "How" questions with confidence. Remember: You built this. You are the expert.

---

## SECTION 1 – HIGH LEVEL OVERVIEW

**Examiner Question:** "In 2 sentences, what is this project and why does it exist?"

**Your Answer:**
"Eat Smart AI Plans is a **hybrid AI recommendation system** that generates hyper-personalized weekly meal plans based on a user's biological data and dietary constraints. It solves the massive inefficiency of manual diet planning by automating the complex nutritional math using **Machine Learning (KNN)** for accuracy and **LLMs (OpenAI)** for structured reasoning."

**Why this project is important:**
1.  **Obesity & Health Crisis:** Manual tracking is hard; people fail because they don't know *what* to cook to hit their macros.
2.  **Beyond Simple Filtering:** Simple apps just filter "vegan" or "keto". Our system mathematically optimizes for **Calorie, Protein, Carb, and Fat targets** simultaneously using vector space models.

---

## SECTION 2 – COMPLETE SYSTEM ARCHITECTURE

**The "Bird's Eye View" of your code:**

1.  **Frontend (Client Layer)**: Built with **React + TypeScript + Tailwind**. It handles user input (forms), state management (React Context), and visualization (Charts.js).
2.  **API Layer**: **Python Flask**. acts as the bridge. It exposes REST endpoints (e.g., `/recommend`) that the frontend calls.
3.  **Application Logic (The Brain)**:
    *   **Recommendation Engine:** This is a Python class (`RecommendationEngine`) that holds the ML models (KNN, TF-IDF).
    *   **AI Service:** A wrapper around OpenAI GPT-4o to add "human-like" explanation and structure to the plan.
4.  **Data Layer**:
    *   **Dataset:** A sanitized CSV subset of the **Food.com dataset** (recipes, nutrition, tags).
    *   **User Persistence:** **Supabase (PostgreSQL)** stores user profiles and saved plans.

**Data Flow (Memorize This):**
`User Input (React)` → `JSON Payload` → `Flask API` → `Data Cleaning & Validation` → `KNN Vector Search` → `Candidate Selection` → `AI Structuring` → `JSON Response` → `Frontend Rendering`.

---

## SECTION 3 – BACKEND DIRECTORY & FILE-BY-FILE EXPLANATION

This is where they test if you actually wrote the code.

*   `app.py`: The **entry point**. It initializes the Flask app, inputs environment variables, and **registers Blueprints** (routes) so the code stays modular.
*   `routes/`: Contains API endpoints.
    *   `api.py`: General endpoints like `/recommend` (the core feature) and `/meals` (search).
    *   `plans.py`: Handles saving/loading plans to the database (Supabase).
    *   `auth.py` / `admin.py`: User authentication and admin dashboard logic.
*   `core/`: **The most important folder.**
    *   `recommendation_engine.py`: **The Heart**. Loads data, creates TF-IDF matrices, scales features, and runs the KNN algorithm.
    *   `supabase_client.py`: Singleton connection to the database.
*   `services/`: Business Logic.
    *   `recommendation_service.py`: A **Singleton Wrapper** that ensures we only load the heavy ML model *once* when the server starts, not for every request.
    *   `ai_service.py`: Handles the prompt engineering and calls to OpenAI to format the raw meal data into a "Monday-Sunday" plan.
*   `data/`:
    *   `small_data.csv`: Our dataset containing recipe names, nutrition macros, and ingredients.

---

## SECTION 4 – DATASET & PREPROCESSING

**The Data:**
We used the **Food.com dataset** (originally 200k+ recipes), but we optimized it into `small_data.csv` for performance.

**Features Used:**
1.  **Numerical:** Calories, Protein (g), Carbs (g), Fats (g).
2.  **Categorical/Text:** `tags` (e.g., "vegetarian", "easy"), `ingredients`, `name`.

**Preprocessing Steps (Crucial):**
1.  **Parsing:** The raw CSV had nutrition as strings `"[200, 10, ...]"`. We wrote a parser to convert these into actual float columns.
2.  **PDV to Grams Conversion:** The dataset used "% Daily Value". We utilized standard FDA constants (e.g., Protein avg = 50g) to reverse-calculate the actual **grams** for precise math.
3.  **Filtration:** We removed "garbage" data—items with < 200 calories (spices, drinks) that aren't suitable for a meal.

---

## SECTION 5 – RECOMMENDATION ENGINE (THE CORE)

**Why Content-Based?**
We don't have millions of users to do "Collaborative Filtering" (User A likes X, so User B likes X). We have **User Requirements**. We match a user's *needs* (content) to a meal's *attributes* (content).

### Algorithm 1: KNN (K-Nearest Neighbors)
*   **Concept:** "Show me the neighbors that look most like my target."
*   **The Vector:** We create a 4D vector for every meal: `[Calories, Protein, Carbs, Fats]`.
*   **The User Vector:** We calculate the user's specific *per-meal* target (e.g., `[600 cal, 30g protein, ...]` and look for meals closest to this point in 4D space.
*   **Metric:** We use **Euclidean Distance**. The smaller the distance, the perfect the nutritional match.

### Algorithm 2: TF-IDF (Term Frequency-Inverse Document Frequency)
*   **Where used:** Search bar & Diet Filtering.
*   **Why:** If a user searches "Avocado", simple string matching is weak. TF-IDF gives weight to rare, meaningful words. It converts text descriptions into math vectors so we can use **Cosine Similarity** to find relevant meals.

---

## SECTION 6 – STEP-BY-STEP EXECUTION FLOW

1.  **Input:** User sends `{ weight: 70kg, goal: 'muscle-gain', diet: 'vegetarian' }`.
2.  **Calculation:** Backend calculates **TDEE (Total Daily Energy Expenditure)**.
    *   *Example:* TDEE = 2500 cal. Muscle gain goal (+250) = **2750 cal/day**.
    *   Target per meal = 2750 / 3 ≈ **916 cal**.
3.  **Filtering:** The system applies a boolean mask to the Pandas DataFrame to strictly remove non-vegetarian items FIRST.
4.  **Matching (KNN):** It runs KNN on the *filtered* list to find meals closest to 916 cal and high protein.
5.  **Diversification (AI):** The raw top 10 meals might be all "Oatmeal". The **AIService** takes the top candidates and organizes them into a varied plan (Oatmeal -> Salad -> Pasta) for the week.
6.  **Response:** Returns the structured JSON.

---

## SECTION 7 – API DESIGN

**Endpoint:** `POST /api/recommend`
**Request Payload:**
```json
{
  "age": 25,
  "weight": 75,
  "height": 180,
  "gender": "male",
  "goal": "muscle-gain",
  "allergies": ["nuts"],
  "diet_type": "vegan"
}
```
**Response Structure:**
```json
{
  "tdee": 2750,
  "week_plan": {
    "Monday": { "breakfast": {...}, "lunch": {...}, "dinner": {...} },
    ...
  },
  "macro_split_used": { "protein": 0.3, "carbs": 0.4, ... }
}
```

---

## SECTION 8 – NUTRITION CALCULATIONS

**Basal Metabolic Rate (BMR):**
We used the **Mifflin-St Jeor Equation** (it is the standard clinical formula).
*   `Men: 10W + 6.25H - 5A + 5`
*   `Women: 10W + 6.25H - 5A - 161`

**Macros Logic:**
We don't guess. We dynamically shift ratios based on goals:
*   **Weight Loss:** Higher Protein (40%), Lower Carbs (30%).
*   **Muscle Gain:** Moderate Protein (30%), High Carbs (40%) to fuel workouts.

---

## SECTION 9 – FRONTEND ↔ BACKEND INTEGRATION

*   **State:** We use a custom hook `useAuth` for user sessions and `FormContext` to pass the complex wizard data between steps.
*   **Visual Logic:** The "Nutri-Score" graphs on the dashboard use the raw numbers coming back from the API to confirm to the user that the plan actually meets their goals.
*   **Persistence:** When a user logs in, we fetch their `user_id` from Supabase and query the `plans` table to load their dashboard.

---

## SECTION 10 – 15 HARD VIVA QUESTIONS (And Perfect Answers)

**Q1: Why did you use KNN instead of a simple database query?**
**A:** "A database query assumes exact matches (e.g., 'find meal with exactly 500 calories'). Real nutrition is continuous. KNN allows us to find the *nearest* match (e.g., 495 or 505 cal) in multi-dimensional space (calories, protein, fats) simultaneously, which SQL queries cannot optimize efficiently."

**Q2: How do you handle allergies?**
**A:** "We use strict boolean masking before the recommendation step. We check the 'ingredients' and 'text' columns for allergy keywords and drop those rows entirely from the candidate pool before passing them to the model."

**Q3: How does the system scale if you have 1 million users?**
**A:** "The recommendation engine is currently stateless; it computes on the fly. To scale, we would cache the TF-IDF matrix (already done) and potentially use a Vector Database (like Pinecone or Milvus) instead of in-memory KNN to handle millions of recipes efficiently."

**Q4: Is the AI hallucinating recipes?**
**A:** "No. The AI (LLM) is *not* generating recipes. It is only doing the **scheduling**. The underlying recipe data comes from our validated CSV dataset. The AI just picks from the list we give it."

**Q5: What happens if I search for something that doesn't exist?**
**A:** "The TF-IDF search returns a similarity score of 0. We capture this and return a fallback list of popular, healthy meals so the user never sees an empty screen."

**Q6: Why Flask and not Django?**
**A:** "This is a microservice-style architecture primarily focused on ML inference. Django is too heavy and opinionated. Flask gave us the flexibility to easily integrate Pandas and Scikit-Learn without unnecessary overhead."

**Q7: How did you validate accuracy?**
**A:** "We verified the BMR calculations against online medical calculators and manually spot-checked the output meals to ensure their macro sums matched the user's daily targets."

**Q8: Explain the 'cold start' problem.**
**A:** "Content-based systems don't suffer from cold start as much as collaborative ones because we don't need user history. As long as a user gives us their weight and goal, we can generate a plan immediately."

**Q9: What is the time complexity of your recommendation?**
**A:** "Basic KNN search is O(N*D) where N is recipes and D is dimensions. With 40k recipes, this is milliseconds. If N grows, we can use KD-Trees or Ball Trees to reduce it to O(log N)."

**Q10: Why did you convert PDV to grams?**
**A:** "Percent Daily Value is a generic standard (usually based on a 2000 cal diet). Our users have custom calorie needs (e.g., 1500 or 3000). We *had* to normalize to absolute grams to make the math valid for everyone."

**Q11: Can this handle custom foods?**
**A:** "Currently, the database is static (read-only). A future improvement would be allowing users to append their own recipes to the CSV/Database."

**Q12: How secure is the user data?**
**A:** "We use Supabase Authentication which handles JWT tokens securely. The backend only accepts requests with valid user IDs."

**Q13: Why React Context instead of Redux?**
**A:** "The application state (form data, auth) is global but not frequently changing in complex ways. Redux would be boilerplate overkill. Context API was sufficient and cleaner."

**Q14: What was the hardest technical challenge?**
**A:** "Cleaning the nutrition data. The string-formatted lists in the CSV were messy and inconsistent. Writing the parser to reliably extract protein/fat values was crucial for the model to work at all."

**Q15: How does the 'AI Coach' differ from the 'Meal Plan'?**
**A:** "The Plan is deterministic math (KNN). The Coach is generative semantic help (LLM) that answers fuzzy implementation questions like 'how do I meal prep this?'"

---

## SECTION 11 – LIMITATIONS & FUTURE IMPROVEMENTS

**Limitations:**
1.  **Static Dataset:** We cannot currently recommend "new" viral foods unless we update the CSV.
2.  **No Feedback Loop:** The model doesn't currently learn from "rejected" meals (e.g., if a user keeps removing Salad, we should stop showing it).

**Future Improvements:**
1.  **Reinforcement Learning (RL):** To learn user preferences over time.
2.  **Computer Vision:** Allow users to snap a photo of their fridge ingredients, and we generate a plan based on what they *have*.
3.  **Wearable Integration:** Sync with Apple Health/Fitbit to update TDEE automatically based on real activity.

---

## SECTION 12 – FINAL 2-MIN VIVA SUMMARY

**Memorize and speak this verbatim:**

"Eat Smart AI Plans is a full-stack automated nutrition platform. We identified that most diet failures stem from the complexity of nutritional planning. To solve this, we built a hybrid system:

1.  **Strict Math:** We use **Flask** and **Pandas** to calculate precise metabolic needs (BMR/TDEE).
2.  **Machine Learning:** We implemented **KNN** and **Vector Similarity** to match these needs against a dataset of 40,000 real recipes, ensuring the macros align perfectly.
3.  **Generative AI:** We integrated **OpenAI** to handle the 'human' element—organizing these meals into a coherent, varied weekly schedule.

The result is a system that doesn't just 'filter' recipes, but actively **optimizes** a user's nutrition plan in real-time. It is scalable, mathematically sound, and provides immediate value to the end user."

---

## SECTION 13 – "DEFEND YOUR TECH STACK" (The 'Why' Questions)

**Q: Why Python Flask for Backend? Why not Node.js?**
*   **Answer:** "The core of this project is **Data Science and Machine Learning**. Python is the native language of AI (Pandas, Scikit-Learn, NumPy).
    *   Using **Node.js** would require bridging data to a Python script anyway, creating latency.
    *   **Flask** was chosen over Django because it is lightweight. We didn't need Django’s heavy monolithic structure; we needed a fast, flexible microservice to serve JSON to our React frontend."

**Q: Why React & TypeScript?**
*   **Answer:** "We needed a dynamic, single-page application (SPA) experience.
    *   **Type Safety:** TypeScript prevents common runtime errors (like null values in nutrition data) before code is even compiled.
    *   **Component Reusability:** The 'MealCard' and 'NutriGraph' components are reused across the Dashboard and Plan pages, reducing code duplication."

**Q: Why Supabase (PostgreSQL)? Why not MongoDB?**
*   **Answer:** "Data integrity was priority. We have clear relationships: **Users** have many **Meal Plans**.
    *   Relational databases (SQL) enforce this structure strictly.
    *   Supabase also provided out-of-the-box **Authentication** and Row Level Security, allowing us to focus on the ML logic rather than building login systems from scratch."

---

## SECTION 14 – "THE WAR STORIES" (Development Challenges)

**Story 1: The "Dirty Data" Nightmare**
*   **The Problem:** "The dataset (Food.com) provided nutrition values as *strings* of lists (e.g., `'[23.5, 10, ...]'`) and in `% Daily Value` instead of grams."
*   **The Consequence:** The ML model crashed because it can't calculate distance on strings.
*   **The Solution:** "I wrote a robust pre-processing pipeline in `recommendation_engine.py` using `ast.literal_eval` to safely parse these strings into Python lists, and then mathematically converted the Percentage values into Grams using FDA standard reference intakes (e.g., 100% Protein = 50g)."

**Story 2: The "Calorie Target" Mismatch**
*   **The Problem:** "Early on, the KNN model would return meals that matched *calories* perfectly but had terrible macros (e.g., a 500-cal cake slice for a gym diet)."
*   **The Solution:** "I adjusted the feature vector weights. I enforced strict pre-filtering (Boolean Masking) to drop 'junk' food (calories < 200) and ensured the vector space included Protein and Fats as dimensions equal in importance to Calories."

---

## SECTION 15 – CRITICAL CODE SNIPPETS (Memorize These)

If they ask you to show code, open `backend/core/recommendation_engine.py` and explain these specific lines.

**Snippet 1: Vectorizing the User's Request (The "Query")**
```python
# We create a 4-dimensional point in space for the "perfect meal"
query = np.array([[target_calories, target_protein, target_carbs, target_fat]])
query_scaled = self.scaler.transform(query) # Normalize it so calories (500) don't overpower protein (30)
```
*   **Explanation:** "Here, I am creating a mathematical representation of the user's perfect meal. I scale it so that large numbers (like 500 calories) don't dominate the distance calculation compared to small numbers (like 20g fat)."

**Snippet 2: The KNN Search**
```python
distances, indices = self.model.kneighbors(query_scaled, n_neighbors=n_neighbors)
```
*   **Explanation:** "This single line is the brain. It searches the high-dimensional space to find the 'nearest' existing recipes to our theoretical perfect meal."

---

## SECTION 16 – LIVE DEMO SCRIPT (Step-by-Step)

**1. The Hook (Home Page):**
> "We start at the Hero section. Notice the modern UI. I’ll click **'Get Started'**."

**2. The Input (Wizard):**
> "Here, the user inputs their bio-metrics. Let's enter: **Male, 75kg, Goal: Muscle Gain**."
> *(Adding a constraint)*: "And let's say I am **Vegetarian**."

**3. The Magic Moment (Generation):**
> "When I click 'Generate Plan', the backend calculates my TDEE (approx 2600 cal), splits it into macros, and runs the KNN algorithm."
> *(Wait for loading)*... "And here is the result."

**4. The Reveal (Dashboard):**
> "You can see the **Macro Distribution Graph** matches my muscle-gain goal (High Carbs).
> Below, we have a **Monday-to-Sunday Plan**. Notice that every single recommended meal is **Vegetarian**, respecting my hard constraint."

**5. The Utility (Shopping List):**
> "Finally, to make this actionable, I can generate a **Grocery List** which aggregates ingredients from all these meals into a simple checklist."

---

## SECTION 17 – COMPETITOR ANALYSIS (Why You Are Better)

**Vs. MyFitnessPal:**
*   **Matches:** They track what you *ate*.
*   **Us:** We tell you *what* to eat. We are proactive; they are reactive.

**Vs. ChatGPT directly:**
*   **ChatGPT:** Gives you text. "Eat oatmeal."
*   **Us:** We give you structured **Data**: Calories, Macros, Ingredient lists, and exact cooking times, validated against a real database. ChatGPT often "hallucinates" nutrition numbers; our numbers come from the verified Food.com dataset.

**Vs. Generic Recipe Apps:**
*   **Them:** "Here is a list of salads."
*   **Us:** "Here is a salad that specifically hits your 30g Protein target for post-workout recovery."

---

## SECTION 18 – TESTING STRATEGY (How you proved it works)

**1. Component Testing (Frontend):**
"We manually tested props passing in React to ensure that if a user selects 'Vegan', the 'Vegan' flag is correctly passed to the API payload."

**2. Accuracy Testing (Backend):**
"I performed 'Spot Checks'. I manually calculated the BMR for a test user (User X) using a calculator, and compared it to my system's output. They matched within 1%."

**3. Endpoint Testing (Postman):**
"I used Postman to send raw JSON requests to `/api/recommend` to ensure the API handles edge cases—like sending negative weight or missing fields—without crashing (The server returns 400 Bad Request)."
