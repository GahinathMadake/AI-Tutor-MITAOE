import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import CourseCard from "./common/CourseCard";
import { LoadingSpinnerWithoutHight } from "@/components/layout/LoadingSpinner";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { CourseCard as CourseCardType, TopicType, TestType, ChapterType, EnrollmentType, SingleCourseType } from "@/types/studentCourse";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Search, ChevronRight, Clock4, TvMinimal, FileX2, } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProgressCircular from "./common/ProgressCircular";
import { Input } from "@/components/ui/input";
import { useCourseContext } from "@/hooks/useStudentCourses";
import { useSingleCourseContext } from "@/hooks/useStudentSingleCourse";




interface TestCardProps {
  tests: TestType[],
  enrollment: EnrollmentType,
}

export const TestCard: React.FC<TestCardProps> = ({ tests, enrollment }) => {
  return (
    <div className="w-full overflow-x-auto pl-3 lg:pl-3 md:pl-2 sm:pl-1">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 w-4/12 text-left">Test</th>
            <th className="p-3 w-3/12 text-left hidden sm:table-cell">Scheduled At</th> {/* Hide on mobile */}
            <th className="p-3 w-3/12 text-center hidden md:table-cell">End Time</th> {/* Hide on mobile and tablet */}
            <th className="p-3 w-2/12 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test, index) => (
            <tr key={index} className="border-b">
              {/* Test Name (Always visible) */}
              <td className="px-2 py-2">
                <div className="flex items-center gap-4">
                  <ProgressCircular progress={enrollment.completedTestIds.includes(test.id) ? 100 : 0} size={55} />
                  <div>
                    <h1 className="font-semibold text-lg sm:text-xl">{test.name}</h1>
                    <p className="italic text-sm">Beginner</p>
                  </div>
                </div>
              </td>

              {/* Scheduled At (Hidden on mobile) */}
              <td className="font-semibold text-sm sm:text-base hidden sm:table-cell">
                {new Date(test.startTime).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>

              {/* End Time (Hidden on mobile and tablet) */}
              <td className="font-semibold text-sm sm:text-base hidden md:table-cell">
                {new Date(test.endTime).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>

              {/* Action (Always visible) */}
              <td>
                <Link
                  to={`/student/user/course/test/${test.id}`}
                >
                  <Button className="rounded-full bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-1 text-sm sm:text-base">
                    Checkout
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}





interface TopicProps {
  topic: TopicType;
  enrollment: EnrollmentType,
  topicKey: Number;
}

export const TopicCompo: React.FC<TopicProps> = ({ topicKey, topic, enrollment }) => {

  return <>
    <AccordionItem value={`item-${topicKey}`}>
      <AccordionTrigger className=''>{topic.name}</AccordionTrigger>
      <AccordionContent>

        <div className="w-full">
          {topic.tests && topic.tests.length > 0 ? (
            <TestCard tests={topic.tests} enrollment={enrollment} />
          ) : (
            <Card className="mt-4 border border-dashed rounded-md text-center shadow-sm text-muted-foreground">
              <CardContent className="flex flex-col items-center justify-center py-8 space-y-3">
                <FileX2 className="w-7 h-7 text-gray-400" />
                <p className="text-sm">No tests available for this topic.</p>
              </CardContent>
            </Card>
          )}
        </div>

      </AccordionContent>
    </AccordionItem>
  </>
};






interface ChapterProps {
  chapter: ChapterType,
  enrollment: EnrollmentType,
}

export const Chapter: React.FC<ChapterProps> = ({ chapter, enrollment }) => {
  return (
    <div className='my-2'>
      <Collapsible >
        <CollapsibleTrigger className="w-full block group/collapsible">
          <div className="w-full px-4 py-3  bg-sidebar-accent hover:bg-sidebar rounded-lg shadow-sm flex border text- items-center gap-3" >
            <BookOpen fill="black" className="w-[20px]" />
            <p>{chapter.name}</p>
            <ChevronRight className="w-[20px] ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className='px-4 lg:px-4 md:px-2 sm:px-1'>
            {chapter.topics && chapter.topics.length > 0 ? (
              <Accordion type="single" collapsible>
                {chapter.topics.map((topic, index) => (
                  <TopicCompo key={index} topicKey={index} enrollment={enrollment} topic={topic} />
                ))}
              </Accordion>
            ) : (
              <Card className="mt-4 rounded-md border border-dashed shadow-sm text-center text-muted-foreground">
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                  <FileX2 className="w-8 h-8 text-gray-400" />
                  <p className="text-sm">No topics available in this chapter.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}





export const SingleCourse = () => {
  const { courseId } = useParams();
  const { getSingleCourse } = useSingleCourseContext();

  const [course, setCourse] = useState<SingleCourseType>();
  const [enrollment, setEnrollment] = useState<EnrollmentType>();
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      setLoading(true);
      const data = await getSingleCourse(courseId);
      if (data) {
        setCourse(data.course);
        setEnrollment(data.enrollment);
      }
      setTimeout(() => setLoading(false), 500);
    };

    loadCourse();
  }, [courseId]);



  if (loading) {
    return <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Course`, isCurrentPage: true },
      ]}
    >
        <div className='w-full h-screen flex justify-center items-center'>
          <LoadingSpinnerWithoutHight />
        </div>
    </DashboardLayout>
  }

  if (!course) {
    return <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Course`, isCurrentPage: true },
      ]}
    >
      <div className='w-full h-screen flex justify-center items-center'>
        Course is unavailable...
      </div>
    </DashboardLayout>
  }

  if (!enrollment) {
    return <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Course`, isCurrentPage: true },
      ]}
    ><div className='w-full h-screen flex justify-center items-center'>
        Student is not enrolled into the Course....
      </div>
    </DashboardLayout>
  }


  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Course - ${course.name}`, isCurrentPage: true },
      ]}
    >
      <div className="p-6 sm:p-2 md:p-4 lg:p-6 xl:p-8">
        <div className="w-full">

          <Card className="bg-sidebar">
            <CardHeader>
              <div className="flex flex-wrap gap-6">
                <ProgressCircular progress={
                  course.TotalTests > 0
                    ? Math.round((enrollment.completedTestIds.length / course.TotalTests) * 100)
                    : 0
                } size={60}
                />

                <div>
                  <h1 className="text-xl placeholder-opacity-85 font-semibold">{course.name}</h1>
                  <p className="italic text-sm">by {course.teacherName}</p>

                  <p className="my-4 text-md font-semibold">"{course.description}"</p>

                  <div className="opacity-70 flex gap-8">
                    <div className="flex gap-2">
                      <Clock4 className="w-[20px]" />
                      <p><label className="font-semibold">Created at:</label>{' '} {new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <TvMinimal className="w-[20px]" />
                      <p><label className="font-semibold">Branch:</label> {course.schoolName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-sidebar mt-6">
            <CardContent>
              <div className="my-3">
                <h3 className="text-lg font-semibold mb-4">Chapters:</h3>
                {course.chapters && course.chapters.length > 0 ? (
                  course.chapters.map((chapter, index) => (
                    <Chapter key={index} chapter={chapter} enrollment={enrollment} />
                  ))
                ) : (
                  <Card className="mt-4 rounded-md border border-dashed shadow-sm text-center text-muted-foreground">
                    <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                      <FileX2 className="w-10 h-10 text-gray-400" />
                      <p className="text-sm">No chapters available for this course.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </DashboardLayout>
  );
}



const Courses = () => {
  const navigate = useNavigate();

  const { progress } = useParams();
  const { fetchCoursesByProgress } = useCourseContext();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseCardType[]>([]);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      const result = await fetchCoursesByProgress(progress || "All");
      setCourses(result);
      setTimeout(() => setLoading(false), 300);
    };

    getCourses();
  }, [progress]);


  /*------------------------- Search Query Optimisation -------------------------*/
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getFilteredUsers = () => {
    if (courses === undefined) return [];
    if (!searchQuery.trim()) return courses;


    const lowerQuery = searchQuery.toLowerCase();

    return courses.filter((course) =>
      course.name.toLowerCase().includes(lowerQuery)
    );
  };


  return (

    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `${progress} Courses`, isCurrentPage: true },
      ]}
    >
      <div className='p-6 sm:p-2 md:p-4 lg:p-6 xl:p-8'>

        <div className="px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {progress === "ongoing" ? "Ongoing" : progress === "completed" ? "Completed" : "All"} Courses
          </h1>

          {/* Input Button for Search Functionality*/}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              type="text"
              placeholder="Search Coures by Name"
              className="pl-10"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-2" />

        <div className='my-4 flex flex-wrap gap-6'>
          {
            loading
              ?
              <div className="flex justify-center items-center w-full min-h-[50vh]">
                <LoadingSpinnerWithoutHight />
              </div>
              :

              (
                courses && courses.length <= 0
                  ?
                  <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-center max-w-md mx-auto">
                    <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/30">
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        No Courses Available
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        It looks like you haven't enrolled in any course yet. Explore our site to enroll in course.
                      </p>
                    </div>

                    <Button
                      onClick={() => navigate('/Dasboard')}
                      className="gap-2"
                      variant="outline"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  :
                  (
                    getFilteredUsers().length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm mt-4">
                        No courses found for your search/filter.
                      </div>
                    ) : (
                      getFilteredUsers().map((course, index) => (
                        <Link key={index} to={`/student/course/${course.id}`}>
                          <CourseCard course={course} />
                        </Link>
                      ))
                    )
                  )
              )
          }
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Courses;