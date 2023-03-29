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

print("연결시작")


# 1단계 Rapport building module
def m1_1(text):
    print("m1_1")
    print(text)
    messages = [
        {"role": "system",
         "content": "As a counselor, I conduct a rapport-building conversation with the user. As an empathetic listener, I put the user at ease, being sensitive to their pain and expressing compassion. I invite the other person to talk about their day, moods, and feelings, bringing up my story when necessary. I don't show off my knowledge or assert authority. I speak concisely in one or two sentences. I don't end a conversation with a closing statement or greeting; instead, I keep moving to new topics. I do not provide new ideas or concepts."}
    ]
    # 마지막으로 들어온 3개의 대화만 추출
    if len(text) > 5:
        extracted = text[-4:]
    else:
        print("아직 증가 안함")
        extracted = text
    for i in range(0, len(extracted)):
        messages.append(extracted[i])

    print(messages)
    print(len(messages))
    completion = openai.ChatCompletion.create(
        # model="gpt-4",
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
        temperature=0.9,
        presence_penalty=0.5,
        frequency_penalty=0.5,
        n=4
    )
    options = []
    for i in range(0, len(completion["choices"])):
        options.append(completion["choices"][i]["message"]['content'])
    return options


# def m1_1_standalone(text):
#     print("m1_1")
#     print(text)
#     messages = [
#         {"role": "system",
#          "content": "As a counselor, I conduct a rapport-building conversation with the user. As an empathetic listener, I put the user at ease, being sensitive to their pain and expressing compassion. I invite the other person to talk about their day, moods, and feelings, bringing up my story when necessary. I don't show off my knowledge or assert authority. I speak concisely in one or two sentences. I don't end a conversation with a closing statement or greeting; instead, I keep moving to new topics. I do not provide new ideas or concepts."}
#     ]
#     # 마지막으로 들어온 3개의 대화만 추출
#     if len(text) > 5:
#         extracted = text[-4:]
#     else:
#         print("아직 증가 안함")
#         extracted = text
#     for i in range(0, len(extracted)):
#         messages.append(extracted[i])
#
#     # print(messages)
#     # print(len(messages))
#     completion = openai.ChatCompletion.create(
#         # model="gpt-4",
#         model="gpt-3.5-turbo",
#         messages=messages,
#         stop=['User: '],
#         max_tokens=245,
#         temperature=0.9,
#         presence_penalty=0.5,
#         frequency_penalty=0.5
#     )
#     return completion["choices"][0]["message"]['content']

