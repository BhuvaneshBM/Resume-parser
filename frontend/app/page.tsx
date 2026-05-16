import UploadForm from "@/components/UploadForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Upload a resume</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadForm />
      </CardContent>
    </Card>
  );
}
