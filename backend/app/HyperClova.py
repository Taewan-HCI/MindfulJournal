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
from dotenv import load_dotenv
import os


app = FastAPI()
origins = ["*", "http://localhost:3000", "localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

load_dotenv()
client_id_value = os.getenv("client_id")
client_secret_value = os.getenv("client_secret")


print("연결시작")


class CompletionExecutor:
    def __init__(self, host, client_id, client_secret, access_token=None):
        self._host = host
        # client_id and client_secret are used to issue access_token.
        # You should not share this with others.
        self._client_id = client_id
        self._client_secret = client_secret
        # Base64Encode(client_id:client_secret)
        self._encoded_secret = base64.b64encode(
            '{}:{}'.format(self._client_id, self._client_secret).encode('utf-8')).decode('utf-8')
        self._access_token = access_token

    def _refresh_access_token(self):
        headers = {
            'Authorization': 'Basic {}'.format(self._encoded_secret)
        }

        conn = http.client.HTTPSConnection(self._host)
        # If existingToken is true, it returns a token that has the longest expiry time among existing tokens.
        conn.request('GET', '/v1/auth/token?existingToken=true', headers=headers)
        response = conn.getresponse()
        body = response.read().decode()
        conn.close()

        token_info = json.loads(body)
        self._access_token = token_info['result']['accessToken']

    def _send_request(self, completion_request):
        headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer {}'.format(self._access_token)
        }

        conn = http.client.HTTPSConnection(self._host)
        conn.request('POST', '/v1/completions/chimmy-02', json.dumps(completion_request), headers)
        response = conn.getresponse()
        result = json.loads(response.read().decode(encoding='utf-8'))
        conn.close()
        return result

    def execute(self, completion_request):
        if self._access_token is None:
            self._refresh_access_token()

        res = self._send_request(completion_request)
        if res['status']['code'] == '40103':
            # Check whether the token has expired and reissue the token.
            self._access_token = None
            return self.execute(completion_request)
        elif res['status']['code'] == '20000':
            return res['result']['text']
        else:
            return 'Error'


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
    time.sleep(1.5)
    completion_executor = CompletionExecutor(
        host='api-hyperclova.navercorp.com',
        client_id=client_id_value,
        client_secret=client_secret_value
    )
    preset_text = text.rstrip()
    preset_text = preset_text.lstrip()
    preset_text.encode('utf-8')
    request_data = {
        'text': preset_text,
        'maxTokens': 32,
        'temperature': 0.5,
        'topK': 0,
        'topP': 0.8,
        'repeatPenalty': 5.0,
        'start': '\nA: ',
        'restart': '\nB: ',
        'stopBefore': ['###', '"###\n"', 'A:', 'B:'],
        # 'start': '\n나:',
        # 'restart': '\n사용자:',
        # 'stopBefore': ['###', '"###\n"', '나: ', '사용자: ', '"\n사용자: "', '"\n나: "'],
        'includeTokens': True,
        'includeAiFilters': False
    }
    response_text = completion_executor.execute(request_data)
    time.sleep(1.5)
    return response_text


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
