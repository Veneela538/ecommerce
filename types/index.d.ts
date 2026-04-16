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
  variantAsin: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  discountedPrice: number;
}

export interface IProduct {
  productVariantAsin: string;
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
  variantAsin: string;
  title: string;
  rating: number;
  imageUrl: string;
  price: number;
}

export interface ICartProduct {
  id: number;
  variantAsin: string;
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
  variantAsin: string;
  name: string;
  description: number;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  discountedPrice: number;
  addedAt: string;
}

export interface IOrderSummary {
  orderId: string;
  paymentMethod: PaymentMethod;
  price: number;
}

export interface IOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId: string;
  price: number;
  shippingCharge: number;
  tax: number; // included in price
  totalAmount: number; // price + shipping charge
  deliveryAddress: string;
  billingAddress: string;
  createdAt: string; // ISO date string
  paidAt: string;
  shippedAt: string;
  deliveredAt: string;
  orderItemsList: OrderItem[];
}

export type OrderItem = {
  variantAsin: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  totalAmount: number;
};

export type CheckoutItem = {
  id: number;
  variantAsin: string;
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
  alternativePhoneNumber?: string;
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

export type PaymentDetails = {
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  price: number;
  paymentExpiresAt: number;
};

export type OrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface IReview {
  name: string;
  rating: number;
  reviewTitle: string;
  reviewMessage: string;
  imageUrls: string[];
  variantAttributeList: IVariantAttribute;
  updatedAt: string;
}

export interface IVariantAttribute {
  attributeName: string;
  attributeValue: string;
}

export interface IReviewImage {
  reviewId: number;
  imageUrl: string;
}

export interface IRatingCount {
  rating: number;
  count: number;
}

export type ReviewFilter = "ALL_REVIEWS" | "REVIEWS_WITH_IMAGES";
