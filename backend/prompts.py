
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

output example : [{"word": "죽다", "sentiment": "위험", "count": 1}]

\n Do not repeat my request. Do not show each steps. Just show me value of 'lists' without any comments'. Keep answer short. 
'''

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