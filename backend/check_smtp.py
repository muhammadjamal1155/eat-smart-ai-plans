from dotenv import load_dotenv
import os

load_dotenv()

smtp_server = os.environ.get('SMTP_SERVER')
smtp_email = os.environ.get('SMTP_EMAIL')
smtp_password = os.environ.get('SMTP_PASSWORD')

print(f"SMTP_SERVER: {smtp_server}")
print(f"SMTP_EMAIL: {'[SET]' if smtp_email else '[MISSING]'}")
print(f"SMTP_PASSWORD: {'[SET]' if smtp_password else '[MISSING]'}")

if smtp_email:
    print(f"Email will be sent TO: {smtp_email} (because Contact Form sends to admin)")
