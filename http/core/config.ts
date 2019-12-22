import { environment } from 'src/environments/environment';


/**
 * @description Class de gestion des config des requêtes
 */
export class HttpRequestConfigs {
  public static serverUrl = environment.apiUrl ? environment.apiUrl : 'https://api.cnss.tg/api/';
  /**
   * @description Session expired storage key
   * @var string
   */
  public static sessionExpiredStorageKey = 'session_expired';
}
