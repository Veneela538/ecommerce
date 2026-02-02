export interface IUpdateCredentials {
  username: string;
  password: string;
}

export interface ISignUpDetails {
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  pincode: string;
}

export interface IVariant {
  id: number;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  discountedPrice: number;
}

export interface IProduct {
  id: number;
  category: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  imageUrls: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  stockQuantity: number;
  productVariants: IVariant[];
  isPreviouslyOrdered: boolean;
  cartQuantity: number;
  isWishlisted: boolean;
  discountedPrice: number;
}

export interface ICategoryProduct {
  id: number;
  title: string;
  rating: number;
  imageUrl: string;
  price: number;
}

export interface ICartProduct {
  id: number;
  variantId: number;
  quantity: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  imageUrls: string[];
  saveForLater: boolean;
  isAvailable: boolean;
}

export interface IWishlistProduct {
  id: number;
  variantId: number;
  name: string;
  description: number;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  discountedPrice: number;
  addedAt: string;
}

export interface IOrder {
  id: number;
  orderNumber: string;

  status:
    | "CREATED"
    | "PAYMENT_PENDING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

  paymentMethod: "UPI" | "CARD" | "NET_BANKING" | "COD" | "WALLET";
  paymentTransactionId: string;

  subtotal: number;
  tax: number;
  shippingCharge: number;
  discountedPrice: number;
  totalAmount: number;

  shippingAddress: string;
  billingAddress: string;

  createdAt: string; // ISO date string
  paidAt: string;
  shippedAt: string;
  deliveredAt: string;
}

export type CheckoutItem = {
  id: number;
  variantId: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imageUrls: string[];
  isAvailable?: boolean;
};

export type AddressResponseType = {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string; //don't use maximum use UserDetailsResponseType phone number if possible.
  alternativePhoneNumber: string;
};

export type UserDetailsResponseType = {
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

export type CheckoutStep = "address" | "payment" | "review";

export type PaymentMethod = "UPI" | "CARD" | "NET_BANKING" | "COD" | "WALLET";
