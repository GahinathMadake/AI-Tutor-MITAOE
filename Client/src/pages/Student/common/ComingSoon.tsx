import React from "react";
import { Link } from "react-router-dom";
import CountdownTimer from "./CountDownTimer";
import { Button } from "@/components/ui/button";
import { Clock4, CalendarDays, CalendarCheck } from "lucide-react";
import { TestStatus } from "@/Interfaces/Database";
import { useUser } from "@/hooks/userContext";

interface TestData {
  testId?:string;
  heading: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  testStatuses?:TestStatus[];
}

const ComingSoon: React.FC<TestData> = ({ heading, duration, startTime, endTime, testStatuses, testId }) => {
  const {userId} = useUser();

  console.log(testStatuses);

  const testGiven = testStatuses?.some(status => status.studentId === userId);
  const upcoming = new Date() < new Date(startTime);
  const timer = {
      heading: upcoming ?
              "⏳ Test Will Start Soon"
              :
              "🔥 Test in Progress! It ends in:",
      subHeading: upcoming?
              "🚀 Get ready! The test will begin in:"
              :
              testGiven ?
              "Test result will be shown after test ends!"
              :
              "Time is running ⏳, give it try!",
  }
  return (
    <div className="mt-5 p-4 sm:p-5 w-full rounded-sm border shadow-sm flex flex-col-reverse lg:flex-row justify-between gap-6 sm:gap-8 md:gap-10">
      <div className="w-full lg:w-6/12 min-w-[300px]">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {testGiven?"Result will be annonced when test is over!":heading}
        </h2>

        <div className="pl-2 sm:pl-3 mt-4 sm:mt-5 grid gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <CalendarDays size={18} className="min-w-[20px]" />
            <span className="font-medium">Start Time:</span>
            <span>{new Date(startTime).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm sm:text-base">
            <CalendarCheck size={18} className="min-w-[20px]" />
            <span className="font-medium">End Time:</span>
            <span>{new Date(endTime).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Clock4 size={18} className="min-w-[20px]" />
            <span className="font-medium">Duration:</span>
            <span>{duration} minutes</span>
          </div>
        </div>

        {!upcoming && (
          !testGiven ? (
            <div className="mt-4 sm:mt-5 p-2 sm:p-3 w-full">
              <Link to={`/exam/test/${testId}`}>
                <Button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base">
                  Participate
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 sm:mt-5 p-2 sm:p-3 text-sm sm:text-base bg-sidebar rounded font-semibold">
              Analysis of Test will be shown here after test ends!!
            </div>
          )
        )}
      </div>

      <div className="w-full lg:w-auto flex justify-center lg:justify-end">
        <CountdownTimer 
          time={upcoming ? startTime : endTime} 
          timer={timer}
          className="w-full sm:max-w-none"
        />
      </div>
    </div>
  );
};

export default ComingSoon;
