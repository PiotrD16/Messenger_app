import { Request, Response, NextFunction } from "express";
import Joi from "joi"

export const validateJoi = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const { error } = schema.validate(req.body, {
            abortEarly: false, // nie przerywa po pierwszym bledzie
            stripUnknown: true // usuwa pola ktorych nie ma w schemacie
        });

        if (error) {
            const formattedErrors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, '')
            }));

            return res.status(400).json({
                message: "Błąd walidacji danych",
                errors: formattedErrors
            });
        }

        next();
    };
};