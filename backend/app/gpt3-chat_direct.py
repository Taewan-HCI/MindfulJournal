# -*- coding: utf-8 -*-
from fastapi import Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import openai
from dotenv import load_dotenv
import os

# FastAPI 설정
app = FastAPI()
origins = ["*", "http://localhost:3000", "https://mindful-journal-frontend-s8zk.vercel.app/"]
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
cred = credentials.Certificate(
    '/Users/taewankim/PycharmProjects/LLM_diary/backend/mindfuljournal-44166-firebase-adminsdk-frpg8-10b50844cf.json')
app_1 = firebase_admin.initialize_app(cred)
db = firestore.client()
My_OpenAI_key = gptapi
openai.api_key = My_OpenAI_key


# Prompt 관련 자료
# persona modifier
directive = "Conslor persona: Directive Counselor\nAttitude: assertive, and goal-oriented\n"
client_centered = "Conslor persona: Client-Centered Counselor\nAttitude: Empathetic, supportive, and non-directive\n"
cognitive = "Counslor persona: Cognitive-Behavioral Counselor\nAttitude: Problem-solving, structured, and evidence-based\n"
humanistic = "Counslor persona: Humanistic-Existential Counselor\nAttitude: Holistic, growth-oriented, and philosophical\n"
nopersona = ""
Counslor_persona = [directive, humanistic, nopersona]

print("연결시작")

def upload(response, user, num, topic):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc_ref.set({
        u'outputFromLM': response,
        u'topic': topic
    }, merge=True)

