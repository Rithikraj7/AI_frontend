import React, { useState } from "react";
import { uploadPDF } from "../api";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload!");
            return;
        }

        try {
            const response = await uploadPDF(file);
            setUploadStatus("File uploaded successfully!");
            console.log("Upload Response:", response);
        } catch (error) {
            setUploadStatus("Failed to upload file.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Upload PDF</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{uploadStatus}</p>
        </div>
    );
};

export default Upload;
