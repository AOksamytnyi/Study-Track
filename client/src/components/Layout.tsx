import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="min-h-screen pl-55.5 pt-22.5">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
