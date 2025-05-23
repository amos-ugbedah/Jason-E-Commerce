import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/jason/ProductCard";

const CategoryProducts = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get category details from jason_categories table
        const { data: categoryData, error: categoryError } = await supabase
          .from("jason_categories")
          .select("*")
          .eq("slug", categorySlug)
          .single();

        if (categoryError) throw categoryError;

        if (!categoryData) {
          throw new Error("Category not found");
        }

        setCategory(categoryData);

        // Fetch products that match either category name or ID
        const { data: productsData, error: productsError } = await supabase
          .from("jason_products")
          .select("*")
          .or(
            `category.eq.${categoryData.name},category_id.eq.${categoryData.id}`
          );

        if (productsError) throw productsError;

        setProducts(productsData || []);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError(err.message);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="p-8 text-center bg-gray-100 rounded-lg">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Category Not Found
          </h1>
          <p className="text-gray-600">{error}</p>
          <Link
            to="/products"
            className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {category?.name || "Category"} Products
        </h1>
        {category?.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center bg-gray-100 rounded-lg">
          <p className="text-gray-600">No products found in this category</p>
          <Link
            to="/products"
            className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {category?.image_url && (
            <div className="mt-12">
              <img
                src={category.image_url}
                alt={category.name}
                className="object-cover w-full h-64 rounded-lg"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryProducts;
