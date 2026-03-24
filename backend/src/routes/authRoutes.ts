import express from "express";
import { loginRequest, logoutRequest, refreshTokenRequest } from "../controllers/authController";
import { registerRequest } from "../controllers/registerAuthController";
import { changePassword } from "../controllers/passwordController";
import { authenticateToken } from "../middleware/authMiddleware";

import { validateJoi } from "../middleware/validateJoi";
import { loginJoiSchema, registerJoiSchema, changePasswordJoiSchema } from "../schemas/authJoiSchemas";

const router = express.Router();

router.post("/auth/login", validateJoi(loginJoiSchema), loginRequest);
router.post("/auth/register", validateJoi(registerJoiSchema), registerRequest);
router.post("/auth/change-password", authenticateToken, validateJoi(changePasswordJoiSchema), changePassword);
router.get("/auth/refresh", refreshTokenRequest);
router.post("/auth/logout", logoutRequest);

export default router;