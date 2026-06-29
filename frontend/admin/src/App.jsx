import { useState } from "react";
import { Toaster } from "sonner";
import { LoginPage } from "./components/Auth/LoginForm";
import { SignUpPage } from "./components/Auth/SignUpForm";
import { DashboardPage } from "./components/Views/DashboardPage";
import { StudentsPage } from "./components/Views/StudentsPage";

export default function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      {page === "login" && <LoginPage onNavigate={setPage} />}
      {page === "signup" && <SignUpPage onNavigate={setPage} />}
      {page === "dashboard" && <DashboardPage onLogout={() => setPage("login")} />}
      {page === "students" && <StudentsPage />}
    </>
  );
}
