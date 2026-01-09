import { CheckoutItem, ICartProduct, IProduct } from "@/types";

export const mapProductToCheckoutItem = (product: IProduct): CheckoutItem => ({
  variantId: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  discountedPrice: product.discountedPrice,
  quantity: product.cartQuantity,
  imageUrls: product.imageUrls,
  isAvailable: product.stockQuantity > 0,
});

export const mapCartProductToCheckoutItem = (
  item: ICartProduct
): CheckoutItem => ({
  variantId: item.variantId,
  name: item.name,
  description: item.description,
  price: item.price,
  discountedPrice: item.discountedPrice,
  quantity: item.quantity,
  imageUrls: item.imageUrls,
  isAvailable: item.isAvailable,
});
