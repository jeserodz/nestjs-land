export class LoginDTO {
  /**
   * Unique identifier for users. Usually 'email' or 'username'.
   */
  identifier: string;

  /**
   * User password in plain text (not encrypted).
   */
  password: string;
}
