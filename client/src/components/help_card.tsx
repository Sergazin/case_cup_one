import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpCard($: { title: string; text: string }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <i className="bx bx-help-circle text-4xl text-primary"></i>
          {$.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{$.text}</p>
      </CardContent>
    </Card>
  );
}
