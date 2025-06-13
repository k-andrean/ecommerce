const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  disableDecrease,
}) => (
  <div className="mt-2 flex items-center">
    <button
      type="button"
      className="text-sm font-medium text-gray-700 hover:text-gray-800"
      onClick={onDecrease}
      disabled={disableDecrease}
    >
      -
    </button>
    <p className="mx-4 text-sm font-medium text-gray-900">{quantity}</p>
    <button
      type="button"
      className="text-sm font-medium text-gray-700 hover:text-gray-800"
      onClick={onIncrease}
    >
      +
    </button>
  </div>
);

export default QuantityControl;
