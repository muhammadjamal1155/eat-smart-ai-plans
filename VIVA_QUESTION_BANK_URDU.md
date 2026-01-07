# Comprehensive Viva Question Bank & Answers (Roman Urdu Edition)
## Eat Smart AI Plans

---

## 🌎 GENERAL PROJECT QUESTIONS

### 1. What is the main problem your project solves? (Ye project kya masla hal karta hai?)
**Answer:** Ye "Generic Nutrition Advice" ka masla hal karta hai. Zyadatar dieting apps sab ko same "1500 calorie" ka plan pakra deti hain jo har kisi ke liye sahi nahi hota. Mera system har user ki body (weight/height) ke hisaab se **Calculated** aur **Personalized** plan banata hai.

### 2. Why did you choose diet recommendation? (Diet recommendation he kyun chuna?)
**Answer:** Kyun ke Nutrition asal mein ek **Data Science problem** hai. Calories aur Macros ko balance karna insaan ke liye mushkil hai lekin computer ke liye bohot aasaan. Aur aaj kal obesity aur health issues barh rahe hain, to iska social impact bhi bohot hai.

### 3. What makes your system different from others? (Doosro se alag kyun hai?)
**Answer:** Doosri apps (jaise MyFitnessPal) **Reactive** hain—wo poochti hain "Tumne kya khaya?". Mera system **Proactive** hai—ye batata hai "Tumhein kya khana chahiye". Ye user ki sochne ki tension khatam kar deta hai aur ye free bhi hai.

### 4. Who are the target users? (Kin logon ke liye hai?)
**Answer:** 
1. Students aur job wale log jinke paas sochne ka time nahi.
2. Gym jane wale log jo apne Macros track karna chahte hain.
3. Wo log jo wazan kam ya zyada karna chahte hain.

### 5. What are the limitations? (Is mein kamiyan kya hain?)
**Answer:**
1. **Static Data:** Ye nayi recipes internet se khud nahi uthata.
2. **No Feedback:** Agar user ko koi cheez pasand na aaye, to system abhi ye seekhta nahi hai.
3. **Western Recipes:** Zyadatar recipes angrezi khano ki hain, desi khane kam hain.

---

## 📘 PROBLEM STATEMENT & OBJECTIVES

### 6. Why is generic diet planning ineffective? (Aam diet plan kaam kyun nahi karte?)
**Answer:** Kyun ke har insan ki body alag hoti hai. Ek 50kg ki larki aur 90kg ka bodybuilder same plan follow nahi kar sakte. Generic plan mein **Context** nahi hota, is liye wo fail ho jate hain.

### 7. What were your objectives? (Maqsad kya tha?)
**Answer:**
1. Ek aisa algorithm banana jo accurate Calories calculate kare.
2. Ek Recommendation Engine banana jo us calculation ke hisaab se recipe dhoond kar laye.
3. User ke liye aasaan interface banana taake wo graphs dekh kar samajh sake.

### 8. Which objective was hardest? (Sab se mushkil kaam kya tha?)
**Answer:** **Data Quality.** Dataset mein ingredients text mein likhe thay (jaise "ek cup cheeni"). Is text ko parh kar numbers mein convert karna sab se mushkil engineering challenge tha.

---

## 🧠 RECOMMENDATION SYSTEM CONCEPTS (Ye Zaroori Hai)

### 9. Which Machine Learning models did you use? (Konsay models use kiye?)
**Answer:** Maine **Hybrid Approach** use ki hai:
1. **TF-IDF:** Search aur filters ke liye (jaise allergy hatana).
2. **KNN (K-Nearest Neighbors):** Ye mera main engine hai. Ye recipe dhoondta hai jo mathematically user ki zaroorat ke qareeb ho.
3. **GPT-4o (LLM):** Ye reasoning aur variety ke liye hai, taake plan boring na ho.

### 10. Why KNN? Why not use Deep Learning? (KNN he kyun?)
**Answer:**
1. **Simple & Fast:** KNN bohot tez hai aur chote dataset ke liye best hai.
2. **Explainable:** Deep Learning ek "Black Box" hai (samajh nahi aata result kyun aaya). KNN mein hum bata sakte hain ke "Ye recipe is liye chuni gayi kyun ke iski protein aap ki requirement ke sab se qareeb thi".
3. **No Cold Start:** Deep Learning ko user history chahiye hoti hai. KNN ko history nahi chahiye, ye pehle din se kaam karta hai.

### 11. What is the Cold-Start Problem?
**Answer:** Jab naya user aata hai to system ko nahi pata hota ke use kya pasand hai. Collaborative Filtering wahan fail ho jati hai. Mera system **Content-Based** hai, to jaise he user apna wazan dalta hai, system foran kaam shuru kar deta hai.

---

