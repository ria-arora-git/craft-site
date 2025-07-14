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
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [localFiles, projectId, autosave]);

  return (
    <div>
      <div className="flex space-x-2 overflow-x-auto mb-2">
        {Object.keys(localFiles).map((file) => (
          <button
            key={file}
            className={`px-3 py-1 rounded ${
              file === activeFile ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveFile(file)}
          >
            {file}
          </button>
        ))}
      </div>

      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={localFiles[activeFile]}
        onChange={(value) => {
          if (value) {
            setLocalFiles({ ...localFiles, [activeFile]: value });
          }
        }}
      />

      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => onDeploy(localFiles)}
      >
        Deploy Site
      </button>
    </div>
  );
}
