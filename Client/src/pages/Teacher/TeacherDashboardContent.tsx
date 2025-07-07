/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Clock9, 
  Timer, 
  Award, 
  BookOpen,
  Calendar,
  BarChart3,
  RefreshCw
} from "lucide-react";

// Static data for demonstration
const staticStats = {
  upcoming: 12,
  ongoing: 3,
  completed: 28
};

const staticTests = [
  { id: "1", name: "Mathematics Final Exam", subject: "Mathematics", date: "2025-07-15", students: 45 },
  { id: "2", name: "Physics Mid-term", subject: "Physics", date: "2025-07-20", students: 38 },
  { id: "3", name: "Chemistry Quiz", subject: "Chemistry", date: "2025-07-25", students: 42 },
  { id: "4", name: "Biology Lab Test", subject: "Biology", date: "2025-07-30", students: 35 },
  { id: "5", name: "English Literature", subject: "English", date: "2025-08-05", students: 40 }
];

type AnalyticsType = {
  testName: string;
  totalStudents: number;
  attempts: number;
  avgMarks: number;
  correctPercent: number;
  topPerformers: { name: string; score: number }[];
  questionAnalysis: { question: string; correct: number; total: number; percentage: number }[];
};

const staticAnalytics: { [key: string]: AnalyticsType } = {
  "1": {
    testName: "Mathematics Final Exam",
    totalStudents: 45,
    attempts: 42,
    avgMarks: 78.5,
    correctPercent: 73.2,
    topPerformers: [
      { name: "Sarah Johnson", score: 95 },
      { name: "Michael Chen", score: 92 },
      { name: "Emma Davis", score: 89 }
    ],
    questionAnalysis: [
      { question: "Algebra", correct: 38, total: 42, percentage: 90.5 },
      { question: "Geometry", correct: 32, total: 42, percentage: 76.2 },
      { question: "Trigonometry", correct: 28, total: 42, percentage: 66.7 },
      { question: "Calculus", correct: 25, total: 42, percentage: 59.5 }
    ]
  },
  "2": {
    testName: "Physics Mid-term",
    totalStudents: 38,
    attempts: 35,
    avgMarks: 71.8,
    correctPercent: 68.9,
    topPerformers: [
      { name: "Alex Wilson", score: 88 },
      { name: "Lisa Park", score: 85 },
      { name: "James Brown", score: 82 }
    ],
    questionAnalysis: [
      { question: "Mechanics", correct: 30, total: 35, percentage: 85.7 },
      { question: "Thermodynamics", correct: 25, total: 35, percentage: 71.4 },
      { question: "Optics", correct: 22, total: 35, percentage: 62.9 },
      { question: "Electromagnetism", correct: 18, total: 35, percentage: 51.4 }
    ]
  }
};

export default function TeacherDashboardContent() {
  const [stats] = useState(staticStats);
  const [tests] = useState(staticTests);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!selectedTestId) return;
    
    setAnalyticsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalytics(staticAnalytics[selectedTestId] || null);
      setAnalyticsLoading(false);
    }, 800);
  }, [selectedTestId]);

  type StatCardProps = {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    isLoading: boolean;
  };

  const StatCard = ({ title, value, icon: Icon, color, isLoading }: StatCardProps) => (
    <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-r ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  type AnalyticsCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    isLoading: boolean;
  };

  const AnalyticsCard = ({ title, value, subtitle, isLoading }: AnalyticsCardProps) => (
    <Card className="bg-gradient-to-br from-background to-muted/10 border border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-12" />
            {subtitle && <Skeleton className="h-3 w-16" />}
          </div>
        ) : (
          <>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">{title}</h4>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground">Monitor your tests and track student performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Upcoming Tests" 
          value={stats.upcoming} 
          icon={Clock9} 
          color="from-yellow-500 to-orange-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Ongoing Tests" 
          value={stats.ongoing} 
          icon={Timer} 
          color="from-blue-500 to-cyan-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Completed Tests" 
          value={stats.completed} 
          icon={CheckCircle2} 
          color="from-green-500 to-emerald-500"
          isLoading={isLoading}
        />
      </div>

      {/* Test Analytics Section */}
      <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Test Analytics
              </CardTitle>
              <p className="text-muted-foreground mt-1">Detailed performance insights</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Test</label>
            <Select onValueChange={setSelectedTestId}>
              <SelectTrigger className="w-full max-w-md bg-background border-border/50 hover:border-border transition-colors">
                <SelectValue placeholder="Choose a test to analyze" />
              </SelectTrigger>
              <SelectContent>
                {tests.map(test => (
                  <SelectItem key={test.id} value={test.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{test.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {test.subject}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Analytics Content */}
          {selectedTestId && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <AnalyticsCard 
                    title="Total Students" 
                    value={analytics?.totalStudents || 0}
                    isLoading={analyticsLoading}
                  />
                  <AnalyticsCard 
                    title="Students Attempted" 
                    value={analytics?.attempts || 0}
                    subtitle={analytics ? `${Math.round((analytics.attempts / analytics.totalStudents) * 100)}% participation` : ''}
                    isLoading={analyticsLoading}
                  />
                  <AnalyticsCard 
                    title="Average Score" 
                    value={analytics ? `${analytics.avgMarks}%` : '0%'}
                    isLoading={analyticsLoading}
                  />
                  <AnalyticsCard 
                    title="Success Rate" 
                    value={analytics ? `${analytics.correctPercent}%` : '0%'}
                    isLoading={analyticsLoading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {analyticsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : analytics?.topPerformers ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Top Performers
                    </h3>
                    <div className="space-y-3">
                      {analytics.topPerformers.map((student: { name: string; score: number }, index: number) => (
                        <Card key={index} className="p-4 bg-gradient-to-r from-background to-muted/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-muted-foreground">Score: {student.score}%</p>
                              </div>
                            </div>
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze'}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                {analyticsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : analytics?.questionAnalysis ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Question Analysis
                    </h3>
                    <div className="space-y-4">
                      {analytics.questionAnalysis.map(
                        (
                          question: { question: string; correct: number; total: number; percentage: number },
                          index: number
                        ) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{question.question}</h4>
                              <Badge variant={question.percentage >= 75 ? "default" : question.percentage >= 50 ? "secondary" : "destructive"}>
                                {question.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Correct: {question.correct}/{question.total}</span>
                                <span>{question.percentage.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={question.percentage} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          )}

          {!selectedTestId && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a test to view detailed analytics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}