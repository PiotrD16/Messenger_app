import Joi from "joi";

export const loginJoiSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Podaj poprawny adres email',
            'any.required': 'Email jest wymagany',
            'string.empty': 'Email nie może być pusty'
        }),
    password: Joi.string()
        .required()
        .min(8)
        .messages({
            'any.required': 'Hasło jest wymagane',
            'string.empty': 'Hasło nie może być puste',
            'string.min': 'Hasło musi mieć min. 8 znaków'
        })
});

export const registerJoiSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Niepoprawny format email',
            'any.required': 'Email jest wymagany'
        }),
    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.min': 'Hasło musi mieć min. 8 znaków',
            'string.max': 'Hasło może mieć max. 30 znaków',
            'any.required': 'Hasło jest wymagane'
        }),
    userName: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.min': 'Nazwa użytkownika musi mieć min. 5 znaków',
            'any.required': 'Nazwa użytkownika jest wymagana'
        }),
    date_of_birth: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            'string.pattern.base': 'Format daty to YYYY-MM-DD',
            'any.required': 'Data urodzenia jest wymagana'
        })
});

export const changePasswordJoiSchema = Joi.object({
    oldPassword: Joi.string().required().messages({'any.required': 'Stare hasło wymagane'}),
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Nowe hasło musi mieć min. 8 znaków',
        'any.required': 'Nowe hasło wymagane'
    })
});