import React, { useState } from "react";
import { askQuestion } from "../api";

const AskQuestion = () => {
    const [question, setQuestion] = useState("");
    const [fileId, setFileId] = useState("");
    const [answer, setAnswer] = useState("");

    const handleAsk = async () => {
        if (!question || !fileId) {
            alert("Please provide a question and file ID.");
            return;
        }

        try {
            const response = await askQuestion(question, fileId);
            setAnswer(response.answer);
        } catch (error) {
            console.error(error);
            setAnswer("Failed to fetch an answer.");
        }
    };

    return (
        <div>
            <h2>Ask a Question</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here"
            />
            <input
                type="text"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                placeholder="Enter file ID"
            />
            <button onClick={handleAsk}>Ask</button>
            <p>Answer: {answer}</p>
        </div>
    );
};

export default AskQuestion;
