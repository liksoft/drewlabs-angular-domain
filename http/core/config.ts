
/**
 * @description Class de gestion des config des requêtes
 */
export class HttpRequestConfigs {
  /**
   * @description Session expired storage key
   * @var string
   */
  public static sessionExpiredStorageKey = 'X_SESSION_EXPIRED';
}

/**
 * @description Attribute name holding the login response object
 */
export const LOGIN_RESPONSE_ATTRIBUTE = 'login_response';

/**
 * @description Attribute name holding the boolean authentication response in the login response
 */
export const AUTHENTICATED_ATTRIBUTE = 'authenticated';

/**
 * @description Attribute name holding server response data object
 */
export const RESPONSE_DATA_ATTRIBUTE = 'data';

/**
 * @description Attribute name of the oauth token generated on user login
 */
export const OAUTH_TOKEN_ATTRIBUTE = 'token';
