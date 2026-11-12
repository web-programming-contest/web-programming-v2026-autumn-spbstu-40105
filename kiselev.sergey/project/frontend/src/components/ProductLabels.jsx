export default function ProductLabels({product, className = ''}) {
  if (!product.isNew && !product.isHit) {
    return null;
  }

  return (
    <ul className={`product-labels ${className}`}>
      {product.isNew && (
        <li className="product-label product-label-new">Новинка</li>
      )}
      {product.isHit && (
        <li className="product-label product-label-hit">Хит</li>
      )}
    </ul>
  );
}
