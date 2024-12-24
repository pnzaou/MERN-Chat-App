import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import {useAuthStore} from "./store/useAuthStore"
import {useThemeStore} from "./store/useThemeStore"
import Navbar from "./components/Navbar"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import { Loader } from 'lucide-react'
import { Toaster } from "react-hot-toast"

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App