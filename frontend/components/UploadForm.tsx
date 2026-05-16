"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadResume } from "@/lib/api";

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Select a PDF resume first.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadResume(file);
      router.push(`/results/${response.task_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Resume PDF</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <button
        type="submit"
        disabled={isUploading}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </form>
  );
}
