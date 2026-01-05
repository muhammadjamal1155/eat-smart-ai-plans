from flask import Blueprint, request, jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv

chat_bp = Blueprint('chat', __name__)

# Load env variables (ensure they are loaded if not already)
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '').lower()
        context = data.get('context', {}) # For future use

        api_key = os.environ.get("OPENAI_API_KEY")
        
        # 1. Use OpenAI if Key is present
        if api_key:
            try:
                client = OpenAI(api_key=api_key)
                
                # Construct a system prompt that gives the AI identity
                system_prompt = """You are the 'Eat Smart AI' Chef Assistant.
                Your role is to help users with cooking, meal planning, and detailed recipe questions.
                - FORMATTING RULES:
                  * Use Markdown for lists and emphasis.
                  * Use bullet points for lists of ingredients or steps.
                  * Use bold text for key terms.
                  * Keep paragraphs short and readable.
                - Provide specific substitutions with measurements if possible.
                - Suggest wine or drink pairings based on flavors.
                - Give tips for fixing common cooking mistakes (salty, spicy, etc).
                - Be friendly, concise, and professional.
                """
                
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    model="gpt-4o-mini",
                    max_tokens=150
                )
                
                response = chat_completion.choices[0].message.content.strip()
                return jsonify({"response": response})
                
            except Exception as openai_err:
                print(f"OpenAI API Error: {openai_err}")
                # Fall through to fallback logic
        
        # 2. Fallback Rule-Based Logic
        response = ""
        if 'substitute' in message or 'replace' in message:
             if 'milk' in message: response = "You can substitute milk with almond milk, soy milk, or oat milk."
             elif 'egg' in message: response = "For eggs, use flax seeds (1 tbsp + 3 tbsp water) or applesauce (1/4 cup)."
             elif 'butter' in message: response = "Use coconut oil or applesauce as a substitute for butter."
             else: response = "I can help with substitutions! What ingredient do you need to replace?"
        elif 'wine' in message or 'pairing' in message:
             if 'pasta' in message: response = "Chianti or Pinot Noir pairs well with tomato pasta."
             elif 'steak' in message: response = "A Cabernet Sauvignon is perfect for steak."
             else: response = "I'd love to suggest a pairing. What are you cooking?"
        elif 'spicy' in message: response = "To fix spicy food, add dairy (cream/yogurt) or something sweet."
        else:
             response = "Hello! I'm your AI Chef. Add an OpenAI Key to .env to unlock my full potential! For now, ask me about basic substitutions."

        return jsonify({"response": response})

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": "I'm having trouble thinking right now."}), 500
