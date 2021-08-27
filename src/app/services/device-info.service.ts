import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';


@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {
  private outdatedIOSDevice: boolean;

  get isOutdatedIOS() {
    return this.outdatedIOSDevice;
  }

  constructor() {}

  async init(): Promise<void> {
    const info = await Device.getInfo();
    const osVersion = info.osVersion && parseFloat(info.osVersion);
    this.outdatedIOSDevice = info.operatingSystem === 'ios' && osVersion < 13.4;
  }
}