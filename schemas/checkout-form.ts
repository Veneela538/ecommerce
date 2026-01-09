import { z } from "zod";

export const CheckoutFormSchema = z.object({
  paymentMethod: z.string().nonempty("Payment method is required."),
  shippingAddress: z.string().nonempty("Shipping Address is required."),
  billingAddress: z.string().nonempty("Billing Address is required."),
});
