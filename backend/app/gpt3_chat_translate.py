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

print("코드 실행 시작")

# 구글 Firebase인증 및 openAI api key 설정
load_dotenv()
gptapi = os.getenv("gptkey")
My_OpenAI_key = gptapi
openai.api_key = My_OpenAI_key

print("연결 시작")

#테스트용 api
@app.get("/")
def makeDiary():
    messages = [{"role": "system",
                 "content": "You must not repeat my word. You must contain a 'JOSA' analysis in the Korean morphological analysis. for morphological alaysis, please use okt package. After the analysis, please filter the result only the nouns, verbs, and adjectives, then sort them in decreasing frequency order. Finally, provide me the output in a JSON array format that includes the word and its frequency, as '{word: word, frequency: frequency}'. only send me a result"},
                {"role": "user",
                 "content": "부모님을 생각하면서 조절하는게 아니라 부모님이 마음에 걸려서 못하는 거야. 나는 대단한 용기와 인내심이 있다곤 생각안해 오히려 용기없고 겁많은 겁쟁이지. 죽을 용기도 없는 겁쟁이. 남들 눈치나 보고 다니는 겁쟁이. 죽고 싶은 생각을 극복하려고 자해를 한거지. 도움이 됐던 방법? 자해"}]

    completion = openai.ChatCompletion.create(
        model="davinci",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
    )
    answer = completion
    print(answer)
    result = answer["choices"][0]["message"]['content']
    return result

nlp_prompt = '''
정신건강의학과 전문의로서 다음 task를 수행하라. "독백"에 기록된 우울증 환자의 독백에서 환자가 주로 언급하는 단어들이 무엇이고 얼마나 자주 사용하였는지를 count하고 이로부터 환자의 상태를 평가하려고 한다. 환자가 "자살", "자해", "폭력" 같은 매우 부정적인 단어를 사용할 수 있으나 환자가 위험한 상태에 있다는 것을 빠르게 파악하기위해 그러한 단어 역시 얼마나 자주 언급되었는지 count해야 한다. task의 수행은 아래 단계로 수행하라.
\n 1.  python konlpy의 okt package를 이용하여 '의존명사', '조사'를 포함한 한국어 형태소 분석을 수행하여 "독백"내 언급된 단어를 추출해서 'temp'에 저장 
\n 2. temp에서 오직  "명사", "동사", "형용사" 를 추출해서 words에 저장한다. 
\n3. "words"에 저장한 단어들이 "독백"에서 출현한 회수 count
\n4. "words"에 저장한 단어들 중 다음 a, b, c 규칙에 모두 해당하는 단어를  "filtered_words"에 저장한다.
  \na.  "나", "것", "뿐", "은" 중 하나가 아니다.
  \nb. '조사',  '의존명사, "인칭대명사"' 또는 '대명사'가 아니다.
  \nc.  어떤 것을 지칭하지 않는다. 
\n5. "filtered_words"에서 "독백"에 출현한 빈도가 가장 많은 20개를 선택하여 "top-20"에 저장. 출현한 빈도가 같다면 '우울증 환자'와 연관된 단어를 우선으로 저장. 
\n6. "top-20"에 저장된 단어들을 대상으로 "독백"에 출현한 빈도를 기준으로 list of dictionary 형태의 결과물을 "lists"에 저장. The dictionary는 각 단어의 출현 빈도와 단어의 sentiment를 표현하며 key로는 'word', 'count', 'sentiment'를 가짐. word의 type은 string, count의 type은 integer, sentiment의 type은 string이며 sentiment는 '긍정', '부정', '중립', '위험' 네 가지 중 하나의 string을 가짐. lists는 count에 따라 descending order로 sorting할 것.
\n7. "lists"에 대해 iteration을 돌면서 각 dictionary에 대하여 다음 작업 수행: 'word'의 value 값을 가져와 해당 string이 "독백" 안에 substring으로 몇 번 출현하는지를 count하고 이 값을 'count'에 기재.
\n8. "lists" 값만을 "result:" 다음에 출력. 이때 'word'의 value는 original form of word로 출력된다. 
\n(예시: '죽고'를 '죽다'로 출력, "죽고"는 "죽-"+"고"이기 때문에 원형인 "죽다"를 출력한다. '잔인한'은 '잔인하다'로 출력한다. 
\n Do not repeat my request. Do not show each steps. Just show me value of 'lists' without any comments'. Keep answer short. 
'''


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


