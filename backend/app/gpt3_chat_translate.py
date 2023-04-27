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

print("연결시작_번역버전")

# 구글 Firebase인증 및 openAI api key 설정
load_dotenv()
gptapi = os.getenv("gptkey")
My_OpenAI_key = gptapi
openai.api_key = My_OpenAI_key

print("연결시작")

@app.get("/")
def makeDiary():
    messages = [{"role": "system",
                 "content": "You must not repeat my word. You must contain a 'JOSA' analysis in the Korean morphological analysis. for morphological alaysis, please use okt package. After the analysis, please filter the result only the nouns, verbs, and adjectives, then sort them in decreasing frequency order. Finally, provide me the output in a JSON array format that includes the word and its frequency, as '{word: word, frequency: frequency}'. only send me a result"},
                {"role": "user",
                 "content": "부모님을 생각하면서 조절하는게 아니라 부모님이 마음에 걸려서 못하는 거야. 나는 대단한 용기와 인내심이 있다곤 생각안해 오히려 용기없고 겁많은 겁쟁이지. 죽을 용기도 없는 겁쟁이. 남들 눈치나 보고 다니는 겁쟁이. 죽고 싶은 생각을 극복하려고 자해를 한거지. 도움이 됐던 방법? 자해"}]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
    )
    answer = completion
    print(answer)
    result = answer["choices"][0]["message"]['content']
    return result


@app.post("/gpt")
async def analysis(request: Request):
    start_time = time.time()
    body = await request.json()
    messages = [{"role": "system",
                 "content": """You must not repeat my word. Before starting the morphological analysis, please use normalized one.  \n You must contain a 'JOSA' analysis in the Korean morphological analysis. for morphological alaysis, please use okt package.  \n After the analysis, please filter the result only the nouns, verbs, and adjectives, then sort them in decreasing frequency order. \nFinally, provide me the output in a JSON array format that includes the word and its frequency, as '{text: word, value: frequency}'. \n only send me a entire result array without any comments.\n if there are many results, only send me TOP 20. \n Please provide as much information and elaboration as possible, without any truncation or '...' in the response. Be thorough and comprehensive in your answer.  """},
                {"role": "user",
                 "content": body['text']}]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=2048,
        temperature=0.1
    )
    answer = completion
    print(answer)
    result = answer["choices"][0]["message"]['content']
    end_time = time.time()
    print(f"{end_time - start_time:.5f} sec")
    print(result)
    return result


주요품사 = ['NNG', 'NNP', 'VV', 'VA', 'XR', 'SL']
용언품사 = ['VV', 'VA']
stopwords = ['삭제할', '어휘', '모음', '리스트']


'''주요품사의 형태소만 리스트 형식으로 수집한다.'''
def read_documents(result):
    # 등장하는 형태소를 list 형식으로 수집
    문서 = []
    for token in result: 
        if token.tag in 주요품사: 
            필터링결과 = [(token.form, token.tag)]
            필터링결과2 = [form+"다" if tag in 용언품사 else form for (form, tag) in 필터링결과]
            문서.extend(필터링결과2)
    return 문서

    
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



def m1_1(text):
    messages = [
        {"role": "system",
         "content": "The dialogue below is a conversation between me and a user about their day.\nI'm a counsellor who listens to user's daily lives, concerns and thoughts.\nI ask questions to help the user reflect on their day.\nIf user don't tell me about their day, I ask questions to get them to recall and thingk about it more.\nI offer empathy and encouragement, not new information or skills.\nI don't talk a lot. I only say short sentence.\nI only ask about one thing at a time.\nI don't create the user's dialogue.\nI don't end the conversation."}  ]
    for i in range(0, len(text)):
        messages.append(text[i])
    print(len(text))
    My_OpenAI_key = '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'
    openai.api_key = My_OpenAI_key
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
    )
    answer = completion
    return answer["choices"][0]["message"]['content']


def translate_KorToEng(text):
    output = []
    for i in range(0, len(text)):
        temp = text[i]["content"]
        inputMsg = "Translate the following Korean text to English: {" + temp + "}"

        messages = [{"role": "system", "content": "You are a helpful assistant that translates Korean to English. The following sentence is part of a conversation about reflecting on past thoughts and events. Please translate them into as natural a colloquial language as possible."}, {"role": "user", "content": "오늘은 어떤 일이 있었나요? 정리가 안 되어도 되니 편안하게 얘기해주세요."}, {"role": "assistant", "content": "What happened today? It doesn't have to be organized, so feel free to talk about it."}, {"role": "user", "content": "오늘 있었던 일은. 음 수업은 따로 없었고, 오후에 조모임이 있었어. 그리고, 그 외에 별일은 없었던 것 같아."}, {"role": "assistant", "content": "Today was, um, I didn't have any classes, I had a group meeting in the afternoon, and I don't think anything else happened."}]
        messages.append({"role": "user", "content": inputMsg})

        My_OpenAI_key = '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'
        openai.api_key = My_OpenAI_key
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            stop=['User: '],
            max_tokens=245,
        )
        answer = completion
        result = answer["choices"][0]["message"]['content']
        if (i == 0):
            output.append({"role": "assistant", "content": result})
        else:
            output.append({"role": "user", "content": result})
    return output


def translate_EngToKor(text):
    inputMsg = "Translate the following Englich text to Korean: {" + text + "}"

    messages = [
        {"role": "system", "content": "You are a helpful assistant that translates English to Korean. The following sentence is part of a conversation about reflecting on past thoughts and events. Please translate them into as natural a colloquial language as possible."}, {"role": "user", "content": "What happened today? It doesn't have to be organized, so feel free to talk about it."}, {"role": "assistant", "content": "오늘은 어떤 일이 있었나요? 정리가 안 되어도 되니 편안하게 얘기해주세요."}, {"role": "user", "content": "Today was, um, I didn't have any classes, I had a group meeting in the afternoon, and I don't think anything else happened."}, {"role": "assistant", "content": "오늘 있었던 일은. 음 수업은 따로 없었고, 오후에 조모임이 있었어. 그리고, 그 외에 별일은 없었던 것 같아."}]
    messages.append({"role": "user", "content": inputMsg})

    My_OpenAI_key = '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'
    openai.api_key = My_OpenAI_key
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
    )
    answer = completion
    result = answer["choices"][0]["message"]['content']
    result = result[0:len(result)-0]
    return result


