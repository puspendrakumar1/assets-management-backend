import { FieldDataType, FieldType, StorageType } from 'src/common/Enums';
import {
  dropDownTypeGenerator,
  stringTypeGenerator,
  toggleTypeGenerator,
} from 'src/common/utils/asset-types.util';
import { IAssetFieldType } from '../interfaces/asset-field-type.interface';

const BatteryFieldType = {
  label: 'Battery',
  type: 'battery',
  fields: [
    stringTypeGenerator('Brand', 'brand'),
    stringTypeGenerator('Serial No.', 'sr_no'),
    stringTypeGenerator('Life', 'life'),
  ],
};

export const AssetTypeSpecificFieldTypes: IAssetFieldType[] = [
  {
    label: 'Laptop',
    type: 'laptop',
    fields: [
      stringTypeGenerator('Host Name', 'hostName'),
      stringTypeGenerator('Operating System', 'operatingSystem'),
      stringTypeGenerator('RAM', 'ram'),
      stringTypeGenerator('Processor', 'processor'),
      dropDownTypeGenerator('Storage Type', 'storageType', StorageType),
      stringTypeGenerator('Storage Size', 'storageSize'),
    ],
  },
  {
    label: 'Printer',
    type: 'printer',
    fields: [
      stringTypeGenerator('Model', 'model'),
      toggleTypeGenerator('Color', 'color'),
    ],
  },
  {
    label: 'PC',
    type: 'pc',
    fields: [
      stringTypeGenerator('Host Name', 'hostName'),
      stringTypeGenerator('Operating System', 'operatingSystem'),
      stringTypeGenerator('RAM', 'ram'),
      stringTypeGenerator('Processor', 'processor'),
      dropDownTypeGenerator('Storage Type', 'storageType', StorageType),
      stringTypeGenerator('Storage Size', 'storageSize'),
    ],
  },
  {
    label: 'Software',
    type: 'software',
    fields: [
      stringTypeGenerator('Name', 'name'),
      stringTypeGenerator('Key', 'key'),
      stringTypeGenerator('Version', 'version'),
    ],
  },
  {
    label: 'Monitor',
    type: 'monitor',
    fields: [
      stringTypeGenerator('Brand', 'brand'),
      stringTypeGenerator('Serial No.', 'sr_no'),
      stringTypeGenerator('Resolution', 'resolution'),
    ],
  },
  {
    label: 'Projector',
    type: 'projector',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Furniture',
    type: 'furniture',
    fields: [stringTypeGenerator('Type', 'type')],
  },
  {
    label: 'Server',
    type: 'server',
    fields: [
      stringTypeGenerator('Host Name', 'hostName'),
      stringTypeGenerator('Operating System', 'operatingSystem'),
      stringTypeGenerator('RAM', 'ram'),
      stringTypeGenerator('Processor', 'processor'),
      dropDownTypeGenerator('Storage Type', 'storageType', StorageType),
      stringTypeGenerator('Storage Size', 'storageSize'),
    ],
  },
  {
    label: 'Switches',
    type: 'switches',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Firewall',
    type: 'firewall',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Router',
    type: 'router',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'AP',
    type: 'ap',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Smart TV',
    type: 'smart_tv',
    fields: [
      stringTypeGenerator('Brand', 'brand'),
      stringTypeGenerator('Resolution', 'resolution'),
    ],
  },
  {
    label: 'VC Device',
    type: 'vc_device',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Mouse',
    type: 'mouse',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Keyboard',
    type: 'keyboard',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Mobile',
    type: 'mobile',
    fields: [
      stringTypeGenerator('Brand', 'brand'),
      stringTypeGenerator('RAM', 'ram'),
      stringTypeGenerator('ROM', 'rom'),
      stringTypeGenerator('OS', 'os'),
    ],
  },
  {
    label: 'Dongle',
    type: 'dongle',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Headphone',
    type: 'headphone',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  {
    label: 'Laptop Bag',
    type: 'laptop_bag',
    fields: [stringTypeGenerator('Brand', 'brand')],
  },
  BatteryFieldType,
  // {
  //   label: 'UPS',
  //   type: 'ups',
  //   fields: [
  //     stringTypeGenerator('Brand', 'brand'),
  //     stringTypeGenerator('Make', 'make'),
  //     stringTypeGenerator('KW', 'kw'),
  //     {
  //       label: 'Batteries',
  //       fieldName: 'battery',
  //       type: FieldType.ARRAY,
  //       dataType: FieldDataType.ARRAY,
  //       arrayValues: BatteryFieldType,
  //     },
  //   ],
  // },
  // {
  //   label: 'OnlineUPS',
  //   type: 'online_ups',
  //   fields: [
  //     stringTypeGenerator('Brand', 'brand'),
  //     stringTypeGenerator('Make', 'make'),
  //     stringTypeGenerator('KW', 'kw'),
  //     {
  //       label: 'Batteries',
  //       fieldName: 'battery',
  //       type: FieldType.ARRAY,
  //       dataType: FieldDataType.ARRAY,
  //       arrayValues: BatteryFieldType,
  //     },
  //   ],
  // },
];