#nlp 분석 API 
@app.post("/gpt")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    diary = body['text']
    messages = [{"role": "system",
                 "content": nlp_eng_prompt},
                {"role": "user",
                 "content": "monologue: ''' " + diary + " '''  \n result:"}]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=2048,
        temperature=0
    )
    answer = completion
    result = answer["choices"][0]["message"]['content']
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    
    json_data = json.loads(result.replace("'", "\""))
    print(json_data)
    return_json = []
    
    for j in json_data : 
        t = kiwi.tokenize(j['word'])
        if t[0].tag in 주요품사:
            #꼭 0번이 아닐수도 있음...!!
            return_json.append(j)

    return result


@app.post("/gpt4")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    diary = body['text']
    messages = [{"role": "system",
                 "content": nlp_eng_prompt},
                {"role": "user",
                 "content": "monologue: ''' " + diary + " '''  \n result:"}]

    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        stop=['User: '],
        max_tokens=2048,
        temperature=0
    )
    answer = completion
    result = answer["choices"][0]["message"]['content']
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    print(result)
    
    # json_data = json.loads(result.replace("'", "\""))
    # print(json_data)
    # return_json = []
    
    # for j in json_data : 
    #     t = kiwi.tokenize(j['word'])
    #     if t[0].tag in 주요품사:
    #         #꼭 0번이 아닐수도 있음...!!
    #         return_json.append(j)

    return result




@app.post("/gpt3")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    diary = body['text']

    completion = openai.Completion.create(
        model="text-davinci-003",
        prompt= nlp_eng_prompt + "monologue: ''' " + diary + " '''  \n result:",
        max_tokens=2048,
        temperature=0
    )
    answer = completion
    result = answer["choices"][0]["text"]
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

    
#konlpy의 okt 형태소분석기를 통해 형태소 분석 후 빈도를 json array로 리턴하는 Api
@app.post("/konlpy")
async def okt_analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    
    paragraph = body['text']
    
    # Normalize the paragraph
    normalized_paragraph = paragraph.strip()

    # Perform morphological analysis
    okt = Okt()
        
    morphemes = okt.pos(normalized_paragraph, norm=True, stem=True)
    word_freq = defaultdict(int)
    
    # Filter and count nouns, verbs, and adjectives
    for morpheme in morphemes:
        word, pos = morpheme
        if pos in ['Noun', 'Verb', 'Adjective']:
            word_freq[word] += 1

    # Sort the words by frequency in decreasing order
    sorted_word_freq = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

    # Create JSON array format with word and frequency
    output = [{"text": word, "value": freq} for word, freq in sorted_word_freq]
    
    # Convert to JSON format
    json_output = json.dumps(output, ensure_ascii=False)
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    print(json_output)

    # Print the JSON output
    return json_output



#넣은 글을 Event, emotion/thought로 분리해서 요약해주는 API
@app.post("/summary")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    messages = [{"role": "system",
                 "content": 
'''I'm acting as a Wikipedia page. I will provide a summary of a topic based on a user's diary entry. The summary will be informative and factual, encompassing the most crucial elements of the topic. It will consist of two parts: a description of the event that happened to the user, and an overview of the user's emotions, ideas, feelings, reactions, and thoughts related to the event. Each part should not exceed 30 words. after making the answer, providing translated in Korean version. (only translated one) Do not to repeat user's words, any do NOT provide any comments without answer.

here is an example.
diary: 오늘 나는 날씨가 우중충해서 기분이 나빴어. 그런데 그만 지하철을 타러 가다 돌부리에 걸려 넘어졌어. 무릎이 까지고 발목을 접질린 것 같아 제대로 걷지를 못하겠더라. 그 와중에 나를 보고 수군대는 할아버지가 너무 야속했어. 그래서 자리에 엎어져서 대성통곡했는데, 길 건너편에서 나를 물끄러미 보던 아주머니가 달려와서 나를 부축해줬어. 고마웠지만 너무 부끄럽더라.

my output:
Event
날씨가 좋지 않았다. 지하철을 타러 가다 돌부리에 걸려 넘어졌다. 자리에 엎어져서 울었다. 그리고 건너편에 있던 아주머니가 와서 유저를 부축했다.

Emotion/Thought
사용자는 날씨가 좋지 않아서 슬펐다. 할아버지가 야속했다. 아주머니에게 고마움을 느꼈다.
'''
                },
                {"role": "user",
                 "content": "here is a diary" + body['text']}]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
    )
    answer = completion
    print(answer)
    result = answer["choices"][0]["message"]['content']
    
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    print(result)
    return result