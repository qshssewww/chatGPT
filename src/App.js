import React, {useState} from "react";
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import {Configuration, OpenAIApi} from "openai"

function App() {

    const [question, setQuestion] = useState('')
    const [response, setResponse] = useState('')

    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.REACT_APP_API_KEY
    }))

    const popAQuestion = () => {
        setQuestion('')
        openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: question}]
        }).catch(e => {
            console.error(e)
        }).then(res => {
            setResponse(res.data.choices[0].message.content)
        })
    }

    return (
        <div className="App">
            <div className={'response_text'}>{response}</div>
            <div className={'question_block'}>
                <Form.Control value={question} onChange={e => setQuestion(e.target.value)} className={'question_text'} placeholder={'Задай свой вопрос...'} type={'text'} as="textarea" size={"lg"} />
                <img onClick={popAQuestion} className={'vastex-img'} src="/vastex.jpg" width={33} height={33} alt=""/>
            </div>
        </div>
    );
}

export default App;