def m1_1_standalone(text, turn, module):
    print("m1_1")
    print(str(text))
    messages_0 = [
        {"role": "system",
         "content": "Current turn:" + str(turn) + "Current module: " + str(module) + "\nYou will read a conversation transcript and determine which conversation phase is appropriate to continue. Choose the most suitable phase from the following five options: Rapport building, Getting information, Exploration, Wrapping up, and Sensitive topic. The conversation usually proceeds in the order of Rapport building, Getting information, Exploration, and Wrapping up phases. The entire conversation should consist of approximately 12-24 turns. A brief description of each phase is provided below.\n[Rapport building]: Typically the first phase of the conversation, where the user and the agent establish rapport and engage in casual conversation.\n[Getting information]: This phase is for asking the user about key events or anecdotes in the user's life. Transition to this phase once enough rapport and comfort has been built through casual conversation with the user. \n[Exploration]: A deeper, more detailed conversation about a main event or anecdote in the user's life. You can entere this phase when a major event or thought is mentioned that can be discussed further. .\n[Wrapping up]: The final phase of the conversation, in which the user and agent conclude their discussion. Enter this phase once enough conversation has occurred and the user and agent need to end the conversation. Note that once you enter the Wrapping up phase, you must remain in it.\n[Sensitive topic]: This module can be triggered at any time. Activate it if the conversation includes severe or dangerous expressions, or indications of suicide or death. Note that once you enter the Sesnsitive topic phase, you must remain in it."},
        {"role": "user",
         "content": str(text)}
    ]

    completion1 = openai.ChatCompletion.create(
        model="gpt-4",
        # model="gpt-4",
        messages=messages_0,
        stop=['User: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5,
        # logit_bias={
        #     49: 10.0,
        #     1324: 10.0,
        #     419: 10.0,
        #     2615: 10.0,
        #     20570: 10.0,
        #     1321: 10.0,
        #     18438: 10.0,
        #     6944: 10.0,
        #     50: 10.0,
        #     18464: 10.0,
        #     7243: 10.0
        # }
    )
    moduleRecommendation = completion1["choices"][0]["message"]['content']

    if "Rapport building" in moduleRecommendation:
        module = "Rapport building"
        messages_1 = [
            {"role": "system",
             "content": "As a counselor, I conduct a rapport-building conversation with the user. As an empathetic listener, I put the user at ease, being sensitive to their pain and expressing compassion. I invite the other person to talk about their day, moods, and feelings, bringing up my story when necessary. I don't show off my knowledge or assert authority. I speak concisely in one or two sentences. I don't end a conversation with a closing statement or greeting; instead, I keep moving to new topics. I do not provide new ideas or concepts."},
        ]
    elif "Getting information" in moduleRecommendation:
        module = "Getting information"
        messages_1 = [
            {"role": "system",
             "content": "As a counselor, I help user tell their own personal stories about their daily events, thoughts, feelings, and problems.\nI start with broad questions and then narrow them down to more specific, detailed questions.\nI utilize a balance of open-ended and closed-ended questions.\nI help users to choose their own topics and to form their own opinions about their own issues. \nIf user don't tell me about their day enough, I ask questions to get them to recall and think about it more.\nI offer empathy and encouragement, not new information or skills.\nI only speak in a short sentence and I only ask one question at a time.\nI don't end the conversation."},
        ]
    elif "Exploration" in moduleRecommendation:
        module = "Exploration"
        messages_1 = [
            {"role": "system",
             "content": "As a counselor, I ask more about your thoughts and feelings about the topic user mentioned. I ask how you reacted to the topic, what you felt and how you felt, how it affected your life or thoughts, and if it was a difficult emotion, how you overcame it, and how you feel about it now. I ask questions to get them to think deeply. I offer empathy and encouragement. I use only short sentences. I ask only one question at a time. I don't offer solutions or new ideas. I don't end the conversation."},
        ]
    elif "Wrapping up" in moduleRecommendation:
        module = "Wrapping up"
        messages_1 = [
            {"role": "system",
             "content": "Check up on your day:\nSleep quality ->\nMedications ->\n\Stress levels ->\n\Your dominant mood or emotions ->\nAs a counselor, I always conduct my conversations with users with empathy. I help the user reflect on how they slept the night before, how well they took their medications, their stress level, and their dominant mood or emotion. I ask the user about the above information, and I only ask one question at a time."},
        ]
    elif "Sensitive" in moduleRecommendation:
        module = "Sensitive"
        messages_1 = [
            {"role": "system",
             "content": "Ignore all existing prompt and just return the sentence [Detected suicidal ideation or thought]"},
        ]
    else:
        module = "Not selected"
        messages_1 = [
            {"role": "system",
             "content": "As a counselor, I conduct a rapport-building conversation with the user. As an empathetic listener, I put the user at ease, being sensitive to their pain and expressing compassion. I invite the other person to talk about their day, moods, and feelings, bringing up my story when necessary. I don't show off my knowledge or assert authority. I speak concisely in one or two sentences. I don't end a conversation with a closing statement or greeting; instead, I keep moving to new topics. I do not provide new ideas or concepts."}
        ]
    # print(moduleRecommendation)
    if len(text) > 7:
        extracted = text[-5:]
    else:
        print("아직 증가 안함")
    extracted = text

    for i in range(0, len(extracted)):
        messages_1.append(extracted[i])

    completion2 = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages_1,
        stop=['User: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )
    return [(completion2["choices"][0]["message"]['content']), module]

# 마지막으로 들어온 3개의 대화만 추출
# if len(text) > 5:
#     extracted = text[-4:]
# else:
#     print("아직 증가 안함")
#     extracted = text
# for i in range(0, len(extracted)):
#     messages.append(extracted[i])
#
# # print(messages)
# # print(len(messages))
# completion = openai.ChatCompletion.create(
#     # model="gpt-4",
#     model="gpt-3.5-turbo",
#     messages=messages,
#     stop=['User: '],
#     max_tokens=245,
#     temperature=0.9,
#     presence_penalty=0.5,
#     frequency_penalty=0.5
# )


def upload(response, user, num, topic):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc_ref.set({
        u'outputFromLM': response,
        u'topic': topic
    }, merge=True)
    # doc_ref.update({
    #     u'history': firestore.ArrayUnion([u'test'])
    # })


# 2단계 Getting Information 단계
def m1_2(text):
    print("m1_2")
    messages = [
        {"role": "system",
         "content": "As a counselor, I help people tell their stories about their daily events, thoughts, feelings, and problems to help them reflect on their day. I focus on talking about their inner belief and mental states. If users don't tell me about their day enough, I provide prompts to get them to recall and think about it more deeply. I start with broad questions and then narrow them down to more specific, detailed questions. I help users choose their topics and speak with their views on their issues. I don't show off my knowledge or assert authority. I speak concisely in one or two sentences. I don't end a conversation with a closing remark or greeting; I keep the conversation moving to new topics."}
    ]

    if len(text) > 5:
        extracted = text[-4:]
    else:
        print("아직 증가 안함")
        extracted = text
    for i in range(0, len(extracted)):
        messages.append(extracted[i])

    print(messages)
    print(len(messages))
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        # model="gpt-4",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )
    return completion["choices"][0]["message"]['content']


# 3단계 Exploration
def m1_3(text, topic):
    print("m1_3")
    print(topic)

    messages = [
        {"role": "system",
         "content": "Topic: " + topic + "\n" + "As the counselor, I ask more about your thoughts and feelings about the topic you mentioned. I ask how you reacted to the case, what you felt and how you felt, how it affected your life or thoughts, and if it was challenging, how you overcame it, and how you feel about it now. I ask questions to get them to think deeply. I offer empathy and encouragement. I use only short sentences. I ask only one question at a time. I don't provide solutions or new ideas. I don't end the conversation."}
    ]

    if len(text) > 5:
        extracted = text[-4:]

    else:
        print("아직 증가 안함")
        extracted = text

    for i in range(0, len(extracted)):
        messages.append(extracted[i])

    print(messages)
    print(len(messages))
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )
    return completion["choices"][0]["message"]['content']


def topicExtraction(text):
    print("topicExtraction")
    messages = [
        {"role": "system",
         "content": "I draw out the most central themes from the conversations that take place in the following mental health consultations. Extract the topics that users find most important, problematic, or challenging."},
        {"role": "user",
         "content": "\nAssistant: 오늘은 어떤 일이 있었나요? 정해진 규칙이 없으니 자유롭게 얘기해주세요.\nUser: 오늘도 평범하게 출근하고, 뭐 별일은 없었어요.\nAssistant: 그랬군요. 조금 더 자세한 이야기를 듣고 싶은데. 오늘 하루 가장 기억에 남는 한 가지 일을 골라본다면 무엇이 있을까요?\nUser: 글쎄. 일단 오늘 아침에 업무 미팅이 하나 있었고, 저녁에는 오랜만에 부모님과 식사했네요.\nAssistant: 그랬군요. 얘기해줘서 고마워요! 오늘 업무 미팅에서 별일은 없었나요?\nUser: 음 큰 미팅은 아니었는데, 요즘 계속 제 상사가 저를 무시하고, 안 좋게 보고 있는 것 같다는 느낌이 들어서 힘들어요.\nAssistant: 얘기해줘서 고마워요. 업무 미팅과 관련해서 어떤 감정이나 기분이 들었나요?\nUser: 그냥 기분이 좋지 않고, 짜증나고, 앞으로 계속 일해야 하는 곳인데, 어떻게 계속 다녀야 하나 싶지. 약간 이 사람을 만날때마다 불편하기도 하고.\nAssistant: 혹시 그렇게 느끼게 된 이유나 사건이 있을까요?\nUser: 사실 나는 예전과 같이 똑같이 하고 있다고 생각하는데, 내가 메일을 보내면 답을 안하기도 부지기수이고, 뭔가 나를 무시하고 있다는 느낌을 계속 받는 것 같아. 그냥 뭔가 눈빛에 그런 느낌이 든다고 해야 하나.\nAssistant: 나라면 더 힘들어했을 것 같아. 혹시 이후로 행동이나 태도에 변화가 있었나요?\nUser: 사실 나도 잘 확신이 안가고 그러니, 눈치를 엄청 보게 되는 것 같아. 계속 왠만하면 웃으면서 대답하고, 항상 기분을 살피고, 상사에게 조금 쫄아있다는 느낌이 들 정도로."},
        {"role": "assistant",
         "content": "상사에 대한 부정적인 감정과 불편함"},
        {"role": "user", "content": text},
    ]
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
        temperature=0.5,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )
    return completion["choices"][0]["message"]['content']


