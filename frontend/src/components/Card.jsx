import { Link } from "react-router-dom";
import Rating from "./Rating";

const Card = ({ data }) => {
  //   console.log("data", data);
  return (
    <div
      key={data.id}
      className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
    >
      <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
        <img
          src={data?.image_path}
          alt={data.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="pb-4 pt-10 text-center">
        <h3 className="text-sm font-medium text-gray-900">
          <Link to={`/products/detail/${data.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {data.name}
          </Link>
        </h3>
        <div className="mt-3 flex flex-col items-center">
          <p className="sr-only">{data.rating} out of 5 stars</p>
          <Rating rating={data.rating} />
        </div>
        <p className="mt-4 text-base font-medium text-gray-900">
          Rp {Math.floor(data.price)}
        </p>
      </div>
    </div>
  );
};

export default Card;
