"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { FileMap } from "../../shared/types";

interface CodeEditorProps {
  files: FileMap;
  onDeploy: (files: FileMap) => void;
  projectId?: string;
  autosave?: boolean;
}

export default function CodeEditor({ files, onDeploy, projectId, autosave }: CodeEditorProps) {
  const [activeFile, setActiveFile] = useState<string>(Object.keys(files)[0]);
  const [localFiles, setLocalFiles] = useState<FileMap>(files);

  useEffect(() => {
    if (autosave && projectId) {
      const timeout = setTimeout(() => {
        fetch("/server/api/autosave", {
          method: "POST",
          body: JSON.stringify({ projectId, files: localFiles }),
          headers: { "Content-Type": "application/json" },
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [localFiles, projectId, autosave]);

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-100 p-2 flex space-x-2 border-b">
        {Object.keys(localFiles).map((file) => (
          <button
            key={file}
            className={`px-3 py-1 rounded-md text-sm ${
              file === activeFile ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveFile(file)}
          >
            {file}
          </button>
        ))}
      </div>

      <Editor
        height="400px"
        defaultLanguage="javascript"
        value={localFiles[activeFile]}
        onChange={(val) => {
          if (val !== undefined) setLocalFiles({ ...localFiles, [activeFile]: val });
        }}
        className="border-b"
      />

      <div className="p-4 flex justify-end bg-white space-x-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
          onClick={() => onDeploy(localFiles)}
        >
          Deploy Site
        </button>
      </div>
    </div>
  );
}
