import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Webcam from "react-webcam";
import { AlertTriangle, Ban, Loader2, Monitor, RotateCcwIcon, ScanEye, Lightbulb, GalleryVerticalEnd } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/utils/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from '@/components/ui/input';
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import WorqHat from "./assets/WorqHat.png";
import College_logo from "@/assets/logo_MITAOE.jpg";
import type { Question, TestType } from "@/types/studentTakeTest";







interface WebcamCaptureProps {
  className?: string;
  submitTestHandller: () => void;
  setCheatingReason: React.Dispatch<React.SetStateAction<string>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialogWarning: React.Dispatch<React.SetStateAction<string>>;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  className = "",
  submitTestHandller,
  setCheatingReason,
  setOpenDialog,
  setOpenDialogWarning
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { token } = useAuth();

  // Proctoring
  const violationCountRef = useRef<number>(0);

  // Capture and send image
  const captureAndSendImage = async () => {
    try {
      if (!webcamRef.current) return;

      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) return;

      const imageBlob = await fetch(screenshot).then(res => res.blob());

      const formData = new FormData();
      formData.append("image", imageBlob, `webcam-${Date.now()}.png`);

      const response = await fetch(`${API_BASE}/student/test/analyse-image`, {
        method: "POST",
        headers: {
          // Important: Do NOT set Content-Type explicitly for FormData; let the browser handle it.
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });


      const result = await response.json();

      if(result.data.success){
        const numberOfPeople = result?.data?.numberOfPeople;

        if (numberOfPeople !== 1) {
          violationCountRef.current += 1;

          setOpenDialogWarning(
            `We detected ${numberOfPeople} person(s) in the frame (expected exactly 1).\n` +
            `Please ensure you're alone in front of the camera. Continued suspicious activity may lead to automatic test submission.`
          );
          setOpenDialog(true);

          if (violationCountRef.current >= 5) {
            console.warn("🚨 Too many violations. Submitting test...");
            setCheatingReason(
              "Test auto-submitted due to repeated camera violations during the proctored session (e.g., multiple faces detected or face not clearly visible)."
            );

            setTimeout(() => {
              submitTestHandller();
            }, 2000);
          }
        }
      }

    } catch (error) {
      console.error("Error analyzing webcam image:", error);
    }
  };



  useEffect(() => {
    intervalRef.current = setInterval(() => {
      captureAndSendImage();
    }, 30000);   // every 10 Seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={`w-[300px] ${className}`}>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        className="w-full h-full"
        videoConstraints={{
          width: 300,
          height: 200,
          facingMode: "user",
        }}
      />
    </div>
  );
};







interface RemainingTimeProps {
  duration: number;
  submitTestHandller: () => void;
}

export const RemainingTime: React.FC<RemainingTimeProps> = ({ duration, submitTestHandller }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitTestHandller();
      return;
    }

