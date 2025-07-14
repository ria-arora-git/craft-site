"use client";
import { useState } from "react";

interface PromptFormProps {
  onSubmit: (input: { prompt: string; stack: string }) => void;
}

export default function PromptForm({ onSubmit }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [stack, setStack] = useState("nextjs-tailwind");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ prompt, stack });
      }}
      className="space-y-4"
    >
      <input
        className="w-full p-2 border rounded"
        placeholder="Describe the site you want to build..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
      />
      <select
        value={stack}
        onChange={(e) => setStack(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="nextjs-tailwind">React + Next.js + Tailwind</option>
        <option value="html-css-js">HTML + CSS + JS</option>
      </select>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Generate Code
      </button>
    </form>
  );
}
