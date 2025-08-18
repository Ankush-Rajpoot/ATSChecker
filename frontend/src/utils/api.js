// API utility functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Base API client
export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken.state?.token) {
          config.headers.Authorization = `Bearer ${parsedToken.state.token}`;
        }
      } catch (e) {
        console.warn('Error parsing auth token:', e);
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Network error occurred', 0);
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Upload failed'));
    
    xhr.open('POST', `${API_BASE_URL}/upload`);
    
    // Add auth header
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken.state?.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${parsedToken.state.token}`);
        }
      } catch (e) {
        console.warn('Error parsing auth token for upload:', e);
      }
    }
    
    xhr.send(formData);
  });
};

// Specific API functions
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh'),
};

export const atsAPI = {
  analyzeResume: (data) => apiClient.post('/ats/analyze', data),
  getReports: () => apiClient.get('/ats/reports'),
  getReport: (id) => apiClient.get(`/ats/reports/${id}`),
  deleteReport: (id) => apiClient.delete(`/ats/reports/${id}`),
};

export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data),
  getUsage: () => apiClient.get('/user/usage'),
};