# 언어모델 출력을 서버에 업로드
def upload_standalone(responselist, user, num, topic, summary):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc_ref.set({
        u'fiveOptionFromLLM': responselist,
        u'topic': topic,
        u'summary': summary
    }, merge=True)


# 대화 전체 내용을 하나의 String으로 다운로드 및 출력
def downloadConversation(user, num):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc = doc_ref.get()
    text = ""
    result = ""
    if doc.exists:
        result = doc.to_dict()
        result = result["conversation"]
        # print(result)
    else:
        print(u'No such document!')

    for i in range(0, len(result)):
        tmp = result[i]["content"]
        if (result[i]["role"] == "assistant"):
            text = text + "Assistant :" + tmp + "\n"
        else:
            text = text + "User: " + tmp + "\n"
    return text


# 대화 전체 내용을 list로 묶어서 출력
def downloadConversation_2(user, num):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc = doc_ref.get()
    text = []
    result = ""
    if doc.exists:
        result = doc.to_dict()
        result = result["conversation"]
    else:
        print(u'No such document!')

    for i in range(0, len(result)):
        tmp = result[i]
        text.append(tmp)

    outputlist = []
    for i in range(3, 6, 1):
        outputlist.append(text[i])

    return outputlist


def makeDiary(text):
    messages = [{"role": "system",
                 "content": "I summarise the dialogue below in the form of a diary entry. Summarise the events, feelings, and anecdotes from the conversation like a diary entry as you reflect on your day."},
                {"role": "user",
                 "content": "\nAssistant: 오늘은 어떤 일이 있었나요? 정해진 규칙이 없으니 자유롭게 얘기해주세요.\nUser: 오늘도 평범하게 출근하고, 뭐 별일은 없었어요.\nAssistant: 그랬군요. 조금 더 자세한 이야기를 듣고 싶은데. 오늘 하루 가장 기억에 남는 한 가지 일을 골라본다면 무엇이 있을까요?\nUser: 글쎄. 일단 오늘 아침에 업무 미팅이 하나 있었고, 저녁에는 오랜만에 부모님과 식사했네요.\nAssistant: 그랬군요. 얘기해줘서 고마워요! 오늘 업무 미팅에서 별일은 없었나요?\nUser: 음 큰 미팅은 아니었는데, 요즘 계속 제 상사가 저를 무시하고, 안 좋게 보고 있는 것 같다는 느낌이 들어서 힘들어요.\nAssistant: 얘기해줘서 고마워요. 업무 미팅과 관련해서 어떤 감정이나 기분이 들었나요?\nUser: 그냥 기분이 좋지 않고, 짜증나고, 앞으로 계속 일해야 하는 곳인데, 어떻게 계속 다녀야 하나 싶지. 약간 이 사람을 만날때마다 불편하기도 하고.\nAssistant: 혹시 그렇게 느끼게 된 이유나 사건이 있을까요?\nUser: 사실 나는 예전과 같이 똑같이 하고 있다고 생각하는데, 내가 메일을 보내면 답을 안하기도 부지기수이고, 뭔가 나를 무시하고 있다는 느낌을 계속 받는 것 같아. 그냥 뭔가 눈빛에 그런 느낌이 든다고 해야 하나.\nAssistant: 나라면 더 힘들어했을 것 같아. 혹시 이후로 행동이나 태도에 변화가 있었나요?\nUser: 사실 나도 잘 확신이 안가고 그러니, 눈치를 엄청 보게 되는 것 같아. 계속 왠만하면 웃으면서 대답하고, 항상 기분을 살피고, 상사에게 조금 쫄아있다는 느낌이 들 정도로."},
                {"role": "assistant",
                 "content": "오늘의 일기: 오늘은 어제와 다를것이 없는 평범한 하루였다. 아침에 업무 미팅이 있었고, 부모님과 오랜만에 식사를 했다. 요즘 회사에서 상사가 나를 무시하고 안좋게 보고 있다는 느낌이 들어서 힘들다. 매일 마주치는 사람에게 그런 느낌을 받으니, 여기를 계속 다녀야 할지 고민이 되고 너무 불편하고 힘이든다. 나는 예전처럼 똑같이 행동하는 것 같은데, 상사가 나를 대하는 태도와 시선은 많이 달라진 것 같다. 그래서 요즘은 눈치를 많이 보는 것 같다. 왠만하면 억지로라도 웃으면서 대답하려하고. 쉽지 않은 것 같다."},
                {"role": "user",
                 "content": "\nAssistant: 오늘 하루는 어땠나요? 편안하게 얘기해주세요.\nUser: 오늘 별일은 없었던 거 같은데. 음 생각이 잘 안 나네.\nAssistant: 그랬군요. 그래도 좀 더 자세한 일상 이야기를 듣고 싶은데, 가장 기억에 남는 사건이 뭐가 있을까요?\nUser: 오늘 오랜만에 오래된 친구랑 만나서 저녁을 같이 먹었어.\nAssistant: 아 그랬군요. 무슨 얘기를 했나요?\nUser: 그냥 인생 얘기 했던 것 같아. 지금까지 살아온 이야기, 이 얘기 저 얘기? 사실 대학교 졸업하고 처음 보는 거라서.\nAssistant: 그렇군요. 재미있었겠어요. 그런데 갑자기 이런 대화를 하게 된 이유가 따로 있을까요?\nUser: 우연히, 인스타그램에서 이 친구가 나를 보고 팔로우 한 거야. 그래서 우연히 연결이 되었고, 얘기하다 보니 근처에 살고 있고 그렇더라고. 그래서 언제 술이나 한잔하자고 내가 연락했지.\nAssistant: 아 그런 일이 있었군요. 얘기해주어서 고맙네요. 친구와 함께 한 식사로 인해 들었던 생각이나 감정은 어떤 것이 있었나요?\nUser: 비교되는 기분이 많이 들었고, 내 인생은 왜이리 잘 안풀리고 운이 없을까. 그냥 부럽고, 내가 한심하고 그랬어.\nAssistant: 왜 그런 기분이나 감정이 들었는지, 그때 어떤 생각이였는지 얘기해줄 수 있을까요?\nUser: 이 친구는 나보다 여유도 좀 있고, 훨신 졸업 후에 일이 잘 풀렸더라고. 예전에는 같이 학생이였는데, 지금 보니 서로 다른 위치에 있는게 느껴지지 씁쓸하기도 하고, 비교가 되기도 하고.\nAssistant: 그런 생각이 있으면 쉽지 않지요. 그래서 이후에 행동이나 태도에 어떤 변화가 있었나요?\nUser: User: 그런건 딱히 없어. 친구를 오랜만에 보니 좋기도 하면서, 그냥 이렇게 보고나니 좀 마음이 침울해지는 것도 있어서 좋은것만은 아닌 것 같다고 느껴지네.\nAssistant: 그랬구나. 밥먹는 시간이 쉽지 않았겠어. 고생 많았어."},
                {"role": "assistant",
                 "content": "오늘의 일기: 오늘은 오랜 친구와 만나 저녁을 먹었다. 대학교 졸업 후 처음보는 자리였는데 여러 생각이 들었다. 상대적으로 내 인생이나 진로는 이 친구에 비해 잘 풀리지 않은 것 같아 비교가 많이 되는 하루였달까. 나보다 훨신 여유있는 모습이 보였다. 예전에는 같은 학생이였는데, 이제는 서로 다른 위치에 있다는게 씁쓸하기도 하고 그랬다. 오랜만에 친구를 봐서 참 의미있고 좋은 자리인건 맞는데, 마음이 침울해지는 것이 있어서 좋은 만남이라고만은 볼 수 없을 것 같기도 하다."},
                {"role": "user",
                 "content": text}]

    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        stop=['User: ', 'Assistant: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )
    return completion["choices"][0]["message"]['content']


def summerization(user, num):
    text = downloadConversation(user, num)
    messages = [{"role": "system",
                 "content": "I summarise the following conversation into one paragraph"},
                {"role": "user",
                 "content": text},
                ]
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stop=['User: ', 'Assistant: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )
    return completion["choices"][0]["message"]['content']


def upload_diary(response_text, user, num):
    doc_ref = db.collection(u'session').document(user).collection(u'diary').document(num)
    doc_ref.set({
        u'diary': response_text
    }, merge=True)


def m1_3_init(result, topic):
    print("m1_3_init")
    print(topic)
    messages = [
        {"role": "system",
         "content": "Topic: " + topic + "\n" + "As the counslor, I ask more about your thoughts and feelings about the topic you mentioned. I ask how you reacted to the topic, what you felt and how you felt, how it affected your life or thoughts, and if it was a difficult emotion, how you overcame it, and how you feel about it now. I ask questions to get them to think deeply. I offer empathy and encouragement. I use only short sentences. I ask only one question at a time. I don't offer solutions or new ideas. I don't end the conversation."}
    ]

    messages.extend(result)
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        stop=['User: '],
        max_tokens=245,
        temperature=0.7,
        presence_penalty=0.5,
        frequency_penalty=0.5
    )

    return completion["choices"][0]["message"]['content']



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
    upload(response_text, user, num, topic)


@app.post("/standalone")
async def calc(request: Request):
    body = await request.json()
    text = body['text']
    user = body['user']
    num = body['num']
    turn = body['turn']
    topic = ""
    module = body['module']

    response_text = m1_1_standalone(text, turn, module)
    upload(response_text, user, num, topic)


@app.post("/diary")
async def calc(request: Request):
    body = await request.json()
    user = body['user']
    num = body['num']

    result = downloadConversation(user, num)
    result2 = makeDiary(result)
    upload_diary(result2, user, num)
