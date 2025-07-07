// Server/src/services/auth.service.ts
import { stytchClient } from "../config/stytch";
import { userdbService } from "../config/userDatabase";
import { generateToken } from "../utils/jwt";
import { logger } from "../utils/logger";
import { AppError } from "../errors/ApiError";
import {
  LoginRequest,
  AuthenticateRequest,
  CompleteSignupRequest,
  User,
} from "../types/auth";

export class AuthService {
  async sendMagicLink(data: LoginRequest) {
    try {
      const response = await stytchClient.magicLinks.email.loginOrCreate({
        email: data.email,
        login_magic_link_url: data.login_magic_link_url,
        signup_magic_link_url: data.signup_magic_link_url,
        login_expiration_minutes: 30,
        signup_expiration_minutes: 30,
      });

      logger.info("Magic link sent successfully", {
        email: data.email,
        userId: response.user_id,
        userCreated: response.user_created,
      });

      return {
        user_id: response.user_id,
        user_created: response.user_created,
        email_id: response.email_id,
      };
    } catch (error: any) {
      logger.error("Failed to send magic link", {
        error: error.message,
        email: data.email,
      });
      throw new AppError(error.message || "Failed to send magic link", 400);
    }
  }

  async completeSignup(data: CompleteSignupRequest) {
    try {
      const stytchUser = await stytchClient.users.get({
        user_id: data.stytch_user_id,
      });

      if (!stytchUser.emails || stytchUser.emails.length === 0) {
        throw new AppError("User email not found", 400);
      }

      const email = stytchUser.emails[0].email;

      const existingUser = await userdbService.getUserByEmail(email);
      if (existingUser) {
        throw new AppError("User already exists", 400);
      }

      const dbUser = await userdbService.createUser({
        stytch_user_id: data.stytch_user_id,
        name: data.name,
        prn: Number(data.prn),
        email,
        role: data.role,
        school: data.school,
      });

      logger.info("User signup completed", {
        userId: data.stytch_user_id,
        email,
        name: data.name,
        prn: data.prn,
      });

      return dbUser;
    } catch (error: any) {
      logger.error("Failed to complete signup", {
        error: error.message,
        stytch_user_id: data.stytch_user_id,
      });
      throw new AppError(error.message || "Failed to complete signup", 400);
    }
  }

  async authenticateToken(token: string) {
    try {
      const response = await stytchClient.magicLinks.authenticate({
        token,
        session_duration_minutes: 60 * 24 * 7, // 7 days
      });

      const { user, session } = response;
      const email = user.emails[0]?.email;

      if (!email) {
        throw new AppError("User email not found", 400);
      }

      const dbUser = await userdbService.getUserByEmail(email);

      if (!dbUser) {
        return {
          user: {
            id: user.user_id,
            email: email,
            name:
              user.name?.first_name && user.name?.last_name
                ? `${user.name.first_name} ${user.name.last_name}`
                : null,
            created_at: user.created_at,
            status: user.status,
          },
          requires_completion: true,
          session_id: session?.session_id ?? null,
          expires_at: session?.expires_at ?? null,
        };
      }

      const jwtToken = generateToken(user.user_id, email);

      return {
        user: {
          id: user.user_id,
          email: dbUser.email,
          name: dbUser.name,
          prn: dbUser.prn,
          role: dbUser.role,
          school: dbUser.school,
          status: user.status,
        },
        token: jwtToken,
        session_id: session?.session_id,
        expires_at: session?.expires_at,
      };
    } catch (error: any) {
      logger.error("Authentication failed", { error: error.message });
      throw new AppError(error.message || "Authentication failed", 401);
    }
  }

  async logout(sessionId?: string) {
    try {
      if (sessionId) {
        await stytchClient.sessions.revoke({ session_id: sessionId });
        logger.info("Session revoked successfully", { sessionId });
      }
      return { success: true };
    } catch (error: any) {
      logger.error("Logout failed", { error: error.message, sessionId });
      return { success: true }; // Consider logout successful even if session revocation fails
    }
  }
}

export const authService = new AuthService();
