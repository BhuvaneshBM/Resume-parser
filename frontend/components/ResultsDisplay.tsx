"use client";

import { useEffect, useState } from "react";
import { getResults, ParsedResumeResult } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

type ResultsDisplayProps = {
  taskId: string;
};

type ExperienceItem = {
  company?: string;
  role?: string;
  duration?: string;
};

type EducationItem = {
  institution?: string;
  degree?: string;
  year?: string;
};

export default function ResultsDisplay({ taskId }: ResultsDisplayProps) {
  const [result, setResult] = useState<ParsedResumeResult | null>(null);
  const [error, setError] = useState("");
  const status = result?.status;

  useEffect(() => {
    let isActive = true;

    async function poll() {
      try {
        const nextResult = await getResults(taskId);
        if (!isActive) {
          return;
        }

        setResult(nextResult);
      } catch (err) {
        if (!isActive) {
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load results.");
      }
    }

    if (status === "done" || status === "failed" || error) {
      return () => {
        isActive = false;
      };
    }

    poll();
    const intervalId = setInterval(poll, 3000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [taskId, status, error]);

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50 shadow-sm">
        <CardContent className="pt-6 text-sm font-medium text-red-700">{error}</CardContent>
      </Card>
    );
  }

  if (!result || result.status === "pending" || result.status === "processing") {
    return (
      <Card className="w-full shadow-sm">
        <CardContent className="flex items-center justify-center gap-3 py-10 text-sm text-slate-600">
          <Spinner />
          <span>Parsing your resume...</span>
        </CardContent>
      </Card>
    );
  }

  if (result.status === "failed") {
    return (
      <Card className="w-full border-red-200 bg-red-50 shadow-sm">
        <CardContent className="pt-6 text-sm font-medium text-red-700">
          Parsing failed. Please try again.
        </CardContent>
      </Card>
    );
  }

  const experience = (result.experience ?? []) as ExperienceItem[];
  const education = (result.education ?? []) as EducationItem[];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>{result.name || "Parsed resume"}</CardTitle>
        {result.email ? <p className="text-sm text-slate-600">{result.email}</p> : null}
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {(result.skills ?? []).map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((item, index) => (
              <div key={`${item.company}-${item.role}-${index}`} className="rounded-md border p-4">
                <p className="font-medium text-slate-950">{item.role || "Role not specified"}</p>
                <p className="text-sm text-slate-700">{item.company || "Company not specified"}</p>
                <p className="mt-1 text-sm text-slate-500">{item.duration || "Duration not specified"}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((item, index) => (
              <div key={`${item.institution}-${item.degree}-${index}`} className="rounded-md border p-4">
                <p className="font-medium text-slate-950">
                  {item.institution || "Institution not specified"}
                </p>
                <p className="text-sm text-slate-700">{item.degree || "Degree not specified"}</p>
                <p className="mt-1 text-sm text-slate-500">{item.year || "Year not specified"}</p>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
