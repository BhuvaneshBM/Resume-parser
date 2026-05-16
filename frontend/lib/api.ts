const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ParsedResumeResult = {
  status: string;
  name?: string;
  email?: string;
  skills?: string[];
  experience?: object[];
  education?: object[];
};

export async function uploadResume(file: File): Promise<{ task_id: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/parse`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Upload failed."));
  }

  return response.json();
}

export async function getResults(taskId: string): Promise<ParsedResumeResult> {
  const response = await fetch(`${API_URL}/results/${taskId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Could not load results."));
  }

  return response.json();
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string; error?: string };
    return body.detail || body.error || fallback;
  } catch {
    return fallback;
  }
}
