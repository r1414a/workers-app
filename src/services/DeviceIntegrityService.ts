import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";

export class DeviceIntegrityService {
  static async isGpsEnabled(): Promise<boolean> {
    return Location.hasServicesEnabledAsync();
  }

  static isMockedLocation(location: Location.LocationObject): boolean {
    return Boolean(location.mocked);
  }

  static async isVpnActive(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.type === "vpn";
  }

  static async getIntegrityFlags(location: Location.LocationObject) {
    const [gps, isVpn] = await Promise.all([
      this.isGpsEnabled(),
      this.isVpnActive(),
    ]);

    return {
      gps,
      isMocked: this.isMockedLocation(location),
      isVpn,
    };
  }
}
