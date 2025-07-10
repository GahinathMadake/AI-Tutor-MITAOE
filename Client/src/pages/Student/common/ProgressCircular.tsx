import React from "react";
import { Play, Check } from "lucide-react";

interface ProgressCircularProps {
  progress?: number;
  size?: number;
}


const ProgressCircular: React.FC<ProgressCircularProps> = ({
  progress = 0,
  size = 60,
}) => {
    const radius = (size / 2) - 2; // Adjust radius dynamically based on size
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ width: size, height: size }} className="relative flex justify-center items-center">
      {/* Background ring */}
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="#fff"
          strokeWidth="4"
          fill="transparent"
        />

        {/* Progress ring */}
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="blue"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      {/* Inner content */}
      <div className="absolute inset-1 rounded-full flex items-center justify-center">
        {progress === 0 ? (
          <Play fill="black" />
        ) : progress === 100 ? (
          <Check className="font-semibold text-green-700" />
        ) : (
          <span className="font-semibold">{progress}%</span>
        )}
      </div>
    </div>
  );
};

export default ProgressCircular;




// import React from 'react';
// import { 
//     Play,
//     Check
// } from 'lucide-react';


// const ProgressCircular = () => {

//     const course = {
//         progress:100,
//     };

//     const radius = 28; // Radius of the circle
//     const circumference = 2 * Math.PI * radius;
//     const offset = circumference - (course.progress / 100) * circumference;

    
//   return (
//     <div className="relative w-[60px] h-[60px]">
//         {/* Background ring */}
//         <svg className="absolute top-0 left-0" width="60" height="60">
//             <circle
//                 cx="30"
//                 cy="30"
//                 r={radius}
//                 stroke="#fff"
//                 strokeWidth="4"
//                 fill="transparent"
//             />
            
//             {/* Progress ring */}
//             <circle
//                 cx="30"
//                 cy="30"
//                 r={radius}
//                 stroke="blue"
//                 strokeWidth="4"
//                 fill="transparent"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={offset}
//                 strokeLinecap="round"
//                 className="transition-all duration-500"
//             />
//         </svg>

//         {/* Inner content */}
//         <div className="absolute inset-1 bg-sidebar rounded-full flex items-center justify-center">
//             {
//                 course.progress === 0 ?
//                 <Play fill="black" />
//                 :
//                 course.progress === 100 ?
//                 <Check className='font-semibold text-green-700'/>
//                 :
//                 <span className="font-semibold">{course.progress}%</span>
//             }
//         </div>
//     </div>
//   )
// }

// export default ProgressCircular;