import { useAuth } from "@clerk/clerk-react";
import "./App.css";
import Header from "./components/Header/Header";
import SingleProfessor from "./components/SingleProfessor/SingleProfessor";
import Home from "./Pages/Home";
import Professors from "./Pages/Professors";
import Compare from "./Pages/Compare";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn, RedirectToSignIn } from "@clerk/clerk-react";

// Improved ProtectedRoute to handle isLoaded
function ProtectedRoute({ element }) {
  const { isLoaded, isSignedIn } = useAuth();

  // Show a loading state until Clerk loads completely
  if (!isLoaded) {
    return <div>Loading...</div>; // Optional: Add a spinner or loading component
  }

  // Redirect to sign-in page if user is not signed in
  return isSignedIn ? element : <RedirectToSignIn />;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route path="/professor" element={<ProtectedRoute element={<SingleProfessor />} />} />
        <Route path="/all-professors" element={<ProtectedRoute element={<Professors />} />} />
        <Route path="/compare/:id" element={<ProtectedRoute element={<Compare />} />} />

        {/* Clerk Default Sign-In Route */}
        <Route path="/sign-in/*" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
