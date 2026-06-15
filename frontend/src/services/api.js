const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth API
  async register(fullName, email, password, phoneNumber, address) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phoneNumber, address }),
    });
    return handleResponse(response);
  },

  async login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Customer API
  async getProfile() {
    const response = await fetch(`${BASE_URL}/customer/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async updateProfile(profileData) {
    const response = await fetch(`${BASE_URL}/customer/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Admin API
  async getAllCustomers() {
    const response = await fetch(`${BASE_URL}/admin/customers`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getCustomerById(id) {
    const response = await fetch(`${BASE_URL}/admin/customers/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async updateCustomer(id, customerData) {
    const response = await fetch(`${BASE_URL}/admin/customers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(customerData),
    });
    return handleResponse(response);
  },

  async deleteCustomer(id) {
    const response = await fetch(`${BASE_URL}/admin/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async forgotPassword(email) {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  async resetPassword(token, password) {
    const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },

  async adminSendResetLink(id) {
    const response = await fetch(`${BASE_URL}/admin/customers/${id}/reset-email`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
