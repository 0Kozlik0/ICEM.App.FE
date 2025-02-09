export class AuthService {
  private static getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  public static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = {
      ...options.headers,
      ...this.getAuthHeader(),
    };

    let response;
    try {
        response = await fetch(url, { ...options, headers: headers as HeadersInit });
    } catch (error) {
        // token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
        throw new Error('Authentication required')
    }
    
    if (response.status === 401 || response.status === 403 || response.status === 500) {
        //   Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
        throw new Error('Authentication required');
    }
    
    return response;
  }
} 