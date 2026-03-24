import {z} from "zod";
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

const userRegistrationSchema = z.object({
    email: z
        .email("Niepoprawny format adresu email!")
        .min(5, "Minimalna długość adresu email to 5"),
    password: z
        .string()
        .min(8, "Minimalna długość hasła to 8")
        .max(30, "Maksymalna długość hasła to 30"),
    name: z
        .string()
        .min(5, "Minimalna długość nazwy użytkownika to 5")
        .max(30, "Maksymalna długość nazyw użytkownika to 30"),
    dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Użyj formatu YYYY-MM-DD")
})

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

type useUserRegistrationFormProps = {
    onSuccess?: (data: any) => void;
    onError?: (message: string) => void;
}

export const useUserRegistrationForm = ({ onSuccess, onError }: useUserRegistrationFormProps) => {
    const form = useForm<UserRegistrationData>({
        resolver: zodResolver(userRegistrationSchema),
        mode: "onChange",
        defaultValues: {
            email: '',
            password: '',
            name: '',
            dateOfBirth:''
        }
    });

    const onSubmit = async (data: UserRegistrationData) => {
        try {
            const payload = {
                email: data.email,
                password: data.password,
                userName: data.name,
                date_of_birth: data.dateOfBirth
            };

            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });

            const json = await res.json();

            if (!res.ok) {
                onError?.(json.error || "Rejestracja nie powiodła się");
                return;
            }

            onSuccess?.(json);

        } catch (err) {
            onError?.("Błąd połączenia z serwerem");
            console.error(err);
        }
    }

    return {
        ...form,
        onSubmit: form.handleSubmit(onSubmit)
    };
}