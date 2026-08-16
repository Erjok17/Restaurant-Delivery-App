import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        quantity: z.number().min(1),
        price: z.number(),
      })
    )
    .min(1, "Cart cannot be empty"),
});