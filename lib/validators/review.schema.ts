import { z } from "zod";

export const reviewSchema = z.object({
  menuItemId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Please write a short review"),
});