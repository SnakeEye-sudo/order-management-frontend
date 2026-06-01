import api from "./client";

// Auth endpoints (public)
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// Product catalog endpoints (JWT required; create/update/delete = Admin only)
export const productApi = {
  getAll: (page = 0, size = 12, sortBy = "id", sortDir = "asc") =>
    api.get("/products", { params: { page, size, sortBy, sortDir } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

// Order endpoints (JWT required)
export const orderApi = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  place: (items) => api.post("/orders", { items }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.delete(`/orders/${id}`),
};
