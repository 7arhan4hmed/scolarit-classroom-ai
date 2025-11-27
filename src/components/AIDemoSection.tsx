import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';

const sampleTexts = [
  {
    title: "History Essay",
    text: "The French Revolution was a period of radical social and political change in France from 1789 to 1799. It fundamentally altered the course of modern history, triggering the global decline of absolute monarchies and replacing them with republics and liberal democracies."
  },
  {
    title: "Math Problem",
    text: "To solve for x in the equation 2x + 5 = 15, I first subtracted 5 from both sides to get 2x = 10. Then I divided both sides by 2 to find x = 5. I can verify this is correct by substituting 5 back into the original equation."
  },
  {
    title: "Science Lab Report",
    text: "In our photosynthesis experiment, we observed that plants exposed to more light produced more oxygen bubbles. The control group with no light showed minimal activity. This supports our hypothesis that light is essential for photosynthesis."
  }
];

const AIDemoSection = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (input.trim().length < 20) return;
    
    setLoading(true);
    setTimeout(() => {
      setResult({
        grade: "B+",
        score: 87,
        feedback: "Good understanding of core concepts. Clear explanation with supporting evidence. Consider adding more specific examples and deeper analysis for a stronger response.",
        strengths: ["Clear structure", "Good evidence", "Accurate information"],
        improvements: ["Add more examples", "Elaborate on conclusions"]
      });
      setLoading(false);
    }, 1500);
  };

  const loadSample = (text: string) => {
    setInput(text);
    setResult(null);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-500/10 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Try It Yourself
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See AI Grading in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter a student response or try one of our samples to see how SCOLARIT provides instant, detailed feedback.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Interactive AI Demo</CardTitle>
              <CardDescription>
                Paste a student assignment or select a sample below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sample buttons */}
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample(sample.text)}
                    className="text-sm"
                  >
                    {sample.title}
                  </Button>
                ))}
              </div>

              {/* Input area */}
              <Textarea
                placeholder="Enter student work here... (minimum 20 characters)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px]"
              />

              {/* Analyze button */}
              <Button
                onClick={handleAnalyze}
                disabled={loading || input.trim().length < 20}
                className="w-full blue-purple-gradient hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze with AI
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Results */}
              {result && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/10 to-purple-500/10 p-6 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Grade</div>
                      <div className="text-4xl font-bold blue-purple-text">{result.grade}</div>
                      <div className="text-sm text-muted-foreground mt-1">{result.score}/100</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/10 to-purple-500/10 p-6 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Quick Stats</div>
                      <div className="space-y-1 text-sm">
                        <div>✓ {result.strengths.length} Strengths Identified</div>
                        <div>→ {result.improvements.length} Areas to Improve</div>
                        <div>⚡ Generated in 1.5s</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-border p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">AI Feedback</h4>
                    <p className="text-muted-foreground">{result.feedback}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {result.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-green-700">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-700 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1 text-sm">
                        {result.improvements.map((improvement: string, i: number) => (
                          <li key={i} className="text-amber-700">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIDemoSection;
