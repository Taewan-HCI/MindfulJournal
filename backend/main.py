import uvicorn

#
# if __name__ == "__main__":
#     uvicorn.run("app.analyze_text_with_llm:app", host="0.0.0.0", port=8000, reload=True)
#
if __name__ == "__main__":
    uvicorn.run("app.gpt3-chat_direct:app", host="0.0.0.0", port=8000, reload=True)
#
# if __name__ == "__main__":
#     uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)
