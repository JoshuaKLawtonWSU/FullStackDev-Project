"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Top Navigation Bar */}
      <header className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-bold mb-2 sm:mb-0">Admin Dashboard</h1>
            
            <nav>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link 
                    href="/" 
                    className={`px-3 py-1 ${activeTab === "dashboard" ? "font-bold underline" : ""}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/categories" 
                    className={`px-3 py-1 ${activeTab === "categories" ? "font-bold underline" : ""}`}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/users" 
                    className={`px-3 py-1 ${activeTab === "users" ? "font-bold underline" : ""}`}
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className={`px-3 py-1 ${activeTab === "products" ? "font-bold underline" : ""}`}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/orders" 
                    className={`px-3 py-1 ${activeTab === "orders" ? "font-bold underline" : ""}`}
                  >
                    Orders
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="border-t p-4 mt-auto">
        <p className="text-center text-sm">
          Admin Dashboard © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
