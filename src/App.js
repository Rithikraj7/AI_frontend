import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import userImage from './assets/image.jpg';
import "./App.css";

const BASE_URL = "https://ai-backend-htqj.onrender.com";

const App = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);

  // Function to upload file to the backend
  const uploadFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        setFileName(file.name);
        setPopupVisible(false);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const askQuestion = async (fileId, question) => {
    console.log(fileId, question);
    if (!fileId || !question) return;

    try {
      const params = new URLSearchParams();
      params.append("file_id", fileId);
      params.append("question", question);

      const response = await fetch(`${BASE_URL}/ask/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from backend:", data);

        // Add the bot's response correctly, avoid adding an empty message
        if (data.answer && data.answer.trim() !== "") {
          setChat((prevChat) => [
            ...prevChat,
            { user: "Bot", text: data.answer },
          ]);
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to get response for the question:", errorText);
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };




  // Function to delete a file
  const deleteFile = async () => {
    if (!fileName) return;

    try {
      // Use fileName as a path parameter
      const response = await fetch(`${BASE_URL}/delete/${fileName}`, {
        method: "DELETE",  // DELETE method to delete the file
        headers: {
          "Content-Type": "application/json", // Content-Type header for JSON
        },
      });

      if (response.ok) {
        console.log("File deleted successfully");
        setFileName(""); // Clear the file name after deletion
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };



  const handleFileUpload = () => {
    uploadFile(file); // Call the API to upload the file
  };

  const handleSendMessage = (fileName, message) => {
    if (!message) return;

    // Add the user's message to the chat
    setChat((prevChat) => [
      ...prevChat,
      { user: "User", text: message },
    ]);

    // Call the API and get the bot's response
    askQuestion(fileName, message).then(() => {
      // No need to manually update the chat state again here
      // The `askQuestion` function will handle updating the chat with the bot's response
    });

    setInputMessage(""); // Clear the input field after sending the message
  };



  const handleFileNameClick = () => {
    deleteFile(); // Call the API to delete the file
  };

  return (
    <div>
      <header className="header">
        <div className="header-logo">
          <img
            src="https://framerusercontent.com/images/aH0aUDpSiUrVC1nwJAwiUCXUtU.svg?scale-down-to=512"
            alt="ChatApp Logo"
            className="logo-image"
          />
        </div>
        <div className="header-actions">
          {fileName ? (
            <>
              <button onClick={handleFileNameClick} className="file-name-btn">
                {fileName}
              </button>
            </>
          ) : null}
          <button onClick={() => setPopupVisible(true)} className="upload-btn">
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </button>
        </div>
      </header>

      <div className="chat-container">
        {chat.map((msg, index) => (
          <div className="chat-message" key={index}>
            <div className="user-icon">
              {msg.user === "User" ? (
                // User's message (Face circle icon)
                <div className="user-avatar-circle">{"R"}</div>
              ) : (
                // Bot's message (Bot's image)
                <img src={userImage} alt="Bot Avatar" className="user-avatar" />
              )}
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>


      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputMessage);
            }
          }}
        />
        <button onClick={() => handleSendMessage(fileName, inputMessage)} className="send-btn">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>

      {isPopupVisible && (
        <div className="upload-popup">
          <h3>Upload File</h3>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.docx,.png,.jpg,.jpeg"
          />
          {file && <p>Preview: {file.name}</p>}
          <button onClick={handleFileUpload}>Upload</button>
        </div>
      )}
    </div>
  );
};

export default App;
