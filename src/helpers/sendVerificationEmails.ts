import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { APIResponse } from "@/types/APIResponse";
import { error } from "console";

export async function sendVerificationEmails(
    email : string,
    username : string,
    verifyCode : string
): Promise<APIResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return{success: true, message: "Verification Email sent successfully"}
    } catch (emailError) {
        console.error("Error Sending Verification Email", emailError);
        return{ success: false, message:"Failed to send Verification Email"}
    }
}