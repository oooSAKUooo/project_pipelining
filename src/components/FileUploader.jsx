import React, { useRef } from "react";

function FileUploader({ onFileParsed }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      onFileParsed(lines);
      inputRef.current.value = "";
    };
    if (file) reader.readAsText(file);
  };

  return (
    <div className="text-center">
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleFile}
        className="p-2 border rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
    </div>
  );
}

export default FileUploader;