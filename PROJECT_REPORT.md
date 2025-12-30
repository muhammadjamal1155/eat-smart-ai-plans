# Eat Smart AI Plans - Project Report

## 1. Project Overview
**Eat Smart AI Plans** (NutriPlan) is an intelligent web application designed to generate personalized meal plans based on individual user data. By leveraging Artificial Intelligence and Machine Learning, the system calculates precise nutritional requirements and recommends meals that align with the user's health goals, dietary preferences, and restrictions.

## 2. System Architecture & Tech Stack

### Frontend (Client-Side)
The user interface is built with a modern, responsive stack ensuring a seamless user experience:
*   **Framework**: React (v18) with TypeScript for type-safe, component-based architecture.
*   **Build Tool**: Vite for lightning-fast development and optimized production builds.
*   **Styling**: Tailwind CSS for utility-first styling, combined with **Shadcn UI** (Radix UI) for accessible, pre-built components.
*   **Animations**: Framer Motion for smooth page transitions and interactive elements.
*   **State Management & Routing**: React Router for navigation, React Query for data fetching.
*   **Data Visualization**: Recharts for displaying nutritional insights and analytics.
*   **Form Handling**: React Hook Form with Zod for robust form validation.

### Backend (Server-Side)
The core intelligence resides in a Python-based backend:
*   **Language**: Python.
*   **Data Processing**: Pandas and NumPy for efficient data manipulation and numerical analysis.
*   **Machine Learning**: Scikit-learn for implementing the recommendation algorithms (KNN, Cosine Similarity, TF-IDF).

## 3. Application Flow & Pages

The application is structured into Public and Protected (User) zones:

### Public Pages
*   **Landing Page (Index)**: Introduces the platform, features, and call-to-action.
*   **Authentication**: `Login`, `Register`, and `Reset Password` pages for secure user access.
*   **Information**: `About`, `Contact`, `Careers`, `Press`, `Blog` provide context and support.
*   **Legal**: `Privacy Policy` and `Terms of Service`.

### Protected Pages (User Dashboard)
*   **Dashboard**: The central hub displaying a summary of the user's current plan and progress.
*   **Nutrition Form**: The critical input interface where users enter their details (Age, Weight, Height, Goal, Activity Level, Diet Type, Allergies) to trigger the AI engine.
*   **Meal Plans**: Displays the AI-generated daily meal plan (Breakfast, Lunch, Dinner) with recipes, ingredients, and instructions.
*   **Insights & Analytics**: Visualizes nutritional data, showing how the recommended plan meets specific macro/micro-nutrient targets.
*   **Profile & Settings**: Allows users to manage their account details and app preferences.
*   **Reminders**: Manages notifications for meal times or hydration.

## 4. Recommendation System Logic

The heart of the project is the **Recommendation Engine**, which operates in a multi-step process:

### Step 1: User Profiling & Target Calculation
The system first calculates the user's specific nutritional needs using established scientific formulas:
*   **BMR (Basal Metabolic Rate)**: Calculated using the **Mifflin-St Jeor Equation** based on weight, height, age, and gender.
*   **TDEE (Total Daily Energy Expenditure)**: BMR is multiplied by an activity factor (Sedentary to Extra Active).
*   **Goal Adjustment**:
    *   *Weight Loss*: TDEE - 500 calories.
    *   *Weight Gain*: TDEE + 500 calories.
    *   *Muscle Gain*: TDEE + 250 calories.
*   **Macro Distribution**: Calculates target grams for Protein (30%), Fats (30%), and Carbs (40%).

### Step 2: Data Filtering
Before running algorithms, the dataset is filtered to ensure safety and relevance:
*   **Diet Type**: Filters meals matching tags (e.g., Vegan, Keto, Paleo).
*   **Allergies**: Excludes meals containing specified allergens in their ingredients.

### Step 3: AI Model Tournament (Hybrid Approach)
The engine employs a "Tournament" strategy, running multiple algorithms simultaneously to find the best fit for the specific user request. The model with the lowest **Calorie Error** (difference between target and actual plan calories) is selected as the winner.

**Models Used:**
1.  **K-Nearest Neighbors (KNN)**:
    *   Treats meals as data points in a multi-dimensional space (Calories, Protein, Carbs, Fats).
    *   Finds meals geometrically closest to the user's "ideal meal" nutritional profile (Target Daily / 3).
    *   Uses Euclidean distance metric.

2.  **Cosine Similarity**:
    *   Calculates the cosine of the angle between the user's target nutritional vector and meal vectors.
    *   Focuses on the *ratio* of nutrients rather than just absolute magnitude, ensuring balanced macronutrient distribution.

3.  **TF-IDF (Term Frequency-Inverse Document Frequency)**:
    *   Analyzes text data (Diet Type + Goal) to find meals with matching textual descriptions/tags.
    *   Useful for capturing semantic relevance beyond just numbers.

### Step 4: Meal Selection & Plan Assembly
*   The winning model's top candidates are categorized into **Breakfast**, **Lunch**, and **Dinner**.
*   The system intelligently selects a balanced mix (typically 2 of each) to form a complete daily plan.
*   It ensures variety by checking for unique ingredients (Diversity Score).

## 5. Key Features for Presentation
*   **Personalized AI**: Not a static database; calculates unique targets for every user.
*   **Dynamic Model Selection**: The system self-corrects by choosing the best algorithm for each specific request.
*   **Comprehensive Health Data**: Calculates BMR, TDEE, and specific macro targets.
*   **Visual Analytics**: Users can see exactly how their plan matches their goals through charts.
*   **Modern UI/UX**: Fully responsive, dark-mode compatible, and accessible design.

## 6. AI Insights & Smart Features

### AI Recommendations
This feature acts as a personal health coach, analyzing the user's current nutritional intake against their goals to provide actionable advice.
*   **Dynamic Analysis**: Continuously monitors protein, fiber, and caloric intake to identify gaps in the user's diet.
*   **Priority System**: Flags recommendations as **High**, **Medium**, or **Low** priority based on urgency. For example, a significant protein deficiency for a "Muscle Gain" goal triggers a 'High' alert.
*   **Actionable Suggestions**: Provides direct links to relevant solutions, such as "View Protein-Rich Meals" or "Find High-Fiber Foods," making it easy for users to correct their course immediately.

### Smart Grocery List
An intelligent shopping companion that automatically aggregates ingredients from the generated meal plan, streamlining the meal prep process.
*   **Auto-Generation**: Instantly creates a comprehensive shopping list based on the selected weekly meal plan, ensuring no ingredient is missed.
*   **Smart Categorization**: Automatically groups items by category (e.g., **Produce**, **Meat & Fish**, **Dairy**, **Pantry**) to mimic the layout of a grocery store for efficient shopping.
*   **Management Tools**: Offers robust functionality including:
    *   **Checklist**: Interactive checkboxes to mark items as purchased.
    *   **Export Options**: Users can **Download** the list as a file or **Email** it to themselves for easy access on mobile devices.
    *   **Add from Meal Plan**: One-click integration to pull all necessary ingredients from the current plan.
