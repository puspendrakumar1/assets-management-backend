export enum UserRole {
  LEVEL1 = 'level1',
  LEVEL2 = 'level2',
  LEVEL3 = 'level3',
}
export enum UserPermissions {
  UAMNoCreate = 'UAMNoCreate',
  UAMCreate = 'UAMCreate',
  UAMView = 'UAMView',
  UAMUpdate = 'UAMUpdate',
  UAMDelete = 'UAMDelete',

  TicketCreate = 'TicketCreate',
  TicketView = 'TicketView',
  TicketUpdate = 'TicketUpdate',
  TicketDelete = 'TicketDelete',

  DepartmentCreate = 'DepartmentCreate',
  DepartmentView = 'DepartmentView',
  DepartmentUpdate = 'DepartmentUpdate',
  DepartmentDelete = 'DepartmentDelete',

  BranchCreate = 'BranchCreate',
  BranchView = 'BranchView',
  BranchUpdate = 'BranchUpdate',
  BranchDelete = 'BranchDelete',

  AssetCreate = 'AssetCreate',
  AssetView = 'AssetView',
  AssetUpdate = 'AssetUpdate',
  AssetDelete = 'AssetDelete',

  VendorCreate = 'VendorCreate',
  VendorView = 'VendorView',
  VendorUpdate = 'VendorUpdate',
  VendorDelete = 'VendorDelete',

  UserCreate = 'UserCreate',
  UserView = 'UserView',
  UserUpdate = 'UserUpdate',
  UserDelete = 'UserDelete',
}

export enum AssetsAllocationStatus {
  IN_POOL = 'IN_POOL',
  ASSIGNED = 'ASSIGNED',
  SCRAP = 'SCRAP',
  DOWN = 'DOWN',
}

export enum StorageType {
  HDD = 'HDD',
  SSD = 'SSD',
}

export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TOGGLE = 'toggle',
  ARRAY = 'array',
}
export enum FieldDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
}

export enum ScannedAssetTypes {
  'Laptop' = 'laptop',
  'Server' = 'server',
  'PC' = 'pc',
}

export enum AssetTypes {
  'Laptop' = 'laptop',
  // 'Online UPS' = 'online_ups',
  'UPS' = 'ups',
  'Battery' = 'battery',
  'Laptop Bag' = 'laptop_bag',
  'Headphone' = 'headphone',
  'Dongle' = 'dongle',
  'Mobile' = 'mobile',
  'Keyboard' = 'keyboard',
  'Mouse' = 'mouse',
  'VC Device' = 'vc_device',
  'Smart TV' = 'smart_tv',
  'AP' = 'ap',
  'Router' = 'router',
  'Firewall' = 'firewall',
  'Switches' = 'switches',
  'Server' = 'server',
  'Projector' = 'projector',
  'Monitor' = 'monitor',
  'Software' = 'software',
  'PC' = 'pc',
  'Printer' = 'printer',
}
export enum AssetCategories {
  Hardware = 'hardware',
  Software = 'software',
}

