export interface IOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface IOAuthDataResponse {
  birthday: string;
  client_id: string;
  default_avatar_id: string;
  default_email: string;
  default_phone: { id: number; number: string };
  display_name: string;
  emails: string[];
  first_name: string;
  id: string;
  is_avatar_empty: boolean;
  last_name: string;
  login: string;
  openid_identities: string[];
  psuid: string;
  real_name: string;
  sex: string;
}
