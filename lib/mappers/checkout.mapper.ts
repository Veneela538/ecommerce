import { CheckoutItem, ICartProduct, IProduct } from "@/types";

export const mapProductToCheckoutItem = (product: IProduct): CheckoutItem => {
  const matchedVariant = product.productVariants?.find(
    (variant) => variant.variantAsin === product.productVariantAsin,
  );

  return {
    id: 0,
    variantAsin: product.productVariantAsin,
    name: product.name,
    description: product.description,
    price: product.price,
    discountedPrice: matchedVariant?.discountedPrice ?? product.price,
    quantity: product.cartQuantity,
    imageUrls: product.imageUrls,
    isAvailable: product.stockQuantity > 0,
  };
};

export const mapCartProductToCheckoutItem = (
  item: ICartProduct,
): CheckoutItem => ({
  id: item.id,
  variantAsin: item.variantAsin,
  name: item.name,
  description: item.description,
  price: item.price,
  discountedPrice: item.discountedPrice,
  quantity: item.quantity,
  imageUrls: item.imageUrls,
  isAvailable: item.isAvailable,
});
