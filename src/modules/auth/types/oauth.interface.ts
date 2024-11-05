export interface IOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface IOAuthDataResponse {
  id: string;
  login: string;
  client_id: string;
  openid_identities: string[];
  display_name: string;
  real_name: string;
  first_name: string;
  last_name: string;
  sex: string;
  default_email: string;
  emails: string[];
  birthday: string;
  default_avatar_id: string;
  is_avatar_empty: boolean;
  default_phone: { id: number; number: string };
  psuid: string;
}
