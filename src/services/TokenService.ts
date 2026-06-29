import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";

export class TokenService {
  static async save(token: string) {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  }

  static async load(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  }

  static async clear() {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  }
}