    // Update the timer every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Convert seconds into hours, minutes, and seconds
  const formatTime = (seconds: number) => {

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")} 
      : ${minutes.toString().padStart(2, "0")}
      : ${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="py-2 px-4 shadow-sm text-center flex gap-2">
      <span className="text-lg font-bold text-blue-800">Remaining Time: </span>
      <span className="text-xl font-semibold text-blue-600">
        {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}
      </span>
    </div>
  );
};







interface QuestionComponentProps {
  question?: Question;
  currentQuestion: number;
  answersOfQuestions: { [key: string]: { answer: string; hints: number[]; } };
  setAnswersOfQuestions: React.Dispatch<React.SetStateAction<{ [key: string]: { answer: string; hints: number[]; } }>>;
  statusOfQuestion: { [key: string]: number };
  setStatusOfQuestion: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

export const Questioncompo: React.FC<QuestionComponentProps> = ({
  question,
  currentQuestion,
  answersOfQuestions,
  setAnswersOfQuestions,
  statusOfQuestion,
  setStatusOfQuestion
}) => {

  if (!question) {
    return;
  }

  const [useHints, setUseHints] = useState<boolean>(false);
  const [openHints, setOpenHints] = useState<boolean[]>([]);


  // Update state if hints exist when question or answers change
  useEffect(() => {
    const hasUsedHints = !!(question && answersOfQuestions[question.id]?.hints?.length > 0);
    setUseHints(hasUsedHints);

    const usedHintIndexes = answersOfQuestions[question.id]?.hints || [];
    setOpenHints(question.hints.map((_, i) => usedHintIndexes.includes(i)));
  }, [question, answersOfQuestions]);



  useEffect(() => {
    if (question) {
      setStatusOfQuestion((prevStatus) => ({
        ...prevStatus,
        [question.id]: answersOfQuestions[question.id] ? 1 : statusOfQuestion[question.id] == 2 ? 2 : 3,
      }));
    }
  }, [question, setStatusOfQuestion, answersOfQuestions]);


  const handleOptionSelect = (selectedOption: string) => {
    if (question) {

      console.log(selectedOption);
      const questionId = question.id;

      // Update selected answer
      setAnswersOfQuestions((prev) => ({
        ...prev,
        [questionId]: {
          answer: selectedOption,
          hints: prev[questionId]?.hints, // keep existing hints or default to []
        },
      }));

      // Update status based on answer presence
      setStatusOfQuestion((prev) => ({
        ...prev,
        [questionId]: selectedOption ? 1 : 3, // 1 = Answered, 3 = Unanswered
      }));
    }
  };


  const useHintHandller = (hintIndex: number) => {
    if (!question) return;

    const questionId = question.id;

    setAnswersOfQuestions(prev => {
      const currentAnswer = prev[questionId];
      const currentHints = currentAnswer.hints;

      // Avoid duplicate
      if (currentHints.includes(hintIndex)) return prev;

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          hints: [...currentHints, hintIndex],
        }
      };
    });
  };



