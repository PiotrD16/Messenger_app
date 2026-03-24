import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserRegistrationForm } from "./forms/UserRegistrationForm";
import { UserLoginForm } from "./forms/UserLoginForm";
import { Dashboard } from "./pages/Dashboard";
import PersistLogin from "./components/PersistLogin"; // <--- IMPORT

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserLoginForm />} />
                <Route path="/register" element={<UserRegistrationForm />} />
                <Route element={<PersistLogin />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;