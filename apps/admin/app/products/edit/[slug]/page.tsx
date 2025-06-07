"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  inventory: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormValues>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    inventory: 0,
    categoryId: "",
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/edit/${params.slug}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch product");
        }
        
        const data = await response.json();
        console.log("Received product data:", data);
        
        if (data.product) {
          setFormData({
            name: data.product.name || "",
            slug: data.product.slug || "",
            description: data.product.description || "",
            price: data.product.price || 0,
            inventory: data.product.inventory || 0,
            categoryId: data.product.categoryId || "",
          });
        } else {
          throw new Error("Invalid product data received");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(`Failed to load product: ${err instanceof Error ? err.message : "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const data = await response.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected categories data format:", data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs specifically
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear validation error when field is edited
    if (validationErrors[name as keyof ProductFormValues]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductFormValues, string>> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    
    if (!formData.slug.trim()) {
      errors.slug = "Slug is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (formData.price < 0) {
      errors.price = "Price must be positive";
    }
    
    if (formData.inventory < 0) {
      errors.inventory = "Inventory must be a positive number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If the slug has changed, send as newSlug
      const originalSlug = params.slug as string;
      const requestData = {
        ...formData,
        newSlug: formData.slug !== originalSlug ? formData.slug : undefined
      };
      
      console.log("Submitting product update:", requestData);
      
      const response = await fetch(`/api/products/edit/${originalSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(`Failed to update product: ${err instanceof Error ? err.message : "Unknown error"}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => router.push("/products")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button 
          type="button"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          onClick={() => router.push("/products")}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="product-slug"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.slug && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.slug}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.price && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="inventory" className="text-sm font-medium">
              Inventory
            </label>
            <input
              id="inventory"
              name="inventory"
              type="number"
              value={formData.inventory}
              onChange={handleInputChange}
              placeholder="0"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.inventory ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.inventory && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.inventory}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {validationErrors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.categoryId}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}