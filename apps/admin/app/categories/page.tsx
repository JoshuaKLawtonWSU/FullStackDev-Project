"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setNotification({
          message: "Failed to load categories",
          type: "error"
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification({ message: "", type: null });
        }, 3000);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.slug || formData.slug.length < 2) {
      newErrors.slug = "Slug must be at least 2 characters";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Auto-generate slug from name
    if (name === "name" && !formData.slug) {
      const slugValue = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData(prev => ({ ...prev, slug: slugValue }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      
      const newCategory = await response.json();
      
      setCategories([...categories, newCategory]);
      setNotification({
        message: "Category created successfully",
        type: "success"
      });
      
      // Reset form
      setFormData({
        name: "",
        slug: "",
        description: ""
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: "", type: null });
      }, 3000);
      
    } catch (error) {
      console.error("Error creating category:", error);
      setNotification({
        message: "Failed to create category",
        type: "error"
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: "", type: null });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      
      {notification.type && (
        <div 
          className={`mb-4 p-3 rounded ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                disabled={loading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>
        
        {/* Categories List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          
          {loadingCategories ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories found in the database. Add your first category!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="py-3">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}