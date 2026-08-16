import { z } from "zod";
import { MAX_PARTY_SIZE_ONLINE } from "@/lib/constants";

export const reservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z
    .number()
    .min(1)
    .max(MAX_PARTY_SIZE_ONLINE, `For parties over ${MAX_PARTY_SIZE_ONLINE}, please call us directly.`),
  specialRequests: z.string().optional(),
});