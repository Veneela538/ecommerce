import { CheckoutProvider } from "@/context/checkout";

export default async function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CheckoutProvider
        deliveryAddressValue={null}
        billingAddressValue={null}
        paymentMethodValue={null}
      >
        <div>{children}</div>
      </CheckoutProvider>
    </>
  );
}
