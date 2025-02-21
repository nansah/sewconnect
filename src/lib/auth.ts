
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
  const demoEmail = "demo.seamstress.1@example.com"; // Changed email to avoid validation issues
  const demoPassword = "demo123456!"; // Added special character for stronger password

  try {
    // First try to log in
    let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    // If login fails, create the account
    if (signInError) {
      console.log("Creating new demo account...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            first_name: "Demo",
            last_name: "Seamstress",
            user_type: "seamstress"
          }
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }

      // Try logging in immediately after creating account
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (retryError) {
        console.error("Retry login error:", retryError);
        throw retryError;
      }

      console.log("Successfully created and logged in demo account");
    }

    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    if (!userId) {
      throw new Error("No user ID found after authentication");
    }

    // Create a seamstress profile if it doesn't exist
    const { error: profileError } = await supabase
      .from('seamstress_profiles')
      .upsert({
        id: userId, // Use the user's ID as the profile ID
        user_id: userId,
        name: "Demo Seamstress",
        specialty: "General Alterations",
        location: "Demo City",
        price: "$50-100",
        rating: 5.0, // Add the required rating field
        portfolio_images: [], // Add empty portfolio images array
        image_url: null // Add optional image url
      })
      .select();

    if (profileError) {
      console.error("Profile creation error:", profileError);
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
