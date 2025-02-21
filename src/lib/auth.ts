
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserType = 'customer' | 'seamstress';

export async function signUp(email: string, password: string, firstName: string, lastName: string, userType: UserType) {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType
        }
      }
    });

    if (error) throw error;

    toast.success("Account created successfully! Please check your email to confirm your account.");
    return { error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast.success("Logged in successfully!");
    return { error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { error };
  }
}

export async function demoSeamstressLogin() {
  try {
    // First try to log in
    let { data, error } = await supabase.auth.signInWithPassword({
      email: "demo.seamstress@example.com",
      password: "demo123456",
    });

    // If login fails, try to create the account
    if (error) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "demo.seamstress@example.com",
        password: "demo123456",
        options: {
          data: {
            first_name: "Demo",
            last_name: "Seamstress",
            user_type: "seamstress"
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Try logging in again
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: "demo.seamstress@example.com",
        password: "demo123456",
      });

      if (retryError) {
        throw retryError;
      }
    }

    toast.success("Logged in as demo seamstress!");
    return { error: null };
  } catch (error: any) {
    console.error("Demo login error:", error);
    toast.error(error.message);
    return { error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success("Logged out successfully");
  } catch (error: any) {
    toast.error(error.message);
  }
}
