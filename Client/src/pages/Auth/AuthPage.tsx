import { GalleryVerticalEnd } from "lucide-react"
import mit_img from "../../assets/MITAOE Landing IMAGE.jpg";
import College_logo from "../../assets/logo_MITAOE.jpg";
import LoginForm  from "@/components/login-form"

export default function AuthPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden bg-muted lg:block">
        <img
          src={mit_img}
          alt="MITAOE Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:grayscale"
        />
        <img src={College_logo} className="absolute left-10 top-10 h-12 w-auto" alt="College Logo" />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
           AI Course
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
