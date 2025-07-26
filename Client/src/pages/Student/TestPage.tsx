import React, { useState, useEffect, useRef } from "react";
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
import { AlertTriangle, Ban, Loader2, Monitor, RotateCcwIcon, ScanEye, Lightbulb, GalleryVerticalEnd, CheckCircleIcon, Play, ChevronRight } from "lucide-react";
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
import Editor from "@monaco-editor/react";
import WorqHat from "./assets/WorqHat.png";
import College_logo from "@/assets/logo_MITAOE.jpg";
import { EditorTheme, LanguageEnum, type Question } from "@/types/studentTestPage";
import { useStudentTestPage } from "@/hooks/useStudentTestPage";







interface WebcamCaptureProps {
  className?: string;
  submitTestHandller: () => void;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialogWarning: React.Dispatch<React.SetStateAction<string>>;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  className = "",
  submitTestHandller,
  setOpenDialog,
  setOpenDialogWarning
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { token } = useAuth();
  const { setCheatingReason } = useStudentTestPage();

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
      console.log("In try = ", result);

      if (result.data.success) {
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
      console.log("In Catch Block = ");
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




type CodingQuestionProps = {
  question: Question;
}

interface TestCaseDisplay {
  input: string;
  expected_output: string
  default: boolean;
}


export const CodingQuestion: React.FC<CodingQuestionProps> = ({ question }) => {
  const { answersOfQuestions, setAnswersOfQuestions } = useStudentTestPage();

  const [language, setLanguage] = useState<LanguageEnum>(LanguageEnum.C);
  const [theme, setTheme] = useState<EditorTheme>(EditorTheme.LIGHT);
  const [loading, setLoading] = useState<boolean>(false);


  const handleRunCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: "javascript" }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err) {
      setOutput("Error running code");
    } finally {
      setLoading(false);
    }
  };


  //  OutPUT Tabs Setting
  const [output, setOutput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'testcases' | 'result'>('testcases');
  const [testCases, setTestCases] = useState<TestCaseDisplay[]>([]);
  const [activeCase, setActiveCase] = useState(0);
  
  useEffect(()=>{
    setActiveCase(0);
    setActiveTab('testcases');
    setLoading(false);
  }, [question]);

  useEffect(() => {
    if (question?.testCases?.length) {
      const visibleTestCases = question.testCases.filter(tc => !tc.hidden);

      const initialized = visibleTestCases.map((tc) => ({
        input: tc.input,
        expected_output: tc.expected_output,
        default: false, 
      }));

      setTestCases(initialized);
    }
  }, [question]);

  const addTestCaseHandler = () => {
    setTestCases((prev) => {
      const baseCase = prev && prev.length > 0 ? prev[0] : { input: "", expected_output: "", default: false };
      const newCase: TestCaseDisplay = {
        input: baseCase.input,
        expected_output: baseCase.expected_output,
        default: true,
      };

      return [...(prev || []), newCase];
    });
  };


  return (
    <div className="mt-6">

      <h2 className="text-xl font-semibold mb-2">Write Your Code</h2>
      <div className="rounded-md border bg-gray-100">

        <div className="flex justify-between p-2 mb-1">
          <div className="">
            <Button
              className="bg-blue-600 text-white rounded"
              onClick={handleRunCode}
              disabled={loading}
            >
              <Play /> {loading ? "Running..." : "Run"}
            </Button>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <select
              className="border px-2 py-1 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageEnum)}
            >
              {Object.values(LanguageEnum).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              className="border px-2 py-1 rounded"
              value={theme}
              onChange={(e) => setTheme(e.target.value as EditorTheme)}
            >
              {Object.values(EditorTheme).map((t) => (
                <option key={t} value={t}>
                  {t === "vs" ? "Light" : t === "vs-dark" ? "Dark" : "High Contrast"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Editor
          height="400px"
          defaultLanguage={language}
          defaultValue={answersOfQuestions[question.id].answer}
          value={answersOfQuestions[question.id].answer}
          theme={theme}
          onChange={
            (val: string | undefined) => {
              const updatedAnswer = val || "";

              setAnswersOfQuestions((prev) => ({
                ...prev,
                [question.id]: {
                  ...prev[question.id],
                  answer: updatedAnswer,
                },
              }));
            }
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          className="border-t border-b"
        />

        <div className="mt-1 p-2 max-h-[300px] overflow-auto">
          <div className="flex items-center  border-b pb-2">
            <div
              onClick={() => setActiveTab('testcases')}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'testcases' ? 'bg-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              TestCases
            </div>

            <hr className="mx-1 w-px h-5 bg-gray-300 border-0" />

            <div
              onClick={() => setActiveTab('result')}
              className={`cursor-pointer px-4 py-2 rounded-md flex items-center space-x-1 text-sm font-medium ${activeTab === 'result' ? 'bg-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <ChevronRight size={16} />
              <span>Result</span>
            </div>
          </div>

          {
            activeTab === 'testcases' ? (
              <div className="space-y-2 mt-2">

                <div className="flex space-x-2 mb-4">
                  {
                    testCases.map((testCase, index) => (
                      <div key={index} className="relative group">
                        <button
                          key={index}
                          onClick={() => setActiveCase(index)}
                          className={`px-4 py-1 rounded-md font-medium pr-6 ${activeCase === index ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        >
                          Case {index + 1}
                        </button>


                        {testCase.default && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (activeCase+1==testCases.length) setActiveCase((prev) => prev - 1);
                              setTestCases((prev) => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-[-6px] right-[-6px] bg-gray-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            ×
                          </button>
                        )}

                      </div>
                    ))
                  }

                  {
                    (!testCases || testCases.length <= 8) &&
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={addTestCaseHandler}
                    >
                      +
                    </button>
                  }
                </div>

                <div className="text-sm space-y-4">
                  <div className="space-y-2 p-4 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Input:</p>
                      <Input
                        type="text"
                        value={
                          activeCase >= 0 && activeCase < testCases.length
                            ? testCases[activeCase].input
                            : ''
                        }
                        onChange={(e) => {
                          const updated = [...testCases];
                          if (activeCase >= 0 && activeCase < updated.length) {
                            updated[activeCase] = {
                              ...updated[activeCase],
                              input: e.target.value,
                            };
                            setTestCases(updated);
                          }
                        }}
                        className="bg-gray-300 px-2 py-1 rounded w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium">Expected Output:</p>
                      <Input
                        type="text"
                        value={
                          activeCase >= 0 && activeCase < testCases.length
                            ? testCases[activeCase].expected_output
                            : ''
                        }
                        onChange={(e) => {
                          const updated = [...testCases];
                          if (activeCase >= 0 && activeCase < updated.length) {
                            updated[activeCase] = {
                              ...updated[activeCase],
                              expected_output: e.target.value,
                            };
                            setTestCases(updated);
                          }
                        }}
                        className="bg-gray-300 px-2 py-1 rounded w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-3 border rounded-md text-sm whitespace-pre-wrap">
                {output.trim() === "" ? (
                  <p className="text-gray-500">⚠️ You must run your code first to see the output.</p>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-800">{output}</pre>
                )}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}




interface QuestionComponentProps {
  question?: Question;
  currentQuestion: number;
}

export const Questioncompo: React.FC<QuestionComponentProps> = ({
  question,
  currentQuestion,
}) => {

  if (!question) {
    return;
  }

  const { answersOfQuestions, setAnswersOfQuestions, statusOfQuestion, setStatusOfQuestion } = useStudentTestPage()
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
                <div className="mt-6">
                  {/* Test cases */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Sample Test Cases:</h2>

                    {
                      !question.testCases || question.testCases.length === 0
                        ?
                        (<p className="py-2 text-sm text-gray-500">No test cases available.</p>)
                        :
                        (<div className="space-y-6">
                          {question.testCases.map((testCase, index) => (
                            <div
                              key={index}
                              className="text-sm"
                            >
                              <h3 className="font-lg mb-1 font-semibold">
                                Test Case {index + 1}
                              </h3>

                              <div className="space-y-2 p-2 bg-gray-100">
                                <div className="space-y-1">
                                  <p className="font-medium">Input:</p>
                                  <p className="bg-gray-200 px-2 py-1">{testCase.input}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium">Expected Output:</p>
                                  <p className="bg-gray-200 px-2 py-1">
                                    {testCase.expected_output}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        )
                    }
                  </div>

                  <CodingQuestion question={question} />
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


            <>{
              useHints &&
              <div className="list-none mt-2 ml-2 space-y-2">
                {question.hints && question.hints.length > 0 ?
                  (question.hints.map((hint, index) => (
                    <Collapsible
                      key={index}
                      open={openHints[index]}
                    >
                      <div className="px-6 max-w-[500px] py-2 border shadow-sm rounded-sm flex justify-between">
                        <p>Hint {index + 1}</p>

                        {
                          !openHints[index] &&
                          <AlertDialog>
                            <AlertDialogTrigger className='text-lg font-semibold'><span className="hover:bg-gray-200 dark:bg-gray-600 p-2 rounded-full">+</span></AlertDialogTrigger>
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
                  )
                  :
                  <p className="text-muted-foreground italic px-4 py-2">No hints available for this question.</p>
                }
              </div>
            }</>
          </div>
        </>
      }
    </div>
  )
}







const TestPage: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const { Test, fetchTestData, startTestHandller, submitTestHandller, setCheatingReason } = useStudentTestPage();

  const [Loading, setIsLoading] = useState<boolean>(true);  // Loding Test Details
  const [message, setMessage] = useState<string>("");
  const [startingTest, setStartingTest] = useState<boolean>(false);
  const [testStarted, setTestStarted] = useState<boolean>(false);


  const loadTestData = async (testId: string) => {
    setIsLoading(true);
    const { success, message } = await fetchTestData(testId);

    if (!success) {
      setMessage(message);
    }
    setIsLoading(false);
  };

  // Load the Data if initial requirements satisfied
  useEffect(() => {
    if (!testId) {
      return;
    }

    loadTestData(testId);
  }, [testId]);

  // Start Test Handler
  const startTest = async (testId: string) => {
    setStartingTest(true);
    const { success, message } = await startTestHandller(testId);

    if (success) {
      setTestStarted(true);
    }
    else {
      alert(message);
    }
    setStartingTest(false);
  };

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedTest, setSubmittedTest] = useState<boolean>(false);

  // Submit Handller
  const submitTest = async () => {
    if (submittedTest) return;
    if (isSubmitted) return;
    setIsSubmitted(true);

    const { success, message } = await submitTestHandller(testId as string);

    if (success) {
      setSubmittedTest(true);
    }
    else {
      alert(message);
    }
    setIsSubmitted(false);
  };




  // ---------------------------------------------- Proctoring Of Test -------------------------------------------------
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogWarning, setOpenDialogWarning] = useState<string>("");


  const testStartedRef = useRef(false);
  useEffect(() => {
    testStartedRef.current = testStarted;
  }, [testStarted]);

  const submittedTestRef = useRef(false);
  useEffect(() => {
    submittedTestRef.current = submittedTest;
  }, [submittedTest]);


  const checkCameraPermissions = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as any });
      if (permissionStatus.state === 'granted') return true;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  };

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

  const checkFullscreen = () => {
    return !!document.fullscreenElement || window.innerHeight === screen.height;
  };

  // Check for the initial requirments
  const hasRunRef = useRef(false); // Want to run useEffect for Once
  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkRequirements = async () => {
      const hasCameraAccess = await checkCameraPermissions();
      const isFullscreen = await checkFullscreen();

      if (!hasCameraAccess || !isFullscreen) {
        alert("Test Requirements not Fullfilled!");
        navigate(`/exam/test/${testId}`);
      }
    };

    checkRequirements();
  }, [testId, navigate]);


  const fullscreenCountRef = useRef(0);
  const handleFullscreenChange = () => {
    if (submittedTestRef.current) return;

    const stillFullscreen = checkFullscreen();

    if (!testStartedRef.current && !stillFullscreen) {
      setOpenDialogWarning("We noticed that you exist from fullScreen! Please Follow the instruction")
      setTimeout(() => {
        setOpenDialog(true);
      }, 200);
      return;
    }

    if (testStartedRef.current && !stillFullscreen) {
      fullscreenCountRef.current += 1;

      if (fullscreenCountRef.current === 1) {
        setOpenDialogWarning("We detected you exited fullscreen mode, Please do not do this again. One more exit will submit your test.");
        setTimeout(() => {
          setOpenDialog(true);
        }, 200);
      }
      else if (fullscreenCountRef.current >= 2) {
        setOpenDialogWarning("You exited fullscreen again. Your test will be submitting your test!");
        setTimeout(() => {
          setOpenDialog(true);
        }, 200);

        setCheatingReason("Test auto-submitted due to multiple exits from fullscreen mode during proctored session.")
        setTimeout(() => {
          submitTest();
        }, 2000);
      }
    }
  };

  const tabChangeCountRef = useRef(0);
  const handleVisibilityChange = () => {
    if (submittedTestRef.current) return;

    if (!testStartedRef.current && document.hidden) {
      setOpenDialogWarning("We noticed that you changed the tab! Please follow the instructions.");
      setTimeout(() => {
        setOpenDialog(true);
      }, 200);
      return;
    }

    if (testStartedRef.current && document.hidden) {
      tabChangeCountRef.current += 1;

      if (tabChangeCountRef.current === 1) {
        setOpenDialogWarning("We noticed that you changed tab. Please do not do this again. If it happens once more, your test will be submitted automatically.");
        setTimeout(() => {
          setOpenDialog(true);
        }, 200);
      }
      else if (tabChangeCountRef.current >= 2) {
        setOpenDialogWarning("You switched tabs again after the warning. We are regretfully informing you that we will submiting your test");
        setTimeout(() => {
          setOpenDialog(true);
        }, 200);
      }
    }
    else {
      if (tabChangeCountRef.current >= 2) {
        setCheatingReason("Test auto-submitted after multiple tab switches during the proctored session.");
        setTimeout(() => {
          submitTest();
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

  if (!Test || Object.keys(Test).length === 0) {
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
              if (!checkFullscreen() && !submittedTest) {
                requestFullscreenMode();
              }
            }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {
        testStarted ?
          <MainTestPage
            setOpenDialog={setOpenDialog}
            setOpenDialogWarning={setOpenDialogWarning}
            isSubmitted={isSubmitted}
            submittedTest={submittedTest}
            submitTest={submitTest}
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

            <Button
              onClick={() => {
                if (!document.fullscreenElement) {
                  setOpenDialogWarning("Please switch to fullscreen mode to start the test.");
                  setTimeout(() => {
                    setOpenDialog(true);
                  }, 200);
                } else {
                  startTest(testId as string);
                }
              }
              }
              disabled={startingTest}
              className="w-full text-lg gap-2">
              {startingTest ? "Starting..." : "Start Test"}
            </Button>
          </div>
      }
    </>
  );
};


interface MainTestPageProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialogWarning: React.Dispatch<React.SetStateAction<string>>;
  isSubmitted: boolean;
  submittedTest: boolean;
  submitTest: () => void;
}

const MainTestPage: React.FC<MainTestPageProps> = ({
  setOpenDialogWarning,
  setOpenDialog,
  isSubmitted,
  submittedTest,
  submitTest
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const navigate = useNavigate();
  const { testId } = useParams();
  const { Test, statusOfQuestion, setStatusOfQuestion, answersOfQuestions, setAnswersOfQuestions } = useStudentTestPage();

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
      [questionId]: 3,
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Test Submitted Successfully</h2>
        <p className="text-gray-600 mb-6">Your test has been submitted. You can now view your results or return to the test overview page.</p>
        <Button
          onClick={() => navigate(`/student/user/course/test/${testId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow"
        >
          Go to Test Overview
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">

      {/* Sticky Header */}
      <div className="sticky top-0 w-full h-[40px] p-[5px] bg-sidebar border-b z-30 flex gap-3 justify-center">
        <Badge>{Test.name}</Badge>
        <h1 className="text-xl font-bold text-center">{Test.courseName} - {Test.topicName}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-8 flex-grow" style={{ height: "calc(100vh - 40px)" }}>

        {/* Left Section (Scrollable) */}
        <div className="col-span-6 overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>

          <div className="sticky w-full h-[50px] px-6 bg-sidebar top-0 z-10 flex justify-between overflow-hidden">
            <div className="h-full flex items-center gap-2">
              <h2 className="text-lg font-semibold">Questions: </h2>
              <Button className="rounded-full">{currentQuestion}/{Test.testQuestions.length}</Button>
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
                question={Test.testQuestions?.[currentQuestion - 1]}
                currentQuestion={currentQuestion}
              />
            </ScrollArea>
          </div>


          <div className="sticky bottom-0 w-full py-2 px-6 bg-sidebar flex justify-between gap-2">

            <div className="flex gap-3">
              <Button
                className={`rounded-full bg-blue-500 hover:bg-blue-600`}
                onClick={
                  async () => {
                    clearQuestionOption(Test.testQuestions?.[currentQuestion - 1].id as string);
                  }
                }
              >
                Clear
              </Button>

              <Button
                className={`rounded-full bg-yellow-500 hover:bg-yellow-600`}
                onClick={
                  async () => {
                    handleMarkForReview(Test.testQuestions?.[currentQuestion - 1].id as string)
                  }
                }
              >
                Mark for Review
              </Button>

              <Button
                className={`rounded-full bg-green-500 hover:bg-green-600`}
                onClick={
                  async () => {
                    removeFromReview(Test.testQuestions?.[currentQuestion - 1].id as string)
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
                onClick={submitTest}
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
            <RemainingTime duration={Test.duration * 1000} submitTestHandller={submitTest} />

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
                        statusOfQuestion[testQuestion.id] === 2
                          ?
                          "bg-yellow-500 hover:bg-yellow-600"
                          :
                          statusOfQuestion[testQuestion.id] === 1
                            ?
                            "bg-green-500 hover:bg-green-600"
                            :
                            statusOfQuestion[testQuestion.id] === 3
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
                setOpenDialog={setOpenDialog}
                setOpenDialogWarning={setOpenDialogWarning}
                submitTestHandller={submitTest}
              />
            </div>
          </ScrollArea>
        </div>

      </div>

    </div>
  );
};



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