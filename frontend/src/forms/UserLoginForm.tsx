import { useUserLoginForm } from "../hooks/useUserLoginForm";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { setAccessToken } from "../hooks/useAxiosPrivate";
import { useAuth } from "../context/AuthProvider";
import "./styles/RegistrationForm.css";

export function UserLoginForm() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [loginMessage, setLoginMessage] = useState<string | null>(null);
    const [loginMessageType, setLoginMessageType] = useState<"success"|"error">("success");

    const { register, formState: { errors, isSubmitting }, onSubmit } = useUserLoginForm({
        onSuccess: (data: any) => {
            const name = data.user.userName || "Użytkowniku";

            setLoginMessage(`Zalogowano pomyślnie! Witaj ${name}`);
            setLoginMessageType("success");

            // do axios
            setAccessToken(data.accessToken);

            setAuth({
                user: data.user,
                accessToken: data.accessToken
            });

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        },

        onError: (error: any) => {
            setLoginMessage(`Błąd logowania: ${error}`);
            setLoginMessageType("error");
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>Zaloguj się</h1>

            {loginMessage && (
                <div className={`login-message ${loginMessageType}`}>{loginMessage}</div>
            )}

            <div>
                <label htmlFor="email">Adres email:</label>
                <input id="email" type="email" {...register("email")} />
                {errors.email && (<span>{errors.email.message}</span>)}
            </div>

            <div>
                <label htmlFor="password">Hasło</label>
                <input id="password" type="password" {...register("password")} />
                {errors.password && (<span>{errors.password.message}</span>)}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </button>

            <h3>Nie masz konta? <Link to="/register" className="login-link">Zarejestruj się!</Link></h3>
        </form>
    );
}