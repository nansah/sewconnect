
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast.success("Logged in successfully!");
    return { data, error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { error };
  }
}

export async function demoSeamstressLogin() {
  console.log("Starting demo seamstress login...");
  try {
    const email = "demo.seamstress@example.com";
    const password = "demo123456!";
    console.log("Using demo credentials:", { email, password });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Demo login error:", error);
      throw error;
    }

    console.log("Demo login successful:", data);
    toast.success("Logged in as demo seamstress!");
    return { data, error: null };
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
