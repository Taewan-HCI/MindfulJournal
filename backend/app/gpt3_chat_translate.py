# -*- coding: utf-8 -*-
import base64
from fastapi import Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
from konlpy.tag import Okt
import json
import openai
from dotenv import load_dotenv
import os
import time
from kiwipiepy import Kiwi
from collections import Counter
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


kiwi = Kiwi()
app = FastAPI()
origins = ["*", "http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 구글 Firebase인증 및 openAI api key 설정
load_dotenv()
gptapi = os.getenv("gptkey")
My_OpenAI_key = gptapi
openai.api_key = My_OpenAI_key

firebase_key = os.getenv("dbkey")

cred = credentials.Certificate(firebase_key)
app_1 = firebase_admin.initialize_app(cred)
db = firestore.client()


print("코드 실행 시작")

def upload(user, num, frequency, summary):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc_ref.set({
        u'wordFrequency': frequency,
        u'eventSummary': summary
    }, merge=True)
    
print("연결 시작")

@app.post("/upload")
async def uploadDB(request: Request):
    body = await request.json()
    user = body['user']
    num = body['num']
    
    start_time = time.time()
    
    monologue = get_monologue(user, num)
    print("monologue: ", monologue)
    
    frequency = get_word_frequency(monologue)
    summary = get_event_summary(monologue)
    
    upload(user, num, frequency, summary)
    
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    
def get_monologue(user, num):
    diary_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    diary = diary_ref.get().to_dict()
    conversation = diary.get('conversation')[1::2]  
    
    monologue = ""
    for c in conversation:
        monologue += c['content']
    
    return monologue
    

#테스트용 api
@app.get('/')
def hello_world():
    return {'message': 'Hello, World!'}

nlp_eng_prompt = '''
You are a psychiatrist and your task is to analyze a depressed patient's monologue by counting the occurrence of specific words used by the patient. 
 You are particularly interested in counting very negative words that the patient uses, like "suicide", "self-harm", 'kill', and "violence". 

To perform the task, follow these steps:

\n1. Perform Korean morphological analysis on the "monologue," including 'dependent noun' and 'josa,' and save the extracted words in 'temp'.
\n2. Extract only nouns, verbs, and adjectives from 'temp' and save them in 'words'.
\n3. Count the number of times the words from 'words' appear in the "monologue".
\n4. Store in "filtered_words" the words from 'words'  that meet all of the following criteria a, b, c, d:
  \n a. Exclude "나," "것," "뿐", and "은".
  \n b. Exclude "하다", "있다", and "싶다"
  \n c. Exclude 'josa,' 'dependent noun', 'auxiliary adjective', and 'pronoun'.
  \n d. Exclude words that refer to anything.
\n5. Select the 20 most frequently appearing words from "filtered_words" based on their frequency in the "monologue" and save them in "top-20". In case of ties, prioritize words associated with a "depressed patient."
\n6. Save the results in "lists" as a list of dictionaries. Each dictionary represents a word from "top-20" and includes the word's frequency of appearance and sentiment. The keys are 'word', 'count', and 'sentiment', where the type of word is String, the type of count is Int, the type of sentiment is String, and the sentiment is one of four strings: '긍정', '부정', '중립',  '위험'.  Sort "lists" in descending order based on 'count'.
\n7. Iterate over "lists" and for each dictionary, count how many times the value of 'word' appears as a substring in the "monologue" and save it to 'count'.
\n8. Print the value of "lists" after "result:", displaying the original form of each word in the 'word' value (e.g., '죽고' is output as '죽다 because "죽고" is "죽-" + "고"', and '사나' is output as '살다').

\n Do not repeat my request. Do not show each steps. Just show me value of 'lists' without any comments'. Keep answer short. 
'''

주요품사 = ['NNG', 'NNP', 'VV', 'VA', 'XR', 'SL']
용언품사 = ['VV', 'VA']
stopwords = ['삭제할', '어휘', '모음', '리스트']


def get_word_frequency(text):
    messages = [{"role": "system",
                 "content": nlp_eng_prompt},
                {"role": "user",
                 "content": "monologue: ''' " + text + " '''  \n result:"}]

    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        stop=['User: '],
        max_tokens=2048,
        temperature=0
    )
    answer = completion
    result = answer["choices"][0]["message"]['content']

    json_data = json.loads(result.replace("\'", "\""))
    return_json = []
    
    for j in json_data : 
        t = kiwi.tokenize(j['word'])
        if t[0].tag in 주요품사:
            #꼭 0번이 아닐수도 있음...!!
            return_json.append(j)

    return return_json 

