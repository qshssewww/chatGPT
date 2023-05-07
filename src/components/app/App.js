import React, {useEffect, useState} from "react";
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import {Configuration, OpenAIApi} from "openai"
import Request from "../request/Request";

function App() {

    const [question, setQuestion] = useState('')
    const [requestHistory, setRequestHistory] = useState([])
    const [lastEnterPressTime, setLastEnterPressTime] = useState(0)

    const persistedValue = JSON.parse(localStorage.getItem('requestHistory'));

    useEffect(() => {
        if(!localStorage.getItem('apiKey')){
            alert('введлите свой api ключ в поле ввода запроса')
        }
        setRequestHistory(persistedValue?.length ? (persistedValue) : [])
    }, [])

    useEffect(() => {
        localStorage.setItem('requestHistory', JSON.stringify(requestHistory))
    }, [requestHistory])

    const openai = new OpenAIApi(new Configuration({
        apiKey: localStorage.getItem('apiKey')
    }))

    const popAQuestion = () => {
        if(!localStorage.getItem('apiKey')){
            localStorage.setItem('apiKey', question)
        } else {
            if(requestHistory.length === 10){
                let arr = requestHistory
                arr.shift()
                setRequestHistory(arr)
            }
            if(question.length > 0){
                let questions = ''
                for(let i = 0; i < persistedValue.length; i++){
                    questions += persistedValue[i].questionText
                }
                openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {role: "system", content: questions},
                        {role: "user", content: question}
                    ]
                }).catch(e => {
                    alert('ошибка загрузки!')
                    console.error(e)
                }).then(res => {
                    setRequestHistory([...requestHistory, {
                        questionText: question,
                        responseText: res.data.choices[0].message.content
                    }])
                })
            }
        }
        setQuestion('')
    }

    const enterKey = (e) => {
        if(e.keyCode === 13){
            const currentTime = new Date().getTime();
            if (currentTime - lastEnterPressTime < 650) {
                e.preventDefault()
                popAQuestion()
            }
            setLastEnterPressTime(currentTime)
        }
    }

    return (
        <div style={requestHistory.length > 0 ? {justifyContent: "space-between"} : {justifyContent: "flex-end"}} className="App">
            <div className={'requestHistory'}>
                {
                    requestHistory?.map((obj, i) => (
                        <Request key={i} response={obj.responseText} question={obj.questionText}/>
                    ))
                }
            </div>
            <div className={'question_block'}>
                <Form.Control value={question} onKeyDown={e => enterKey(e)} onChange={e => setQuestion(e.target.value)} className={'question_area'} placeholder={localStorage.getItem('apiKey') ? 'Задай свой вопрос...': 'введите свой api ключ...'} type={'text'} as="textarea" size={"lg"} />
                <svg onClick={popAQuestion} xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor"
                     className="vastex-img" viewBox="0 0 16 16">
                    <path
                        d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
            </div>
        </div>
    );
}

export default App;
