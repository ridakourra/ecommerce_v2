export function calculateDiscountAmount(price, discountPercentage) {
    return (price * discountPercentage) / 100;
}

export function calculateFinalPrice(price, discountPercentage) {
    const discountAmount = calculateDiscountAmount(price, discountPercentage);
    return price - discountAmount;
}
