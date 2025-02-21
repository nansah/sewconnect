import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Order {
  id: string;
  customer_name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conversation: any; // Changed to any to fix type mismatch with Supabase
  created_at: string;
  measurements?: string;
  seamstress_id: string;
  updated_at?: string;
}
