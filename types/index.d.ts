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
  productVariants: IVariant[];
}

export interface ICategoryProduct {
  id: number;
  title: string;
  rating: number;
  imageUrl: string;
  price: number;
}

export interface ICartProduct {
  productId: number;
  variantId: number;
  quantity: number;
  name: string;
  description: number;
  price: number;
  imageUrls: string[];
  isAvailable: boolean;
}
