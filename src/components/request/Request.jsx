import React from 'react';
import './Request.css'

const Request = ({response, question, i}) => {

    return (
        <div key={i} className={'request'}>
            <div className={'question response_block'}>
                <img src="/user.png" alt="user-icon" width={34} height={34}/>
                <p className={'question_text response_text'}>{question}</p>
            </div>
            <div className={'response_block'}>
                <img src="/chatgpt-icon.svg" alt="gpt-icon" width={34} height={34}/>
                <p className={'response_text'}>{response}</p>
            </div>
        </div>
    );
};

export default Request;