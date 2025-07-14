
"use client";
import { useState, useEffect } from "react";
import PromptForm from "./client/components/PromptForm";
import CodeEditor from "./client/components/CodeEditor";
import { useUser } from "@clerk/nextjs";
import { FileMap } from "../app/shared/types";

export default function Home() {
  const { user } = useUser();
  const [codeFiles, setCodeFiles] = useState<FileMap | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [prompt, setPrompt] = useState("");
  const [stack, setStack] = useState("nextjs-tailwind");
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !projectId) return;
    fetch(`/server/api/project?id=${projectId}&uid=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCodeFiles(data.files);
        setPrompt(data.prompt);
        setStack(data.stack);
        setCustomDomain(data.domain || "");
        setDeployedUrl(data.url);
      });
  }, [projectId, user]);

  const handleSubmit = async (input: { prompt: string; stack: string }) => {
    setPrompt(input.prompt);
    setStack(input.stack);
    const res = await fetch("/server/api/generate", {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setCodeFiles(data.files);
  };

  const handleDeploy = async (files: FileMap) => {
    const res = await fetch("/server/api/deploy", {
      method: "POST",
      body: JSON.stringify({
        files,
        domain: customDomain,
        uid: user?.id,
        prompt,
        stack,
        projectId,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setDeployedUrl(data.url);
    setProjectId(data.projectId);
    alert("Your site is live at: " + data.url);
  };

  const handleEditProject = async (id: string) => {
    setProjectId(id);
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Website Generator</h1>
      {user && <p className="mb-4 text-sm text-gray-600">Logged in as {user.emailAddresses[0].emailAddress}</p>}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <ul id="project-list" className="space-y-3"></ul>
        {user && (
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded mt-2"
            onClick={async () => {
              const res = await fetch(`/server/api/sites?uid=${user.id}`);
              const data = await res.json();
              const list = document.getElementById("project-list");
              if (list) {
                list.innerHTML = data
                  .map(
                    (p: { prompt: string; url: string; id: string }) => `
                  <li class="border p-2 rounded">
                    <p><b>${p.prompt}</b></p>
                    <p><a class="text-blue-500" href="${p.url}" target="_blank">${p.url}</a></p>
                    <button class="bg-indigo-600 mt-2 px-3 py-1 text-white rounded" onclick="window.handleEdit('${p.id}')">Edit</button>
                  </li>
                `
                  )
                  .join("");
              }
              // @ts-ignore
              window.handleEdit = handleEditProject;
            }}
          >
            Load Projects
          </button>
        )}
      </section>

      {!codeFiles ? (
        <PromptForm onSubmit={handleSubmit} />
      ) : (
        <>
          <label className="block mb-2 mt-6">
            Custom Domain (optional):
            <input
              type="text"
              placeholder="yourdomain.com"
              className="w-full mt-1 border p-2 rounded"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </label>
          <CodeEditor
            files={codeFiles}
            onDeploy={handleDeploy}
            projectId={projectId}
            autosave={true}
          />

          {deployedUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
              <iframe
                src={deployedUrl}
                className="w-full h-[600px] border rounded"
                title="Live Preview"
              ></iframe>
            </div>
          )}
        </>
      )}
    </main>
  );
}

