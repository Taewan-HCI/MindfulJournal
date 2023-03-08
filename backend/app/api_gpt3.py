# -*- coding: utf-8 -*-
import base64
from fastapi import Request, FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import http.client
import time
import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import openai

app = FastAPI()
origins = ["*", "http://localhost:3000", "localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

print("연결시작")

cred = credentials.Certificate(
    '/Users/taewankim/PycharmProjects/LLM_diary/backend/app/mindfuljournal-44166-firebase-adminsdk-frpg8-10b50844cf.json')
app_1 = firebase_admin.initialize_app(cred)
db = firestore.client()

def upload(response_text, user, num):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc_ref.set({
        u'outputFromLM': response_text
    }, merge=True)


def m1_1(text):
    My_OpenAI_key = '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'

    openai.api_key = My_OpenAI_key
    completion = openai.Completion()

    # config
    prompt = text
    start_sequence = "\n나: "
    restart_sequence = "\n사용자: "

    response = completion.create(
        prompt=prompt,
        engine="davinci",
        max_tokens=256,
        stop=["###", "나:", "사용자:"],
        temperature=0.7,
        top_p=0.0,
        best_of= 1
    )
    # answer = response.choices[0].text.strip()
    answer = response
    return answer


@app.post("/")
async def calc(request: Request):
    print(sys.stdin.encoding)
    body = await request.json()
    text = body['text']
    user = body['user']
    num = body['num']

    response_text = m1_1(text)
    upload(response_text, user, num)
    print(response_text)

# 웹소켓 커뮤니케이션 테스트
# @app.websocket("/ws_test")
# async def websocket_endpoint(websocket: WebSocket):
#     print('Accepting client connection...')
#     await websocket.accept()
#     while True:
#         try:
#             # Wait for any message from the client
#             data=await websocket.receive_text()
#             print(data)
#             await websocket.send_text("received")
#
#             # Send message to the client
#
#             # await websocket.send_text("resp")
#             # print("Sending")
#             # print(data)
#         except Exception as e:
#             print('error:', e)
#             break
#     print('Bye..')
