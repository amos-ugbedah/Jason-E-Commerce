import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    featured: false,
    discount_percentage: null,
    free_delivery: false,
    currency: "NGN",
    specifications: "",
    category: "Electronics",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Cloudinary config
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      errors.price = "Valid price is required";
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0)
      errors.stock_quantity = "Valid stock quantity is required";
    if (imageFiles.length < 1) errors.images = "At least one image is required";
    if (!formData.category) errors.category = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = imageFiles.length + newFiles.length;

    if (totalFiles > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(`Failed to upload ${file.name}`);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount_percentage) || 0;
    return discount > 0 ? price - (price * discount) / 100 : price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Verify seller exists
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;

      const { data: seller, error: sellerError } = await supabase
        .from("jason_sellers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (sellerError || !seller) {
        throw new Error(
          "Please complete your seller profile before adding products"
        );
      }

      // 2. Upload images
      const cloudinaryUrls = await uploadImagesToCloudinary();

      // 3. Insert product
      const { error } = await supabase.from("jason_products").insert([
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          featured: formData.featured,
          cloudinary_urls: cloudinaryUrls,
          discount_percentage: formData.discount_percentage
            ? parseFloat(formData.discount_percentage)
            : null,
          free_delivery: formData.free_delivery,
          currency: formData.currency,
          specifications: formData.specifications,
          category: formData.category,
          seller_id: seller.id,
          rating: 0,
          review_count: 0,
        },
      ]);

      if (error) throw error;

      toast.success("Product added successfully!");
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Product submission failed:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto mt-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <button
          onClick={() => navigate("/seller/dashboard")}
          className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          disabled={loading}
        >
          Return to Dashboard
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                required
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  formErrors.description ? "border-red-500" : ""
                }`}
                rows={4}
                required
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  formErrors.category ? "border-red-500" : ""
                }`}
                required
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Furniture">Furniture</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
              </select>
              {formErrors.category && (
                <p className="text-sm text-red-500">{formErrors.category}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Specifications</label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Color: Red, Size: XL, Material: Cotton"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Price*</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full p-2 border rounded ${
                      formErrors.price ? "border-red-500" : ""
                    }`}
                    required
                  />
                  <span className="absolute text-gray-500 right-3 top-2">
                    {formData.currency === "NGN"
                      ? "₦"
                      : formData.currency === "USD"
                      ? "$"
                      : formData.currency === "EUR"
                      ? "€"
                      : formData.currency}
                  </span>
                </div>
                {formErrors.price && (
                  <p className="text-sm text-red-500">{formErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Stock Quantity*</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full p-2 border rounded ${
                    formErrors.stock_quantity ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.stock_quantity && (
                  <p className="text-sm text-red-500">
                    {formErrors.stock_quantity}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Currency*</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="NGN">Naira (₦)</option>
                  <option value="USD">Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">Pound (£)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Discount Percentage
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage || ""}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full p-2 border rounded"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            </div>

            {formData.discount_percentage && (
              <p className="text-sm text-green-600">
                Final Price: {calculateFinalPrice().toFixed(2)}{" "}
                {formData.currency}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span>Featured Product</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="free_delivery"
                  checked={formData.free_delivery}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span>Free Delivery</span>
              </label>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Product Images* (1-5)
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                className={`w-full p-2 border rounded ${
                  formErrors.images ? "border-red-500" : ""
                }`}
                disabled={imageFiles.length >= 5}
              />
              <p className="text-sm text-gray-500">
                {imageFiles.length >= 5
                  ? "Maximum 5 images reached"
                  : "Max 5MB per image (JPEG, PNG)"}
              </p>
              {formErrors.images && (
                <p className="text-sm text-red-500">{formErrors.images}</p>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {previewUrls.length > 0 && (
              <div>
                <label className="block mb-2 font-medium">
                  Image Previews ({imageFiles.length}/5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-20 h-20 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-0 left-0 px-1 text-xs text-white bg-black rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 -ml-1 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Product...
              </span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}