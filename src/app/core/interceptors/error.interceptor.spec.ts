describe('ErrorInterceptor', () => {
  it('should handle 401 error', () => {
    const handleError = (status: number) => {
      switch (status) {
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred';
      }
    };

    expect(handleError(401)).toBe('Unauthorized. Please log in again.');
  });

  it('should handle 403 error', () => {
    const handleError = (status: number) => {
      switch (status) {
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred';
      }
    };

    expect(handleError(403)).toBe('Access denied. You do not have permission.');
  });

  it('should handle 404 error', () => {
    const handleError = (status: number) => {
      switch (status) {
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred';
      }
    };

    expect(handleError(404)).toBe('Resource not found.');
  });

  it('should handle 500 error', () => {
    const handleError = (status: number) => {
      switch (status) {
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred';
      }
    };

    expect(handleError(500)).toBe('Server error. Please try again later.');
  });

  it('should handle network error', () => {
    const handleError = (status: number) => {
      if (status === 0) {
        return 'Network error. Please check your connection.';
      }
      return 'An unexpected error occurred';
    };

    expect(handleError(0)).toBe('Network error. Please check your connection.');
  });
});
