import React from "react";
import IconAndLabel from './IconAndLabel';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import courseImage from '../assets/Teaching-Data-Structures-and-Algorithms.jpg';
import { LayoutGrid, User} from 'lucide-react';
import type { CourseCard as CourseCardType } from "@/types/studentCourse";

interface CourseCardProps {
  course: CourseCardType,
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
//  const [showMore, setShowMore] = useState<boolean>(false);


  return (
    <div className="w-[300px] p-3 bg-sidebar rounded-lg shadow-xl border flex flex-col min-h-[420px] overflow-hidden">
      <img src={courseImage} alt={course.name} className="w-full object-cover rounded-md" />

      <div className="py-3 flex justify-between">
        <IconAndLabel item={{label:String(course.schoolName), icon:LayoutGrid}} />
        <IconAndLabel item={{ label: String(course.numberOfEnrollments || 0), icon: User }} />
      </div>
      
      <h1 className="opacity-90 py-2 text-xl font-semibold">
        {course.name}
      </h1>
      <p className="opacity-70 mt-2">
        {course.description?.slice(0, 200)}
        <span 
          className="text-blue-400 font-semibold"
          // onClick={()=>{
          //   setShowMore(!showMore)
          // }}
        >
          ...
        </span>
      </p>


      <div className="flex items-center gap-2 mt-4">
        <Avatar className="h-8 w-8 rounded-full">
          {/* <AvatarImage
            src={course.teacher?.imageURL || User2}
            alt={course.teacher?.name || "User"}
          /> */}
          <AvatarFallback>
            {course.teacherName
              ?.split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("") || "U"}
          </AvatarFallback>
        </Avatar>

        <p className="ml-2 opacity-90">{course.teacherName || "Unknown"}</p>
      </div>

    </div>
  );
};

export default CourseCard;
