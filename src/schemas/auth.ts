import { z } from "zod";

export const signinSchema = z.object({
  email: z.email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(6, "passwordは必須です"),
});
export const signupSchema = signinSchema.extend({
  password: z
    .string()
    .min(1, "passwordは必須です")
    .min(6, "paswordは6文字以上で入力してください"),
});

export type SigninFormValue = z.infer<typeof signinSchema>;
export type SignupFormValue = z.infer<typeof signupSchema>;
