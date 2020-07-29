import { parseV1HttpResponse } from './http-response';
import { SERVER_RESPONSE } from './http-response-stub';
import { Log } from '../../../utils/logger';


describe('Drewlabs server response v1 parser', () => {
  it('should have an HttpResponse object with status ok and error message null', () => {
    const response = parseV1HttpResponse(SERVER_RESPONSE);
    expect(response.errorMessage).toBeNull('Expect response.errorMessage to be null');
    expect(response.statusCode).toEqual(200, 'Expect response.statusCode to be 200');
    expect(response.data).toBeTruthy('Expect response.data to not be null');
    expect(response.errors).toBeNull('Expect response.errors to be null');
  });
});
