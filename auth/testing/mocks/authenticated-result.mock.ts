import { of } from 'rxjs';

export const authenticatedResponse = of({
  body: {
    error_message: null,
    response_data: {
      login_response: {
        authenticated: true,
        double_auth_enabled: false,
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDVkZTgwNmY0MmRhMWU1NWRkNGVkZDU1NDI2YWI0YjY0ZTI3N2MyN2I1MTg4YmU1OWZjNTk0YWMwMTNkYjZhMDI3YjFhYjY5ZjJkMDRmYTgiLCJpYXQiOjE1OTM4NjcyMjgsIm5iZiI6MTU5Mzg2NzIyOCwiZXhwIjoxNTkzOTUzNjI3LCJzdWIiOiIyOSIsInNjb3BlcyI6WyIqIl19.B629dUaI9RXFXK_XWokmIVcEbRl0hYLuQmeBm-4FXUmdoy0RLWxoO_L7Dt3PfSXSFGrJUG6u_VKEeLjRUur2ggZATNT0xeEawL1j4qo2wwI1DmOZHX4lK99BTg2YUhOQC9JLhsMiVZWAf3rERKYzMI5oRcTONiRTsJbhB4sh45ZiP7YJYgNQg6sk3cvUmS0C1K5SNsqIL9KqzuhmUHQwei1O9vATflfJu2BXBtCfWUeol2cn94PquwZAIxMFFeL4S95nwAsqxfSXZZ7KHpAn3ryaqJAjbnd7GQWXn1Jb7Osv6kocYe47Hg7IY8Auj_OErOV690tbi2tTMNVALLHLOsTQ8UelblioxhOPUSnQLAavkkarTxJeOldrV6yWzOn14vYOlrTpGTtVCxNZLEbhsnOLOc83Kvhg66Li9LJF1fqw-7UMD5q6pTbTlc1tr1m6AQLRfRz0Itpn_aoIp8XoKx1m_0uKwg5pkaI4knAgcFYwK1iHl0kWxmEFKojRvOWAhCfYjoUAxnoajgc7pR87Yprn8B2NVNmEBNfvDg899mejXbCxwSiDY4NmAky8jTr0kLbdQSXJXU3np7yHJ3Ukt24fFD2T-iKYq0fCWcAHbSJD--YtrBwAZh4Wz1hj2ympnvNVmGH8xivB0qI9WIsLrlwEXeS2yH21JYdZ9ksTEyM'
      },
      user: {
        id: 29,
        username: 'kokousogbbo710',
        is_verified: true,
        is_active: 1,
        double_auth_active: 0,
        remember_token: null,
        roles: [
          'DEFAULT AUTHORIZATION GROUP'
        ],
        authorizations: [
          'list-permissions',
          'list-roles',
          'list-departments',
          'list-forum-types',
          'list-forums',
          'create-forums',
          'update-forums',
          'list-post-types',
          'list-posts',
          'create-posts',
          'update-posts',
          'delete-posts',
          'list-comments',
          'create-comments',
          'update-comments',
          'delete-comments',
        ],
        channels: [],
        user_info: {
          id: 27,
          firstname: 'KOKOU JUAN',
          lastname: 'SOGBO',
          address: null,
          phone_number: null,
          postal_code: null,
          birthdate: null,
          sex: null,
          parent_id: null,
          profile_url: null,
          created_at: '2020-06-25T16:42:01.000000Z',
          updated_at: '2020-06-25T16:42:01.000000Z',
          deleted_at: null,
          company: null,
          division: null,
          workspaces: [
            {
              id: 16,
              label: 'Communication',
              description: 'Tenez vous informer des récentes activités de l\'entreprise pour la promotion de nos produits',
              status: 1,
              banner_url: 'https://lct-intranet.com/communication',
              profil_url: 'https://lct-intranet.com/communication',
              workspace_type_id: 1,
              membership_condition_id: null,
              created_at: '2020-06-26 10:38:25',
              updated_at: '2020-07-04 08:53:00',
              user_group: {
                id: 4,
                label: 'Administrator',
                description: 'WORKSPACE ADMINISTRATOR USER GROUP',
                status: 1,
                created_at: '2020-06-25T15:44:20.000000Z',
                updated_at: '2020-06-25T15:44:20.000000Z',
                _link: 'http://127.0.0.1:8000/api/ressources/workspace-user-groups/4',
                authorizations: [
                  'write',
                  'update',
                  'delete',
                  'all',
                  'read'
                ]
              }
            }
          ],
          emails: [
            'kokousogbbo@example.com'
          ],
          agence: null,
          department_user: null,
          department: null
        }
      }
    },
    errors: null
  },
  code: 200
});
