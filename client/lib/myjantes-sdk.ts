/**
 * MyJantes Mobile SDK
 * Version: 1.0.0
 * Adapted for React Native / Expo
 */

import { getApiUrl } from './query-client';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'client' | 'admin' | 'employee' | 'superadmin';
  garageId?: string;
}

export interface Quote {
  id: string;
  clientId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount: string;
  createdAt: string;
}

export interface UploadUrlResponse {
  url: string;
  objectPath: string;
}

export class MyJantesClient {
  private getBaseUrl(): string {
    return getApiUrl();
  }

  private async request(path: string, options: RequestInit = {}) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}api${path}`;
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.statusText} - ${error}`);
    }
    
    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/user');
  }

  // Quotes
  async getMyQuotes(): Promise<Quote[]> {
    return this.request('/quotes');
  }

  async getQuote(id: string): Promise<Quote> {
    return this.request(`/quotes/${id}`);
  }

  // Admin Quotes
  async getAdminQuotes(): Promise<Quote[]> {
    return this.request('/admin/quotes');
  }

  async createQuote(data: Partial<Quote>): Promise<Quote> {
    return this.request('/admin/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuote(id: string, data: Partial<Quote>): Promise<Quote> {
    return this.request(`/admin/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteQuote(id: string): Promise<void> {
    return this.request(`/admin/quotes/${id}`, {
      method: 'DELETE',
    });
  }

  // Media Upload Flow
  async requestUploadUrl(fileName: string, size: number, contentType: string): Promise<UploadUrlResponse> {
    return this.request('/uploads/request-url', {
      method: 'POST',
      body: JSON.stringify({ name: fileName, size, contentType }),
    });
  }

  async uploadFile(uploadUrl: string, file: Blob, contentType: string): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  }

  async linkQuoteMedia(quoteId: string, fileName: string, objectPath: string, fileType: string) {
    return this.request(`/admin/quotes/${quoteId}/media`, {
      method: 'POST',
      body: JSON.stringify({ fileName, filePath: objectPath, fileType }),
    });
  }

  async deleteQuoteMedia(quoteId: string, mediaId: string): Promise<void> {
    return this.request(`/admin/quotes/${quoteId}/media/${mediaId}`, {
      method: 'DELETE',
    });
  }

  async getQuoteMedia(quoteId: string): Promise<any[]> {
    return this.request(`/quotes/${quoteId}/media`);
  }

  // Invoices
  async getInvoices() {
    return this.request('/invoices');
  }

  async getAdminInvoices() {
    return this.request('/admin/invoices');
  }

  async createInvoice(data: any) {
    return this.request('/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvoice(id: string, data: any) {
    return this.request(`/admin/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async sendInvoiceEmail(id: string) {
    return this.request(`/admin/invoices/${id}/send-email`, {
      method: 'POST',
    });
  }

  // Reservations
  async getReservations() {
    return this.request('/reservations');
  }

  async createReservation(data: any) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdminReservations() {
    return this.request('/admin/reservations');
  }

  async updateReservation(id: string, data: any) {
    return this.request(`/admin/reservations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Users
  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async updateUser(id: string, data: any) {
    return this.request(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Services
  async getServices() {
    return this.request('/services');
  }

  async createService(data: any) {
    return this.request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request(`/admin/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics(params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    const queryString = queryParams.toString();
    return this.request(`/admin/analytics${queryString ? '?' + queryString : ''}`);
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // Conversations / Chat
  async getConversations() {
    return this.request('/conversations');
  }

  async createConversation(participantId: string) {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    });
  }

  async getConversationMessages(conversationId: string) {
    return this.request(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, content: string) {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Garages
  async getGarages() {
    return this.request('/admin/garages');
  }

  async createGarage(data: any) {
    return this.request('/admin/garages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGarage(id: string, data: any) {
    return this.request(`/admin/garages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Singleton instance
export const myJantesClient = new MyJantesClient();
