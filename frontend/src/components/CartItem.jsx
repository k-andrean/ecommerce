import CustomLink from "./CustomLink";
import QuantityControl from "./QuantityControl";

const CartItem = ({ product, quantity, onQuantityChange, onRemove }) => (
  <li key={product.id} className="flex py-6">
    <div className="flex-shrink-0">
      <img
        src={product.image_path}
        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
      />
    </div>

    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
      <div>
        <div className="flex justify-between">
          <h4 className="text-sm">
            <CustomLink
              className="font-medium text-gray-700 hover:text-gray-800"
              to={`/products/detail/${product.id}`}
            >
              {product.name}
            </CustomLink>
          </h4>
          <p className="ml-4 text-sm font-medium text-gray-900">
            Rp {Math.floor(product.price)}
          </p>
        </div>

        <QuantityControl
          quantity={quantity}
          onIncrease={() => onQuantityChange(product.id, quantity + 1)}
          onDecrease={() => onQuantityChange(product.id, quantity - 1)}
          disableDecrease={quantity <= 1}
        />

        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
        <p className="mt-1 text-sm text-gray-500">{product.size}</p>
      </div>

      <div className="mt-4 flex flex-1 items-end justify-end">
        <div className="ml-4">
          <button
            type="button"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            onClick={() => onRemove(product.id)}
          >
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  </li>
);

export default CartItem;
