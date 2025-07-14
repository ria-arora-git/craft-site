"use client";
import { useState } from "react";

interface PromptFormProps {
  onSubmit: (input: { prompt: string; stack: string }) => void;
}

export default function PromptForm({ onSubmit }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [stack, setStack] = useState("nextjs-tailwind");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ prompt, stack }); }} className="bg-white text-black p-6 rounded-lg shadow-md space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Describe your site</span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. portfolio site for a designer"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Tech Stack</span>
        <select
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="nextjs-tailwind">React + Next.js + Tailwind</option>
          <option value="vanilla">HTML + CSS + JS</option>
          <option value="react">React (Vite)</option>
        </select>
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition"
      >
        Generate Code
      </button>
    </form>
  );
}