  return (
    <div className='p-8'>
      {
        question &&
        <>
          <h2 className="text-lg font-semibold">{`Question ${currentQuestion}`}</h2>
          <Separator className='my-3' />

          <div className="my-2 text-lg">{question.text}</div>
          {
            question.type == "DIRECT_ANSWER" ?
              <div className="space-y-2 mt-2">
                <Label htmlFor="direct-answer" className="text-sm font-medium">
                  Type your answer below
                </Label>
                <Input
                  id="direct-answer"
                  className="w-6/12 min-w-[200px]"
                  placeholder="Enter your answer here..."
                  value={answersOfQuestions[question.id as string].answer}
                  onChange={(e) => handleOptionSelect(e.target.value)}
                />
              </div>
              :
              question.type == "MCQ" ?
                <RadioGroup
                  className="px-2 space-y-3"
                  value={answersOfQuestions[question.id as string].answer}
                  onValueChange={(selectedKey) => handleOptionSelect(selectedKey)}
                >
                  {Object.entries(question.options).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <RadioGroupItem value={value as string} id={key} />
                      <Label htmlFor={key}>
                        {value as string}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                :

                // CodeEditor Implementation
                <div>

                </div>

          }

          <div className="py-6">
            <div className='flex gap-3'>
              <h2 className="text-lg font-semibold">Hints</h2>
              <HoverCard>
                <HoverCardTrigger> <Lightbulb fill="yellow" onClick={() => { setUseHints(!useHints) }} /></HoverCardTrigger>
                <HoverCardContent className='px-2 p-1 w-auto'>
                  Use Hints
                </HoverCardContent>
              </HoverCard>
            </div>


            {
              useHints &&
              <div className="list-none mt-2 ml-2 space-y-2">

                {
                  question.hints.map((hint, index) => (
                    <Collapsible
                      key={index}
                      open={openHints[index]}
                    >
                      <div className="px-6 max-w-[500px] py-2 border shadow-sm rounded-sm flex justify-between">
                        <p>Hint {index + 1}</p>

                        {
                          !openHints[index] &&
                          <AlertDialog>
                            <AlertDialogTrigger className='text-lg font-semibold'>+</AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will decrease your Marks by -1.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <CollapsibleTrigger asChild>
                                  <span><AlertDialogAction onClick={() => useHintHandller(index)}>Continue</AlertDialogAction></span>
                                </CollapsibleTrigger>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        }

                      </div>
                      <CollapsibleContent className="px-2 py-1">
                        {hint}
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                }

              </div>
            }
          </div>
        </>
      }
    </div>
  )
}







const TestPage: React.FC = () => {
  const { testId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [Test, setTest] = useState<TestType>();
  const [Loading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [startingTest, setStartingTest] = useState<boolean>(false);
  const [testStarted, setTestStarted] = useState<boolean>(false);


  const [answersOfQuestions, setAnswersOfQuestions] = useState<{
    [key: string]: {
      answer: string;
      hints: number[];
    }
  }>({});

  const [statusOfQuestion, setStatusOfQuestion] = useState<{ [key: string]: number }>({});


  // Taking function from chgild
  const testPageRef = useRef<MainTestPageRef>(null);

  const forceSubmitTest = () => {
    testPageRef.current?.submitTestHandller();
  };



  {/* 
    Guide for Status of Questions
    1   ===>    Answered
    2   ===> Marked for review
    3   ===> Unanswered
    4   ===> unvisited
    */}

  const testStartedRef = useRef(false);
  useEffect(() => {
    testStartedRef.current = testStarted;
  }, [testStarted]);



  // Check for the initial requirments
  const hasRunRef = useRef(false);

  const checkCameraPermissions = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as any });
      if (permissionStatus.state === 'granted') return true;

      // Fallback for browsers that don't support permissions API
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  const checkFullscreen = () => {
    return !!document.fullscreenElement || window.innerHeight === screen.height;
  };

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkRequirements = async () => {
      const hasCameraAccess = await checkCameraPermissions();
      const isFullscreen = checkFullscreen();

      if (!hasCameraAccess || !isFullscreen) {
        alert("Test Requirements not Fullfilled!");
        navigate(`/exam/test/${testId}`);
      }
    };

    checkRequirements();
  }, [testId, navigate]);




  // ---------------------------------------------- Proctoring Of Test -------------------------------------------------
  const [fullScreen, setFullScreen] = useState<boolean>(true);
  const [cheatingReason, setCheatingReason] = useState<string>('');

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogWarning, setOpenDialogWarning] = useState<string>("");

