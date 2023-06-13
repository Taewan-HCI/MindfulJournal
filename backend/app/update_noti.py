from fastapi import FastAPI
import firebase_admin
from firebase_admin import db, credentials
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import requests

# Initialize Firebase Admin SDK
cred = credentials.Certificate('/Users/taewankim/PycharmProjects/LLM_diary/backend/mindfuljournal-44166-firebase-adminsdk-frpg8-10b50844cf.json')
app_1 = firebase_admin.initialize_app(cred)

# Create FastAPI app
app = FastAPI()

# Define the endpoint for Firebase updates
@app.post('/firebase-updates')
async def firebase_updates(payload: dict):
    # Process the update received from Firebase
    # Here you can access the updated data in 'payload' and perform necessary actions
    # For example, send an email using SendGrid

    # Send an email
    message = Mail(
        from_email='twkim24@gmail.com',
        to_emails='taewan@kaist.ac.kr',
        subject='Firebase Update',
        plain_text_content=f"Firebase update received:\n{payload}"
    )

    try:
        sg = SendGridAPIClient('test')
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(str(e))

    # Send a notification using FCM
    fcm_payload = {
        'notification': {
            'title': 'Firebase Update',
            'body': 'There is a new update in the Firebase database',
        },
        'data': payload  # Optional data payload to include additional information
    }

    fcm_headers = {
        'Authorization': 'Bearer your-fcm-server-key',
        'Content-Type': 'application/json'
    }

    fcm_endpoint = 'https://fcm.googleapis.com/v1/projects/your-firebase-project-id/messages:send'

    try:
        response = requests.post(fcm_endpoint, json=fcm_payload, headers=fcm_headers)
        response.raise_for_status()
        print('Notification sent:', response.json())
    except requests.exceptions.RequestException as e:
        print('Failed to send notification:', str(e))

    return {'message': 'Email sent and notification sent'}

