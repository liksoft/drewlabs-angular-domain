import { of } from 'rxjs';

export const unauthenticatedResponse = of({
  success: false,
  body: {
    error_message: null,
    response_data: {
      authenticated: false
    },
    errors: null
  },
  code: 200
});