export enum TicketingPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}
export enum TicketingCallStatus {
  Assigned = 'Assigned',
  Closed = 'Closed',
  Hold = 'Hold',
  'In Progress' = 'In Progress',
  Open = 'Open',
  'Vendor Dependency' = 'Vendor Dependency',
}
export enum TicketingCallMedium {
  Chat = 'Chat',
  Phone = 'Phone',
  Email = 'Email',
  WalkIn = 'WalkIn',
}
export enum TicketingNatureOfCall {
  Incident = 'Incident',
  Request = 'Request',
}
export enum TicketingCategories {
  'Hardware Laptop/Desktop' = 'Hardware Laptop/Desktop',
  'Hardware Server' = 'Hardware Server',
  'Software' = 'Software',
  'O365' = 'O365',
  'Printer' = 'Printer',
  'Network' = 'Network',
  'Peripheral' = 'Peripheral',
  'Forms' = 'Forms',
}
export enum TicketingSubCategories {
  'WiFi' = 'WiFi',
  'Mouse' = 'Mouse',
  'Keyboard' = 'Keyboard',
  'Format' = 'Format',
  'New User Creation' = 'New User Creation',
  'Modification' = 'Modification',
  'Deletion' = 'Deletion',
  'IP Phone' = 'IP Phone',
  'Desk Phone' = 'Desk Phone',
  'Lan' = 'Lan',
  'Ram' = 'Ram',
  'HDD' = 'HDD',
  'Motherboard' = 'Motherboard',
  'Driver Installation' = 'Driver Installation',
  'Outlook' = 'Outlook',
  'Citrix' = 'Citrix',
  'Arisg' = 'Arisg',
  'Argus' = 'Argus',
  'Spine' = 'Spine',
  'GVG , Verizon,cisco' = 'GVG , Verizon,cisco',
  'Biomatrices' = 'Biomatrices',
  'WebEx' = 'WebEx',
  'Telecon' = 'Telecon',
  'One Drive' = 'One Drive',
  'Yamer' = 'Yamer',
  'Skype For Business' = 'Skype For Business',
  'SharePoint' = 'SharePoint',
  'Printer Installation' = 'Printer Installation',
  'Office Installation' = 'Office Installation',
  'OS Installation' = 'OS Installation',
  'Mobile Configuration' = 'Mobile Configuration',
  'Printer Jam' = 'Printer Jam',
  'Toner Refilling' = 'Toner Refilling',
  'Others' = 'Others',
  'Share Folder Access' = 'Share Folder Access',
  'Password Reset' = 'Password Reset',
  'TFT Allocation' = 'TFT Allocation',
  'Data Transfer' = 'Data Transfer',
  'Date Card Installation' = 'Date Card Installation',
  'Mail ID Creation' = 'Mail ID Creation',
  'Internet Connectivity' = 'Internet Connectivity',
  'MS Word Problem' = 'MS Word Problem',
  'MS Excel Problem' = 'MS Excel Problem',
  'Door Magnetic Problem' = 'Door Magnetic Problem',
}
export enum AssetLocation {
  AHMEDABAD = 'AHMEDABAD',
  DELHI = 'DELHI',
}

export enum WarrantyType {
  WARRANTY = 'WARRANTY',
  AMC = 'AMC',
}
export enum WarrantySiteType {
  ON_SITE = 'ON_SITE',
  OFF_SITE = 'OFF_SITE',
}

export enum UpsCategories {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum TicketingChatBy {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

export enum AssetAutoComplete {
  operatingSystem = 'operatingSystem',
  processor = 'processor',
  name = 'name',
}

export enum UAMRequestTypeAction {
  Create = 'Create',
  Modify = 'Modify',
  Delete = 'Delete',
  Deactivate = 'Deactivate',
}
export enum UAMTypeOfAccessRequired {
  Permanent = 'permanent',
  Temporary = 'temporary',
}
export enum UAMTypeOfUser {
  ApcerUser = 'ApcerUser',
  ApcerClientEmp = 'ApcerClientEmp',
  Other = 'Other',
}
export enum UAMAccessToShareDrives {
  ReadOnly = 'ReadOnly',
  ReadWrite = 'ReadWrite',
}
export enum UAMGrantRevoke {
  Grant = 'Grant',
  Revoke = 'Revoke',
}
export enum UAMUserSystemData {
  NotRequired = 'NotRequired',
  Archive = 'Archive',
  Handover = 'Handover',
}
export enum UAMAction {
  Created = 'Created',
  UAMNumberCreated = 'UAMNumberCreated',
  AssignedToLineManager = 'AssignedToLineManager',
  ApprovedByLineManager = 'ApprovedByLineManager',
  AssignedToITAfterApprovalOfLineManager = 'AssignedToITAfterApprovalOfLineManager',
  Closed = 'Closed',
  Rejected = 'Rejected',
}
export enum UAMPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
export enum UAMType {
  Windows = 'windows',
  Application = 'application',
}
