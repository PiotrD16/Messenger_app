
import { useUserRegistrationForm } from "../hooks/useUserRegistrationForm";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import './styles/RegistrationForm.css';
export function UserRegistrationForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        formState: { errors, isSubmitting },
        onSubmit,
    } = useUserRegistrationForm({
        onSuccess: () => {
            alert("Rejestracja pomyślna! Możesz się zalogować.");
            navigate("/");
        },
        onError: (message) => {
            setServerError(message);
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>Rejestracja nowego użytkownika</h1>

            {}
            {serverError && (
                <div style={{ color: "red", marginBottom: "10px", fontWeight: "bold" }}>
                    {serverError}
                </div>
            )}

            <div>
                <label htmlFor="name">Imię i nazwisko:</label>
                <input
                    id="name"
                    type="text"
                    {...register('name')}
                />
                {errors.name && (<span>{errors.name.message}</span>)}
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                />
                {errors.email && (<span>{errors.email.message}</span>)}
            </div>

            <div>
                <label htmlFor="password">Hasło:</label>
                <input
                    id="password"
                    type="password"
                    {...register('password')}
                />
                {errors.password && (<span>{errors.password.message}</span>)}
            </div>

            <div>
                <label htmlFor="dateOfBirth">Data urodzenia:</label>
                <input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                />
                {errors.dateOfBirth && (<span>{errors.dateOfBirth.message}</span>)}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
            </button>

            <h3>Masz już konto? <Link to="/" className="login-link">Zaloguj się</Link></h3>

        </form>
    );
}