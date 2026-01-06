from flask import Blueprint, request, jsonify
from services.recommendation_service import RecommendationService
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

api = Blueprint('api', __name__)

@api.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    service = RecommendationService.get_instance()
    
    # Use the service to get recommendations
    recommendations = service.get_recommendations(data)
    
    if "error" in recommendations:
        return jsonify(recommendations), 500

    return jsonify(recommendations)
    
@api.route('/meals', methods=['GET'])
def get_meals():
    query = request.args.get('query', '')
    tag = request.args.get('tag', 'all')
    service = RecommendationService.get_instance()
    meals = service.search_meals(query, tag)
    return jsonify(meals)

@api.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    # In a real application, you would generate a token and send an email here.
    print(f"----------------------------------------------------------------")
    print(f"SIMULATION: Password reset requested for {email}")
    print(f"Email would be sent to: {email}")
    print(f"Reset Link: http://localhost:5173/reset-password-confirm?token=simulation-token")
    print(f"----------------------------------------------------------------")
    
    return jsonify({"message": "Password reset link sent (simulated)", "status": "success"})

@api.route('/api/email-grocery-list', methods=['POST'])
def email_grocery_list():
    data = request.json
    email = data.get('email')
    items = data.get('items')
    
    if not email or not items:
        return jsonify({"error": "Email and items are required"}), 400
        
    
    # Real Email Sending
    try:
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_EMAIL')
        smtp_password = os.environ.get('SMTP_PASSWORD')

        if not smtp_user or not smtp_password:
             print("SMTP Credentials missing. Logging to console instead.")
             # Fallback to console
             print(f"--- EMAIL TO {email} ---\n" + "\n".join(items))
             return jsonify({"message": "Email simulation (No SMTP credentials found)", "status": "success"})

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email
        msg['Subject'] = "Your NutriPlan Grocery List"

        body = "Here is your grocery list from NutriPlan:\n\n"
        for item in items:
            body += f"- {item}\n"
        
        body += "\nHappy Cooking!\n- The NutriPlan AI"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_user, email, text)
        server.quit()
        
        return jsonify({"message": f"Email sent to {email}", "status": "success"})

    except Exception as e:
        print(f"Failed to send email: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/api/contact', methods=['POST'])
def contact_us():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not all([name, email, subject, message]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_EMAIL')
        smtp_password = os.environ.get('SMTP_PASSWORD')

        # Construct email body
        email_body = f"""
New Contact Form Submission

From: {name} <{email}>
Subject: {subject}

Message:
{message}
        """

        if not smtp_user or not smtp_password:
             print("SMTP Credentials missing. Logging contact message to console.")
             print("--- CONTACT FORM MESSAGE ---")
             print(email_body)
             print("----------------------------")
             return jsonify({"message": "Message received (Console Logged)", "status": "success"})

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = smtp_user # Send to self/admin
        msg['Cc'] = email # Send copy to user
        msg['Reply-To'] = email
        msg['Subject'] = f"Contact Form: {subject} - {name}"

        msg.attach(MIMEText(email_body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        
        # Send to both admin and user
        recipients = [smtp_user, email]
        server.sendmail(smtp_user, recipients, text)
        server.quit()
        
        return jsonify({"message": "Message sent successfully", "status": "success"})

    except Exception as e:
        print(f"Failed to send contact email: {e}")
        return jsonify({"error": "Failed to send message"}), 500
