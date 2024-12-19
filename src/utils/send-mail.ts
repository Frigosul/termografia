export async function sendPasswordResetEmail(email: string): Promise<void> {
  // In a real application, this function would send an actual email
  // For this example, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Password reset email sent to ${email}`);
}
