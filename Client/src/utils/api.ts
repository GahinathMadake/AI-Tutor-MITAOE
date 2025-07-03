export const API_BASE = 'http://localhost:3001/api';

export const getUrlParams = (searchParams: URLSearchParams) => {
  return {
    token: searchParams.get('token'),
    stytch_token_type: searchParams.get('stytch_token_type')
  };
};

// Helper to parse Stytch error messages
export const parseStytchError = (errorString: string): string => {
  try {
    const errorObj = JSON.parse(errorString);
    switch (errorObj.error_type) {
      case 'unable_to_auth_magic_link':
        return 'This magic link has expired or been used already. Please request a new one.';
      case 'magic_link_not_found':
        return 'Invalid magic link. Please check your email for the correct link.';
      case 'user_not_found':
        return 'No account found with this email address.';
      default:
        return errorObj.error_message || 'Authentication failed. Please try again.';
    }
  } catch {
    return 'An error occurred during authentication. Please try again.';
  }
};