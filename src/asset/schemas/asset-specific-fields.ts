import { StorageType, UpsCategories } from 'src/common/Enums';

const systemType = {
  manufacturer: {
    type: String,
    required: false,
  },
  model: {
    type: String,
    required: false,
  },
  serial: {
    type: String,
    required: false,
  },
};
interface ISystemType {
  manufacturer?: string;
  model?: string;
  serial?: string;
}
const osType = {
  platform: {
    type: String,
    required: false,
  },
  distro: {
    type: String,
    required: false,
  },
  release: {
    type: String,
    required: false,
  },
  codename: {
    type: String,
    required: false,
  },
  arch: {
    type: String,
    required: false,
  },
  hostname: {
    type: String,
    required: false,
  },
  fqdn: {
    type: String,
    required: false,
  },
};
interface IOSType {
  platform?: string;
  distro?: string;
  release?: string;
  codename?: string;
  arch?: string;
  hostname?: string;
  fqdn?: string;
}
const memType = {
  total: {
    type: Number,
    required: false,
  },
};
interface IMemType {
  total?: number;
}
const memLayoutType = {
  size: {
    type: Number,
    required: false,
  },
  bank: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  ecc: {
    type: Boolean,
    required: false,
  },
  clockSpeed: {
    type: Number,
    required: false,
  },
  manufacturer: {
    type: String,
    required: false,
  },
};
interface IMemLayoutType {
  size: number;
  bank: string;
  type: string;
  ecc: boolean;
  clockSpeed: number;
  manufacturer: string;
}
const diskLayoutType = {
  device: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  size: {
    type: Number,
    required: false,
  },
  interfaceType: {
    type: String,
    required: false,
  },
  smartStatus: {
    type: String,
    required: false,
  },
};
interface IDiskLayoutType {
  device?: string;
  type?: string;
  name?: string;
  vendor?: string;
  size?: number;
  interfaceType?: string;
  smartStatus?: string;
}
const batteryType = {
  hasBattery: {
    type: Boolean,
    required: false,
  },
  maxCapacity: {
    type: Number,
    required: false,
  },
  capacityUnit: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  manufacturer: {
    type: String,
    required: false,
  },
};
interface IBatteryType {
  hasBattery?: boolean;
  maxCapacity?: number;
  capacityUnit?: string;
  type?: string;
  manufacturer?: string;
}
const baseboardType = {
  manufacturer: {
    type: String,
    required: false,
  },
  model: {
    type: String,
    required: false,
  },
  serial: {
    type: String,
    required: false,
  },
  memSlots: {
    type: Number,
    required: false,
  },
};
interface IBashboardType {
  manufacturer?: string;
  model?: string;
  serial?: string;
  memSlots?: number;
}
const cpuType = {
  manufacturer: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  cores: {
    type: Number,
    required: false,
  },
  physicalCores: {
    type: Number,
    required: false,
  },
  processors: {
    type: Number,
    required: false,
  },
};
interface ICPUType {
  manufacturer?: string;
  brand?: string;
  cores?: number;
  physicalCores?: number;
  processors?: number;
}

export const Laptop = {
  // hostName: { type: String, required: false },
  // operatingSystem: { type: String },
  // ram: { type: String },
  // processor: { type: String },
  // storageType: { type: String, enum: StorageType }, // HDD, SSD,
  // storageSize: { type: String },

  system: systemType,
  os: osType,
  mem: memType,
  memLayout: { type: [memLayoutType] },
  diskLayout: { type: [diskLayoutType] },
  battery: batteryType,
  baseboard: baseboardType,
  cpu: cpuType,
};
export interface ILaptop {
  // hostName: string;
  // operatingSystem: string;
  // ram: string;
  // processor: string;
  // storageType: StorageType; // HDD, SSD
  // storageSize: string;

  system: ISystemType;
  os: IOSType;
  mem: IMemType;
  memLayout: IMemLayoutType[];
  diskLayout: IDiskLayoutType[];
  battery: IBatteryType;
  baseboard: IBashboardType;
  cpu: ICPUType;
}

export const Printer = {
  model: { type: String },
  color: { type: Boolean },
};
export interface IPrinter {
  model: string;
  color: string;
}

export const PC = {
  ...Laptop,
};
export interface IPC extends ILaptop {}

export const Software = {
  name: { type: String },
  key: { type: String },
  version: { type: String },
};
export interface ISoftware {
  name: string;
  key: string;
  version: string;
}

export const Monitor = {
  brand: String,
  sr_no: String,
  resolution: String,
};
export interface IMonitor {
  brand: string;
  sr_no: string;
  resolution: string;
}

export const Projector = {
  brand: String,
  sr_no: String,
};
export interface IProjector {
  brand: string;
  sr_no: string;
}

export const Server = { ...Laptop };
export interface IServer extends ILaptop {}

export const Switches = {
  brand: String,
};
export interface ISwitches {
  brand: string;
}

export const Firewall = {
  brand: String,
};
export interface IFirewall {
  brand: string;
}

export const Router = {
  brand: String,
};
export interface IRouter {
  brand: string;
}

export const AP = {
  brand: String,
};
export interface IAP {
  brand: string;
}

export const SmartTV = {
  brand: String,
  resolution: String,
};
export interface ISmartTV {
  brand: string;
  resolution: string;
}

export const VCDevice = {
  brand: String,
};
export interface IVCDevice {
  brand: string;
}

export const Mouse = {
  brand: String,
};
export interface IMouse {
  brand: string;
}

export const Keyboard = { brand: String };
export interface IKeyboard {
  brand: string;
}

export const Headphone = { brand: String };
export interface IHeadphone {
  brand: string;
}

export const Battery = { brand: String, sr_no: String, life: String };
export interface IBattery {
  brand: string;
  sr_no: string;
  life: string;
}

export const Furniture = {
  type: String,
};
export interface IFurniture {
  type: String;
}

export const Mobile = {
  brand: String,
  ram: String,
  rom: String,
  os: String,
};
export interface IMobile {
  brand: string;
  ram: string;
  rom: string;
  os: string;
}

export const UPS = {
  brand: String,
  make: String,
  kw: String,
  productCode: String,
  category: { type: String, enum: UpsCategories },
};
export interface IUPS {
  brand: string;
  make: string;
  kw: string;
  productCode: string;
  category: UpsCategories;
}

export const OnlineUPS = {
  brand: String,
  make: String,
  kw: String,
};
export interface IOnlineUPS {
  brand: string;
  make: string;
  kw: string;
}

export const Dongle = { brand: String };
export interface IDongle {
  brand: string;
}

export const LaptopBag = { brand: String };
export interface ILaptopBag {
  brand: string;
}
