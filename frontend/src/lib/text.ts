import type { Product } from '../types/product';

function fixMojibake(value: string): string {
  if (!value) return value;

  const looksBroken = /[ÃÂ�]/.test(value);
  if (!looksBroken) return value;

  try {
    const bytes = Uint8Array.from(Array.from(value).map((char) => char.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder('utf-8').decode(bytes);
    return decoded || value;
  } catch {
    return value;
  }
}

export function sanitizeProductText(product: Product): Product {
  return {
    ...product,
    name: fixMojibake(product.name),
    description: product.description ? fixMojibake(product.description) : product.description,
    sku: fixMojibake(product.sku),
    category: {
      ...product.category,
      name: fixMojibake(product.category.name),
      description: product.category.description ? fixMojibake(product.category.description) : product.category.description
    }
  };
}

