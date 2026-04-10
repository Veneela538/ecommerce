import getPaymentDetails from "@/actions/payment/get-payment-details";
import PaymentActions from "@/components/checkout/payment-actions";
import { PaymentDetails } from "@/types";

type Props = {
  params: Promise<{ token: string }>;
};

const ProcessPayment = async ({ params }: Props) => {
  const { token } = await params;
  const { data }: { data: PaymentDetails } = await getPaymentDetails(token);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 border border-gray-200 rounded-xl shadow-sm p-4 bg-gray-100">
        <h1 className="font-extrabold text-lg text-center">Review & Pay</h1>

        {/* Order Snapshot */}
        <div className="border p-4 rounded gap-4 bg-white">
          <p>
            <strong>Deliver to:</strong> {data.deliveryAddress}
          </p>
          <p>
            <strong>Payment:</strong> {data.paymentMethod}
          </p>
          <p>
            <strong>Total:</strong> ₹{data.price}
          </p>
        </div>

        {/* Security message */}
        {/* <p className="text-sm text-gray-500">
          🔒 Secure transaction. Your payment info is encrypted.
        </p> */}
        <PaymentActions
          token={token}
          price={data.price}
          paymentExpiresAt={data.paymentExpiresAt}
        />
      </div>
    </div>
  );
};

export default ProcessPayment;
