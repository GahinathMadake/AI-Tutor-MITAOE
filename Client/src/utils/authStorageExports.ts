/* eslint-disable @typescript-eslint/no-unused-vars */
export const clearAuthStorage = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export const getStoredAuthData = () => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  
  if (token && userStr) {
    try {
      return {
        token,
        user: JSON.parse(userStr)
      };
    } catch (error) {
      clearAuthStorage();
      return null;
    }
  }
  
  return null;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};