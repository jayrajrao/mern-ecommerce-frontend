// import { useNavigate } from "react-router-dom";

// function ProductCard({ product }) {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/product/${product._id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="overflow-hidden transition-all duration-300 bg-white shadow-sm cursor-pointer group rounded-2xl hover:shadow-xl hover:-translate-y-1"
//     >
//       {/* image */}
//       <div className="overflow-hidden">
//         <img
//          src={product.images?.url || "/placeholder.png"}
//           alt={product.name}
//           className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>

//       {/* content */}
//       <div className="p-4">
//         <h3 className="font-semibold line-clamp-1">
//           {product.name}
//         </h3>

//         <p className="mt-1 font-bold text-green-600">
//           ₹{Number(product.price).toLocaleString("en-IN")}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  // Image resolver
  const getImageUrl = (images) => {
    // object
    if (images && !Array.isArray(images) && images.url) {
      return images.url;
    }

    // array
    if (Array.isArray(images) && images[0]?.url) {
      return images[0].url;
    }

    // string
    if (typeof images === "string") {
      return images;
    }

    return "/placeholder.png";
  };

  const imageUrl = getImageUrl(product.images);

  return (
    <div
      onClick={handleClick}
      className="overflow-hidden transition-all duration-300 bg-white shadow-sm cursor-pointer group rounded-2xl hover:shadow-xl hover:-translate-y-1"
    >
      {/* image */}
      <div className="overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error("IMAGE LOAD FAILED:", e.currentTarget.src);

            if (!e.currentTarget.src.includes("placeholder.png")) {
              e.currentTarget.src = "/placeholder.png";
            }
          }}
        />
      </div>

      {/* content */}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">
          {product.name}
        </h3>

        <p className="mt-1 font-bold text-green-600">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;