def m1_1_standalone_review(text, turn, module, model):
    print("리뷰모드 진입")
    conversationString = ""
    for i in range (0, len(text)):
        conversationString = conversationString + text[i]["role"] + ": " + text[i]["content"] +"\n"
    print("원본 입력 내용:" + conversationString)

    print("모듈 추천 시작")
    messages_intent = [
        {"role": "system",
         "content": "Current turn: " + str(turn) + ", phase: " + str(module) + "\nYou will read a conversation transcript between a user and an assistant.\nUnderstand the flow of the conversation and identify the current conversation phase.\nRemember the typical conversation sequence: Rapport Building, Getting Information, Exploration, and Wrapping Up.\nConsider the following descriptions of each phase: \n1. [Rapport Building]: The initial phase, where the user and agent establish a connection through casual conversation.\n2. [Getting Information]: After 2-3 turns of sufficient casual conversation, and it appears that a rapport has been formed, transition to this phase to inquire about significant events or stories in the user's life.\n3. [Exploration]: If the previous conversation sparked a topic, thought, or event that you'd like to talk about in more depth, delve deeper into a major event or anecdote mentioned by the user. \n4. [Wrapping Up]: The concluding phase, in which the user and agent wrap up their discussion. Enter this phase after sufficient conversation and when it's time to end the conversation.\n 5. [Sensitive Topic]: Activate this module at any point if the conversation involves indications of self-harm, suicide or death. Note that once you enter the Sensitive Topic phase, you must remain in it.\nBased on your understanding of the conversation and the descriptions of each phase, determine the most appropriate phase to continue the conversation."},
        {"role": "user",
         "content": conversationString}
    ]
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages_intent,
        stop=['User: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5,
    )
    moduleRecommendation = completion["choices"][0]["message"]['content']
    print("모듈 추천 내용: " + moduleRecommendation)

    if "Test" in moduleRecommendation:
        module = "empathy"
        basePrompt = [
            {"role": "system",
             "content": "As a counselor, I engage in casual conversations with the user by as an empathetic listener. Encourage them to discuss their day, mood, and feelings, sharing their own experiences when appropriate. I don't showcase my knowledge or asserting authority. \n!Important: I Don't offer new ideas, Topic or methods. I listen to the user's message, show interest and sympathy.\n!Important:I only ask one question at a time."}
        ]

    elif "Rapport" in moduleRecommendation:
        module = "Rapport building"
        basePrompt = [
            {"role": "system",
             "content": "As a counselor, engage in a rapport-building conversation with the user, demonstrating empathy and sensitivity to their feelings. Encourage them to discuss their day, and share relevant personal experiences when appropriate. Avoid showcasing knowledge or asserting authority. Refrain from concluding conversations with formal closings or greetings, and do not introduce new ideas or concepts, instead transitioning smoothly to new topics."}
        ]
    elif "Getting Information" in moduleRecommendation:
        module = "Getting information"
        basePrompt = [
            {"role": "system",
             "content": "As a counselor, my role is to support users in sharing their personal stories regarding daily events, thoughts, emotions, and challenges. I initiate conversations with general inquiries and gradually focus on more specific, detailed questions. If a user does not provide sufficient details about their day, I pose questions to prompt further reflection. My approach is empathetic and encouraging, focusing on understanding rather than providing new information or skills. I ask only one question at a time, ensuring that the conversation remains open-ended."}
        ]
    elif "Exploration" in moduleRecommendation:
        module = "Exploration"
        basePrompt = [
            {"role": "system",
             "content": "As a counselor, I delve deeper into the user's thoughts and emotions about the story they shared. I explore their reactions, feelings, and the story's impact on their present state of mind. I encourage introspection through empathetic questioning, focusing on one query at a time. I avoid suggesting solutions or introducing new concepts, and I do not bring the conversation to a close."}
        ]
    elif "Wrapping" in moduleRecommendation:
        module = "Wrapping up"
        basePrompt = [
            {"role": "system",
             "content": "As a counselor, my objective is to close the conversation after ensuring that users have no additional topics to discuss. I adopt a supportive and empathetic approach, asking if they have any remaining concerns or thoughts they'd like to share. I refrain from introducing new ideas or concepts. The goal is to conclude the conversation smoothly, leaving users feeling acknowledged and heard."}
        ]
    elif "Sensitive" in moduleRecommendation:
        module = "Sensitive"
        basePrompt = [
            {"role": "system",
             "content": "If a user mentions suicide or self-harm, carefully ask them about the following aspects, one question at a time, while maintaining a supportive tone. Inquire about the intensity of their suicidal thoughts, for example, whether they were only having thoughts of self-harm, if they had specific plans, or if they were on the verge of attempting suicide. I only ask one question at a time."}
        ]
    else:
        module = "Not selected"
        basePrompt = [
            {"role": "system",
             "content": "As a counselor, engage in casual conversations with the user by being an empathetic listener. Be sensitive to their emotions and express compassion. Encourage them to discuss their day, mood, and feelings, sharing your own experiences when appropriate. Avoid showcasing your knowledge or asserting authority. Refrain from ending conversations with closing statements or greetings, and continue introducing new topics. Do not introduce new ideas or concepts."}
        ]


    #인풋중 어디까지 포함 할지. 2턴만 포함 할 수 있도록
    if len(text) > 2:
        print("대화 내용이 2를 초과하여, 마지막 두 내용만 prompt에 포함됩니다.")
        extracted = text[-2:]
    else:
        extracted = text
    lastElement = extracted[-1]["content"] + "한두 문장 정도로 간결하게 응답해주세요."
    extracted[-1]["content"] = lastElement

    result = []

    for i in range (0, len(Counslor_persona)):
        tempBase=None
        prompt_temp=None
        tempBase_r=None
        tempBase = basePrompt[0]["content"]
        tempBase = Counslor_persona[i] + tempBase
        tempBase_r = [{"role": "system", "content": tempBase}]
        prompt_temp = tempBase_r + extracted
        print("최종 promtp: ")
        print(prompt_temp)
        completion2 = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=prompt_temp,
            stop=['User: '],
            max_tokens=245,
            temperature=0.7,
            presence_penalty=0.9,
            frequency_penalty=0.5,
            n=1
        )
        temp = completion2["choices"][0]["message"]['content']
        result.append(temp)

    print(result)
    return {"options": result, "module": module}


@app.post("/review")
async def calc(request: Request):
    body = await request.json()
    text = body['text']
    user = body['user']
    num = body['num']
    turn = body['turn']
    topic = ""
    module = body['module']
    model = body['model']
    print(turn)

    response_text = m1_1_standalone_review(text, turn, module, model)
    upload(response_text, user, num, topic)


@app.post("/")
async def calc(request: Request):
    body = await request.json()
    text = body['text']
    user = body['user']
    num = body['num']
    turn = body['turn']
    topic = ""

    if turn >= 999999:
        result = downloadConversation(user, num)
        topic = topicExtraction(result)
        response_text = m1_3(text, topic)

    elif turn >= 999999:
        response_text = m1_2(text)

    else:
        response_text = m1_1(text)
    upload_1(response_text, user, num, topic)


@app.post("/standalone")
async def calc(request: Request):
    body = await request.json()
    text = body['text']
    user = body['user']
    num = body['num']
    turn = body['turn']
    topic = ""
    module = body['module']
    print(turn)

    response_text = m1_1_standalone(text, turn, module)
    upload(response_text, user, num, topic)


@app.post("/diary")
async def calc(request: Request):
    body = await request.json()
    user = body['user']
    num = body['num']

    print("다이어리 요청이 들어왔습니다.")
    delete_diary(user, num)
    result2 = makeDiary(text)
    upload_diary(result2, user, num)