  const requestFullscreenMode = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    }
    catch (err) {
      console.error('Fullscreen error:', err);

      // Try browser-specific methods
      try {
        const elem = document.documentElement as any;
        if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }
        else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        }
        else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
        else {
          throw new Error('Fullscreen API not available');
        }
      } catch (fallbackErr) {
        console.error('Fallback fullscreen failed:', fallbackErr);
      }
    }
  };


  const fullscreenCountRef = useRef(0);
  const handleFullscreenChange = () => {
    const stillFullscreen = checkFullscreen();

    console.log("FullScreen out Cout", fullscreenCountRef.current);

    if (!testStartedRef.current && !stillFullscreen) {
      setOpenDialogWarning("We noticed that you exist from fullScreen! Please Follow the instruction")
      setOpenDialog(true);
      return;
    }

    if (testStartedRef.current && !stillFullscreen) {
      fullscreenCountRef.current += 1;

      if (fullscreenCountRef.current === 1) {
        setOpenDialogWarning("We detected you exited fullscreen mode, Please do not do this again. One more exit will submit your test.");
        setOpenDialog(true);
        setFullScreen(false);
      }
      else if (fullscreenCountRef.current >= 2) {
        setOpenDialogWarning("You exited fullscreen again. Your test will be submitting your test!");
        setOpenDialog(true);
        setFullScreen(false);
        setCheatingReason("Test auto-submitted due to multiple exits from fullscreen mode during proctored session.")

        console.log("Submitted");
        setTimeout(() => {
          forceSubmitTest();
        }, 2000);
      }
    }
  };

  const tabChangeCountRef = useRef(0);
  const handleVisibilityChange = () => {
    console.log("Tab change Cout", tabChangeCountRef.current);

    if (!testStartedRef.current && document.hidden) {
      setOpenDialogWarning("We noticed that you changed the tab! Please follow the instructions.");
      setOpenDialog(true);
      return;
    }

    if (testStartedRef.current && document.hidden) {
      tabChangeCountRef.current += 1;

      if (tabChangeCountRef.current === 1) {
        setOpenDialogWarning("We noticed that you changed tab. Please do not do this again. If it happens once more, your test will be submitted automatically.");
        setOpenDialog(true);
      }
      else if (tabChangeCountRef.current >= 2) {
        setOpenDialogWarning("You switched tabs again after the warning. We are regretfully informing you that we will submiting your test");
        setOpenDialog(true);
      }
    }
    else {
      if (tabChangeCountRef.current >= 2) {
        setCheatingReason("Test auto-submitted after multiple tab switches during the proctored session.");
        console.log("Submitted");
        setTimeout(() => {
          forceSubmitTest();
        }, 2000);

      }
    }
  }

  useEffect(() => {
    //event listeners Full screen
    // document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleFullscreenChange);

    //event listener for tabChange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted]);


  const fetchTestData = async (testId: string, userId: string, token: string) => {
    if (!testId || !userId || !token) {
      alert("Information are not sufficient! Please try again later or contact support.");
      return;
    }

    setIsLoading(true);

    try {
      const storageKey = `test_${testId}_user_${userId}`;

      const cachedTest = localStorage.getItem(storageKey);
      if (cachedTest && cachedTest !== "undefined") {
        try {
          const parsed = JSON.parse(cachedTest);
          setTest(parsed);
          setTimeout(() => setIsLoading(false), 500);
          return;
        } catch (err) {
          console.warn("Invalid cached test data, removing from localStorage...");
          localStorage.removeItem(storageKey);
        }
      }

      // Fetch from server
      const response = await fetch(
        `${API_BASE}/student/test/get-test?testId=${testId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log("Test Fetch Result:", result);

      if (result.success) {
        setTest(result.data.test);
        localStorage.setItem(storageKey, JSON.stringify(result.data.test));
      } else {
        console.error("API error:", result.message || result.error);
        setMessage(result.message || "Failed to fetch test details");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };


  // Load the Data if initial requirements satisfied
  useEffect(() => {

    if (user === null || token === null) {
      return;
    }

    fetchTestData(testId as string, user.id, token as string);

  }, [testId, user, token]);

  // Start Test Handler
  const startTest = async (testId: string, userId: string, token: string) => {
    if (startingTest) return;
    setStartingTest(true);

    if (!testId || !userId || !token) {
      alert("Test ID, User ID, and token are required.");
      setStartingTest(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/student/test/start-test?testId=${testId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log("Start Test Response:", result);

      if (response.ok && result.success) {
        const initialAnswers: {
          [key: string]: { answer: string; hints: number[] };
        } = {};

        const initialStatus: { [key: string]: number } = {};

        if (Test?.testQuestions) {
          Test.testQuestions.forEach((testQuestion) => {
            const qId = testQuestion.question.id;
            initialAnswers[qId] = { answer: "", hints: [] };
            initialStatus[qId] = 4;
          });

          setAnswersOfQuestions(initialAnswers);
          setStatusOfQuestion(initialStatus);
          setTestStarted(true);
        } else {
          alert("Test questions not found.");
        }
      } else {
        alert(result.message || "Failed to start the test. Please try again later.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setStartingTest(false);
    }
  };


  if (Loading) {
    return <Card className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading test Details</span>
      </div>
    </Card>
  }

  if (startingTest) {
    return (
      <Card className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4 p-8 text-center max-w-sm">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Preparing Your Test Environment</h3>
            <p className="text-muted-foreground">
              Loading questions, setting up timer, and getting everything ready...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!Test) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center text-muted-foreground">
        <Ban className="w-10 h-10 mb-3 text-destructive" />
        <h2 className="text-lg font-semibold">Test is unavailable</h2>
        <p className="text-sm max-w-sm">
          {message}
        </p>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogTrigger className="hidden">Warning</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red text-lg">Warning</AlertDialogTitle>
            <AlertDialogDescription>
              {openDialogWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
            <AlertDialogAction onClick={() => {
              if (!fullScreen) {
                requestFullscreenMode();
                setFullScreen(false);
              }
            }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {
        testStarted ?
          <MainTestPage
            ref={testPageRef}
            Test={Test}
            answersOfQuestions={answersOfQuestions}
            setAnswersOfQuestions={setAnswersOfQuestions}
            statusOfQuestion={statusOfQuestion}
            setStatusOfQuestion={setStatusOfQuestion}
            cheatingReason={cheatingReason}
            setCheatingReason={setCheatingReason}
            setOpenDialog={setOpenDialog}
            setOpenDialogWarning={setOpenDialogWarning}
          />
          :
          <div className="max-w-xl mx-auto p-6 text-center space-y-6 bg-background border rounded-xl shadow-lg mt-10">
            <h1 className="text-2xl font-bold text-foreground">Are you ready for the test?</h1>

            <div className="space-y-4 text-left text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 mt-1" />
                <p><strong>Do not reload</strong> the page once the test has started. Doing so will result in a <strong className="text-destructive">zero score</strong>.</p>
              </div>

              <div className="flex items-start gap-3">
                <ScanEye className="text-blue-500 mt-1" />
                <p>Tab switching is <strong>not allowed</strong>. Your activity will be monitored.</p>
              </div>

              <div className="flex items-start gap-3">
                <Monitor className="text-green-500 mt-1" />
                <p>Test must be taken in <strong>full screen mode</strong> for the best experience.</p>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcwIcon className="text-red-500 mt-1" />
                <p><strong>You can't go back</strong>. Ensure you're prepared.</p>
              </div>
            </div>

            <Button onClick={() => startTest(testId as string, user?.id as string, token as string)} disabled={startingTest} className="w-full text-lg gap-2">
              {startingTest ? "Starting..." : "Start Test"}
            </Button>
          </div>
      }
    </>
  );
};


// MainTestPageRef.ts
interface MainTestPageRef {
  submitTestHandller: () => Promise<void>;
}

interface MainTestPageProps {
  Test: Test;
  answersOfQuestions: { [key: string]: { answer: string; hints: number[]; } };
  setAnswersOfQuestions: React.Dispatch<React.SetStateAction<{ [key: string]: { answer: string; hints: number[]; } }>>;
  statusOfQuestion: { [key: string]: number };
  setStatusOfQuestion: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  cheatingReason: string;
  setCheatingReason: React.Dispatch<React.SetStateAction<string>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialogWarning: React.Dispatch<React.SetStateAction<string>>;
}

const MainTestPage = forwardRef<MainTestPageRef, MainTestPageProps>(({
  Test,
  answersOfQuestions,
  setAnswersOfQuestions,
  statusOfQuestion,
  setStatusOfQuestion,
  cheatingReason,
  setOpenDialogWarning,
  setOpenDialog,
  setCheatingReason
}, ref) => {
  const { testId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedTest, setSubmittedTest] = useState<boolean>(false);


  // Submit Handller
  const submitTestHandller = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const testIdValue = testId as string;
    const userId = user?.id as string;
    const courseId = Test?.course?.id as string;

    if (!testIdValue || !userId || !token || !courseId) {
      alert("Missing required fields.");
      setIsSubmitted(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/student/test/submit-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answersOfQuestions,
            testId: testIdValue,
            courseId,
            cheatingReason,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedTest(true);

        const storageKey = `test_${testIdValue}_user_${userId}`;
        localStorage.removeItem(storageKey);

        alert("Your test was submitted successfully!");
        navigate(`/student/user/course/test/${testIdValue}`);
      } else {
        console.warn("Submission failed:", result.message || "Unknown error");
        alert(result.message || "Failed to submit test.");
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      alert("Unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitted(false);
    }
  };


  // Expose submit handller to parent
  useImperativeHandle(ref, () => ({
    submitTestHandller,
  }));


  // Include into Marked for review
  function handleMarkForReview(questionId: string) {
    setStatusOfQuestion((prevStatus) => ({
      ...prevStatus,
      [questionId]: 2,
    }));
  }

  // Remove from review
  function removeFromReview(questionId: string) {
    setStatusOfQuestion((prevStatus) => ({
      ...prevStatus,
      [questionId]: answersOfQuestions[questionId].answer === "" ? 3 : 1, // Unanswered (3) if empty,
    }));
  }

  // Clear the option
  function clearQuestionOption(questionId: string) {
    setAnswersOfQuestions((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        answer: "",             // Clear the answer
        hints: prevAnswers[questionId]?.hints,
      },
    }));

    setStatusOfQuestion((prevStatus) => ({
      ...prevStatus,
      [questionId]: 3, // Mark as Unanswered
    }));
  }



  if (isSubmitted) {
    return (
      <Card className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4 p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg font-medium">Submitting your response</span>
        </div>
      </Card>
    );
  }

  if (submittedTest) {
    return <div>Test was submitted now</div>
  }

  return (

    <div className="h-screen flex flex-col">

      {/* Sticky Header */}
      <div className="sticky top-0 w-full h-[40px] p-[5px] bg-sidebar border-b z-30 flex gap-3 justify-center">
        <Badge>{Test.name}</Badge>
        <h1 className="text-xl font-bold text-center">{Test.course.name} - {Test.topic.name}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-8 flex-grow" style={{ height: "calc(100vh - 40px)" }}>

        {/* Left Section (Scrollable) */}
        <div className="col-span-6 overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>

          <div className="sticky w-full h-[50px] px-6 bg-sidebar top-0 z-10 flex justify-between overflow-hidden">
            <div className="h-full flex items-center gap-2">
              <h2 className="text-lg font-semibold">Questions: </h2>
              <Button className="rounded-full">{currentQuestion}/{Test?.testQuestions?.length}</Button>
            </div>
            <div className="h-full flex items-center gap-2">
              <h2 className="text-lg font-semibold">Marking Scheme: </h2>
              <Button className="rounded-full">+5</Button>
              {/* <Button className="rounded-full">0</Button> */}
            </div>
          </div>

          <div style={{ height: "calc(100vh - 50px)" }}>
            <ScrollArea className="w-full h-full pb-[100px]">
              <Questioncompo
                question={Test?.testQuestions?.[currentQuestion - 1].question}
                currentQuestion={currentQuestion}
                answersOfQuestions={answersOfQuestions}
                setAnswersOfQuestions={setAnswersOfQuestions}
                statusOfQuestion={statusOfQuestion}
                setStatusOfQuestion={setStatusOfQuestion}
              />
            </ScrollArea>
          </div>


          <div className="sticky bottom-0 w-full py-2 px-6 bg-sidebar flex justify-between gap-2">

            <div className="flex gap-3">
              <Button
                className={`rounded-full bg-blue-500 hover:bg-blue-600`}
                onClick={
                  async () => {
                    clearQuestionOption(Test.testQuestions?.[currentQuestion - 1].question.id as string);
                  }
                }
              >
                Clear
              </Button>

              <Button
                className={`rounded-full bg-yellow-500 hover:bg-yellow-600`}
                onClick={
                  async () => {
                    handleMarkForReview(Test.testQuestions?.[currentQuestion - 1].question.id as string)
                  }
                }
              >
                Mark for Review
              </Button>

              <Button
                className={`rounded-full bg-green-500 hover:bg-green-600`}
                onClick={
                  async () => {
                    removeFromReview(Test.testQuestions?.[currentQuestion - 1].question.id as string)
                  }
                }
              >
                Remove from Review
              </Button>

              <Button
                className={`rounded-l-full ${currentQuestion === 1 ? "bg-[#666] hover:bg-[#666]" : ""}`}
                onClick={async () => {
                  if (currentQuestion != 1)
                    setCurrentQuestion(currentQuestion - 1);
                }
                }
              >
                Previous
              </Button>

              <Button
                className={`rounded-r-full ${currentQuestion === Test.testQuestions?.length ? "bg-[#666] hover:bg-[#666]" : ""}`}
                onClick={async () => {


                  if (currentQuestion !== Test.testQuestions?.length)
                    setCurrentQuestion(currentQuestion + 1);
                }}
              >
                Next
              </Button>
            </div>

            {
              Test.testQuestions?.length === currentQuestion &&
              <Button
                className={`rounded-full ${isSubmitted ? "bg-[#666] hover:bg-[#666]" : ""}`}
                onClick={submitTestHandller}
              >
                Submit
              </Button>
            }

          </div>
        </div>

        {/* Right Section (Static) */}
        <div className="col-span-2 bg-sidebar h-full overflow-hidden" style={{ height: "calc(100vh - 50px)" }}>
          <ScrollArea className="w-full h-full">
            {/* Timer */}
            <RemainingTime duration={Test.duration * 1000} submitTestHandller={submitTestHandller} />

            <Separator />

            {/* Question Navigation */}
            <div className="px-4 py-3">
              <h2 className="text-lg font-semibold">Questions:</h2>
              <div className="my-2 flex gap-2 flex-wrap">
                {
                  Test.testQuestions?.map((testQuestion, index) => (
                    <Badge
                      key={index}
                      className={`w-[45px] h-[45px] text-lg flex justify-center items-center cursor-pointer transition-colors ${currentQuestion === index + 1
                        ?
                        "bg-blue-500 hover:bg-blue-600"
                        :
                        statusOfQuestion[testQuestion.question.id] === 2
                          ?
                          "bg-yellow-500 hover:bg-yellow-600"
                          :
                          statusOfQuestion[testQuestion.question.id] === 1
                            ?
                            "bg-green-500 hover:bg-green-600"
                            :
                            statusOfQuestion[testQuestion.question.id] === 3
                              ?
                              "bg-red-500 hover:bg-red-600"
                              :
                              ""

                        }`}
                      onClick={() => setCurrentQuestion(index + 1)}
                    >
                      {index + 1}
                    </Badge>
                  ))
                }
              </div>
            </div>

            {/* Coloring Schema */}
            <div className="px-4 pb-3">
              <h2 className="text-lg font-semibold">Coloring Schema of Question Boxes </h2>
              <div className="flex flex-wrap space-y-2 mt-2">

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600"></Badge>
                  <span>Current</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600"></Badge>
                  <span>Answered</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600"></Badge>
                  <span>Not Answered</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-[#333]"></Badge>
                  <span>Not Visited</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-yellow-500 hover:bg-yellow-600"></Badge>
                  <span>Marked for Review</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="px-4 py-3">
              {/* Heading */}
              <h2 className="text-xl font-semibold mb-4">
                WebCam
              </h2>

              <WebcamCapture
                setCheatingReason={setCheatingReason}
                setOpenDialog={setOpenDialog}
                setOpenDialogWarning={setOpenDialogWarning}
                submitTestHandller={submitTestHandller}
              />
            </div>
          </ScrollArea>
        </div>

      </div>

    </div>
  );
});



export const TestPageHelper: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [fullscreenError, setFullscreenError] = useState<string>('');
  const [conditions, setConditions] = useState({
    cameraAccess: false,
    fullScreen: false,
    instructionsRead: false,
  });

  useEffect(() => {
    const checkMediaPermissions = async () => {
      try {
        // Check camera access
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setConditions(prev => ({ ...prev, cameraAccess: true }));
        cameraStream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Permission check failed:', error);
      }
    };

    const checkFullscreen = () => {
      const isFullscreen = !!document.fullscreenElement ||
        window.innerHeight === screen.height;
      setConditions(prev => ({ ...prev, fullScreen: isFullscreen }));
    };

    // Initial checks
    checkMediaPermissions();
    checkFullscreen();

    //full Screen Change
    // document.addEventListener('fullscreenchange', checkFullscreen);
    //listener for F11
    window.addEventListener('resize', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      window.removeEventListener('resize', checkFullscreen);
    };
  }, []);

  const allConditionsMet = Object.values(conditions).every(Boolean);

  // Full Screen mode request
  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);

      // Try browser-specific methods
      try {
        const elem = document.documentElement as any;
        if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        } else {
          throw new Error('Fullscreen API not available');
        }
      } catch (fallbackErr) {
        console.error('Fallback fullscreen failed:', fallbackErr);
        setFullscreenError(`
          Please add full screen mode manually, using f11 key!
        `);
      }
    }
  };

  const handleInstructionsCheck = () => {
    setConditions(prev => ({ ...prev, instructionsRead: !prev.instructionsRead }));
  };


  return (
    <div className={`grid min-h-svh lg:grid-cols-2`}>
      {/* Left Side - Background Image & Logo */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src={WorqHat}
          alt="MITAOE Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:grayscale"
        />
        <img src={College_logo} className="absolute left-10 top-10 h-12 w-auto" alt="College Logo" />
      </div>

      {/* Right Side - Login Form */}
      <ScrollArea className="w-full h-screen">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              AI Tutor.
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Test Setup Instructions</h2>

              {/* Common Instructions */}
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h3 className="font-medium text-yellow-800 mb-2">Important Instructions:</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-700">
                  <li>Switching browser tabs will automatically submit your test</li>
                  <li>Leaving fullscreen mode will immediately end your test session</li>
                  <li>You must take the test alone - camera monitoring is active</li>
                  <li>A stable internet connection is required throughout the test</li>
                </ul>

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="instructions-check"
                    checked={conditions.instructionsRead}
                    onChange={handleInstructionsCheck}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="instructions-check" className="ml-2 text-sm text-gray-700">
                    I have read and understood all instructions
                  </label>
                </div>
              </div>

              <div className="space-y-4 mb-6">

                {/* Camera Access */}
                <div className="p-2 bg-white rounded-md shadow-xs">
                  <div className="flex items-center py-3">
                    <input
                      type="checkbox"
                      checked={conditions.cameraAccess}
                      readOnly
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">
                      {conditions.cameraAccess ? 'Camera access granted' : 'Camera access not detected'}
                    </span>
                  </div>
                  {
                    !conditions.cameraAccess ? (
                      <div className="text-red-600 text-xs">
                        Please allow camera access in browser settings and refresh.
                      </div>
                    ) : (
                      <div className="mx-auto">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="w-16"
                        />
                      </div>
                    )
                  }
                </div>

                {/* Full Screen Mode */}
                <div className="p-2 bg-white rounded-md shadow-xs">
                  <div className="flex items-center py-2">
                    <input
                      type="checkbox"
                      checked={conditions.fullScreen}
                      readOnly
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">
                      {conditions.fullScreen ? 'Fullscreen mode active' : 'Not in fullscreen mode'}
                    </span>
                  </div>
                  {
                    !conditions.fullScreen && (
                      <Button
                        onClick={requestFullscreen}
                        className=" bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        Enable
                      </Button>
                    )}
                  {
                    fullscreenError &&
                    <div className="text-red-600 text-xs">
                      {fullscreenError}
                    </div>
                  }

                </div>
              </div>

              <Button
                onClick={() => {
                  if (allConditionsMet) {
                    navigate(`/exam/test/${testId}/attempt`);
                  }
                }}
                disabled={!allConditionsMet}
                className={`w-full py-2 px-4 rounded-md font-medium ${allConditionsMet
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
              >
                Continue Test
              </Button>

              {!allConditionsMet && (
                <p className="mt-3 text-sm text-red-500">
                  Please ensure all requirements are met before continuing
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TestPage;