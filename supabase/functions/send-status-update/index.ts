
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateEmail {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  status: string;
  notes: string;
  seamstressName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, orderNumber, status, notes, seamstressName }: StatusUpdateEmail = await req.json();

    const { data, error } = await resend.emails.send({
      from: "orders@yourdomain.com",
      to: customerEmail,
      subject: `Order Status Update - ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Status Update</h1>
          <p>Dear ${customerName},</p>
          <p>Your order ${orderNumber} has been updated:</p>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #2563eb;">${status.replace(/_/g, ' ').toUpperCase()}</h2>
            <p style="margin-bottom: 0;">${notes}</p>
          </div>
          <p>Your seamstress, ${seamstressName}, has made progress on your order.</p>
          <p>You can track your order status anytime by logging into your account.</p>
          <p>Best regards,<br>Your Alterations Team</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
