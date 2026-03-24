import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"

// walidacja
const UserLoginSchema = z.object({
    email: z
        .email("Podaj poprawny adres email!"),
    password: z
        .string()
        .min(8, "Hasło musi mieć co najmniej 8 znaków.")
        .max(30, "Hasło może mieć maksymalnie 30 znaków."),
})

export type UserLoginData = z.infer<typeof UserLoginSchema>;

export const useUserLoginForm = ({onSuccess, onError}: {onSuccess: Function, onError: Function}) => {
    const form = useForm<UserLoginData>({
        resolver: zodResolver(UserLoginSchema),
        mode: "onChange",
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: UserLoginData) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                onError?.(json.message || "Wystąpił błąd logowania");
                return;
            }

            onSuccess?.(json);

        } catch (err) {
            console.error("Szczegóły błędu połączenia:", err);
            onError?.("Błąd serwera - brak połączenia");
        }
    };

    return {
        ...form,
        onSubmit: form.handleSubmit(onSubmit)
    }
}