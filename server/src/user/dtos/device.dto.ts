export class DeviceDto {
  constructor (device: any) {
    if (!device) {
      return
    }

    this.id = device.id;
    this.is_active = device.is_active;
    this.name = device.name;
    this.type = device.type;
    this.is_restricted = device.is_restricted;
  }

  readonly id: string;
  readonly is_active: boolean;
  readonly name: string;
  readonly type: number;
  readonly is_restricted: boolean;
}