@app.post("/gpt")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    diary = body['text']
    
    result = get_word_frequency(diary)
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    print(result)

    return result


#형태소 분석 결과를 정리해서 리턴하는 함수
def read_documents(result):
    # 등장하는 형태소를 list 형식으로 수집
    doc = []
    for token in result: 
        if token.tag in 주요품사: 
            filtered_result = [(token.form, token.tag)]
            revised_filtered_result = [form+"다" if tag in 용언품사 else form for (form, tag) in filtered_result]
            doc.extend(revised_filtered_result)
    return doc

#kiwi 형태소분석기를 통해 형태소 분석 후 빈도를 json array로 리턴하는 Api
@app.post("/kiwi")
async def kiwi_nalysis(request: Request):
    start_time = time.time()
    body = await request.json()
    target_text = body['text']
    
    kiwi_result = kiwi.tokenize(target_text)
    
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    result_docs =  Counter(read_documents(kiwi_result))
    
    result = [{'text':key, 'value':value} for key,value in result_docs.items()]
    result.sort(key=lambda x: x["value"], reverse=True)
    
    return result

summary_prompt = '''
I'm acting as a Wikipedia page. I will provide a summary of a topic based on a user's diary entry. The summary will be informative and factual, encompassing the most crucial elements of the topic. It will consist of two parts: a description of the event that happened to the user, and an overview of the user's emotions, ideas, feelings, reactions, and thoughts related to the event. Each part should not exceed 30 words. after making the answer, providing translated in Korean version. (only translated one) Do not to repeat user's words, any do NOT provide any comments without answer.

here is an example.
diary: 오늘 나는 날씨가 우중충해서 기분이 나빴어. 그런데 그만 지하철을 타러 가다 돌부리에 걸려 넘어졌어. 무릎이 까지고 발목을 접질린 것 같아 제대로 걷지를 못하겠더라. 그 와중에 나를 보고 수군대는 할아버지가 너무 야속했어. 그래서 자리에 엎어져서 대성통곡했는데, 길 건너편에서 나를 물끄러미 보던 아주머니가 달려와서 나를 부축해줬어. 고마웠지만 너무 부끄럽더라.

my output:
Event:
날씨가 좋지 않았다. 지하철을 타러 가다 돌부리에 걸려 넘어졌다. 자리에 엎어져서 울었다. 그리고 건너편에 있던 아주머니가 와서 유저를 부축했다.

Emotion/Thought:
사용자는 날씨가 좋지 않아서 슬펐다. 할아버지가 야속했다. 아주머니에게 고마움을 느꼈다.
'''

def get_event_summary(text):
    messages = [{"role": "system",
                 "content": summary_prompt
                },
                {"role": "user",
                 "content": "here is a diary" + text}]
        
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=2048,)
    
    answer = completion
    result = answer["choices"][0]["message"]['content']
    
    event = result.split('Event:')[1].split('Emotion/Thought:')[0]
    emotion = result.split('Event:')[1].split('Emotion/Thought:')[1]
    
    event_summary = {
        "event": event,
        "emotion": emotion
    }
    
    return event_summary
    

#넣은 글을 Event, emotion/thought로 분리해서 요약해주는 API
@app.post("/summary")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    text = body['text']
    
    result = get_event_summary(text)
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    return result