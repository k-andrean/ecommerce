import { StarIcon } from "@heroicons/react/20/solid";
import { classNames } from "utils";

const Rating = ({ rating, maxStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) => (
        <StarIcon
          key={index}
          className={classNames(
            rating > index ? "text-yellow-400" : "text-gray-200",
            "h-5 w-5 flex-shrink-0"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default Rating;
