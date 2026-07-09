import { useAuthStore } from "../store/authStore"

 
 
 export function Header() {
    const username = useAuthStore((state) => state.user?.username)

    return <header className="fixed left-0 right-0 top-0 flex h-22.5 z-10 items-center justify-between bg-white pl-4 pr-4 font-inter">
        <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt=""  className="w-13.75 h-12.5"/>
            <h1 className="font-semibold text-2xl">Study Track</h1>
        </div>

        <div className="flex gap-0.5 items-center">
            <p>{username}</p>
            <img src="/Ellipse 18.svg" alt="" />
        </div>
    </header>
 }
 
