export class AuthServerPathConfig {
  public static USER_CRUD_PATH = 'users';
  public static PASSWORD_RESET_PATH = 'auth/password-reset';
  public static LOGIN_PATH =  'auth/login';
  public static LOGOUT_PATH = 'auth/logout';
}

export class AuthPathConfig {
  public static LOGIN_PATH = 'login';
  public static REDIRECT_PATH = 'login';
}

export class AuthStorageConfig {
  public static USER_STORAGE_KEY = 'App_user';
}

export class DefaultAcl {
  public static SUPER_ADMIN_PERMISSION = 'all';
  public static UPDATE_PASSWORD_PERMISSION = 'update-password';
}


/**
 * @description Class de paramètres de configuration des requêtes d'authentification
 */
export class ServerResponseKeys {
  public static AUTHENTICATED_KEY = 'authenticated';
  public static TOKEN = 'token';
  public static RESPONSE_BODY = 'body';
  public static USER_KEY = 'user';
  public static USER_ROLES = 'user_roles';
  public static ROLE_KEY = 'role';
  public static RESPONSE_DATA = 'data';
  public static ROLE_PERMISSION_KEY = 'permission_roles';
  public static PERMISSION_KEY = 'permission';
}