## ⚙️ METHODOLOGY (Kaam Kaise Karta Hai)

### 12. Explain the workflow. (Pura process batayen)
**Answer:**
1. **User Input:** User apna data (Weight, Height, Goal) deta hai.
2. **Calculation:** Backend pe BMR aur TDEE calculate hota hai.
3. **Filtering:** Agar user Vegan hai, to Meat wali recipes nikal di jati hain.
4. **Matching (KNN):** Phir KNN chalta hai aur wo recipes dhoondta hai jo user ki calories se match karein.
5. **AI Reasoning:** End mein GPT-4 in recipes ko arrange karta hai aur aik waja (reasoning) likhta hai.

### 13. How do you calculate Calories? (Calorie kaise nikalte hain?)
**Answer:** Main **Mifflin-St Jeor Equation** use karta hoon. Ye science mein sab se accurate maani jati hai BMR nikalne ke liye.
Formula: `10 * weight + 6.25 * height - 5 * age + GenderConstant`

### 14. How do you ensure safety? (Ghalat mashwara to nahi dega?)
**Answer:** Maine safe limits lagayi hui hain. System kabhi bhi **1200 calories** se neeche ka plan nahi deta, chahe user jitna bhi strict goal rakh le. Ye "Starvation" se bachata hai.

---

## 🔢 TF-IDF & COSINE SIMILARITY (Examiner ka Favorite)

### 15. What is TF-IDF?
**Answer:** Ye text ko numbers mein badalne ka tareeqa hai.
*   **TF:** Ye dekhta hai ke aik lafz (jaise "Chicken") recipe mein kitni baar aaya.
*   **IDF:** Ye dekhta hai ke wo lafz kitna, aam hai. (Agar "Namak" har recipe mein hai, to uski value kam ho jati hai).

### 16. What is Cosine Similarity?
**Answer:** Ye do cheezon ke darmiyan angle measure karta hai. Agar angle chota hai, matlab dono cheezein same hain. Hum isay use karte hain text search ke liye (jaise "Chicken Pasta" dhoondne ke liye).

### 17. Why use Cosine and not Euclidean for text?
**Answer:** Text ke liye magnitude matter nahi karta (lambi recipe zaroori nahi ke alag ho). Cosine sirf "Direction" dekhta hai, is liye wo text matching ke liye behtar hai.

---

## 🏗️ TECHNICAL & CODING QUESTIONS (Phansne Walay Sawal)

### 18. What is your Tech Stack?
**Answer:**
*   **Frontend:** React (TypeScript) - UI ke liye.
*   **Backend:** Python (Flask) - Logic aur AI ke liye.
*   **Database:** Abhi In-Memory (Pandas) use ho raha hai taake speed tez ho.

### 19. Why Flask? Why not Django?
**Answer:** Flask halka phulka (lightweight) hai. Mera project Data Science heavy hai, mujhe Django ke heavy features ki zaroorat nahi thi. Flask mein libraries (Pandas/Scikit) integrate karna aasaan tha.

### 20. How do you handle Data Privacy?
**Answer:** User ke password **Supabase Auth** ke zariye secure hain. API Keys ko `.env` file mein chupa kar rakha hai taake wo code mein nazar na aayein.

### 21. What did YOU personally do? (Tum ne kya kiya?)
**Answer:** Maine poora **Full-Stack** khud banaya hai:
1. React ke components design kiye.
2. Python mein algorithm likha.
3. Data ko saaf (clean) kiya.
4. API endpoints banaye jo frontend aur backend ko connect karte hain.

---

## 🎯 TOUGH TRAP QUESTIONS

### 22. Is this really AI? (Kya ye waqai AI hai?)
**Answer:** Jee haan.
1. Is mein **Unsupervised Machine Learning (KNN)** use hui hai clustering ke liye.
2. Is mein **Generative AI (LLM)** use hui hai reasoning likhne ke liye.
To ye sirf if-else rules nahi hain, ye proper AI techniques hain.

### 23. Why normalize the data? (Data normalize kyun kiya?)
**Answer:** Agar main normalize na karta, to Calories (jo 500-600 hoti hain) ka asar Fats (jo sirf 10-20 gram hote hain) se bohot zyada hota. Normalize karne se Calories aur Fats dono ka asar barabar ho jata hai recommendation par.

### 24. What if the dataset is biased?
**Answer:** Ye aik limitation hai. Dataset mein Western khane zyada hain. Future mein main is mein Pakistani recipes add karunga taake ye humare logon ke liye bhi behtar ho.

---
**Advice:** Viva mein confidence se bolna. Agar kisi sawal ka jawab na aaye, to jhoot mat bolna, keh dena "Sir, maine is angle se abhi nahi socha, lekin meri logic ke hisaab se..." (Sir, I haven't explored that yet, but logically...).
Good luck!
