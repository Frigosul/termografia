'use server'

import { ForgotPasswordFormData, ForgotPasswordResponse } from '@/types/forgot-password';
import { sendPasswordResetEmail } from '@/utils/send-mail';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export async function forgotPassword(data: ForgotPasswordFormData): Promise<ForgotPasswordResponse> {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (!userExists) {
      return {
        success: false,
        message: 'Nenhum usuário encontrado com este email.'
      };
    }

    await sendPasswordResetEmail(data.email);

    return {
      success: true,
      message: 'Email enviado para resetar a senha.'
    };
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
}

