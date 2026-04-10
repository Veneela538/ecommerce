import { Truck } from "lucide-react";

type Props = {
  status: string;
};

const steps = [
  { label: "Order Placed", values: ["CREATED", "PAYMENT_PENDING", "PAID"] },
  { label: "Shipped", values: ["SHIPPED"] },
  { label: "Out for Delivery", values: ["OUT_FOR_DELIVERY"] },
  { label: "Delivered", values: ["DELIVERED"] },
];

const OrderTracking = ({ status }: Props) => {
  const currentStep = steps.findIndex((step) => step.values.includes(status));

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.label}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Truck */}
              {isCurrent && (
                <div className="absolute -top-6">
                  <Truck size={20} className="text-blue-950" />
                </div>
              )}

              {/* Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-2 left-1/2 w-full h-1
                  ${index < currentStep ? "bg-blue-950" : "bg-gray-300"}`}
                />
              )}

              {/* Circle */}
              <div
                className={`w-5 h-5 rounded-full z-10
                ${isCompleted ? "bg-blue-950" : "bg-gray-300"}`}
              />

              {/* Label */}
              <p
                className={`text-sm mt-2 text-center
                ${
                  isCompleted ? "text-blue-950 font-semibold" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;
