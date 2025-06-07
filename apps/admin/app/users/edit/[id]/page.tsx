'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false,
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // Update the API path to match your actual endpoint
        const response = await fetch(`/api/users/edit/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const data = await response.json();
        
        // Map the API response fields to the form fields
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email,
          isAdmin: data.isAdmin || false,
        });
      } catch (err) {
        setError('Error loading user data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  // Handle checkbox change
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      isAdmin: e.target.checked,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Navigate back to users list on success
      router.push('/users');
    } catch (err) {
      setError('An error occurred while updating the user.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">{error}</p>
          <Link href="/users">
            <button 
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Back to Users
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/users">
        <button 
          className="mb-6 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Users
        </button>
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Edit User Permissions</h2>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-md font-medium text-gray-700 mb-3">User Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="text-base">{userData.firstName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="text-base">{userData.lastName}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-base">{userData.email}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-700 mb-4">Permissions</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={userData.isAdmin}
                    onChange={handleAdminChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                    Administrator
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Administrators have full access to all areas of the application
                </p>
              </div>
              
              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <Link href="/users">
                  <button 
                    type="button" 
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </Link>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}