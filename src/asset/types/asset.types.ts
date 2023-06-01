import {
  AssetCategories,
  AssetTypes,
  FieldDataType,
  FieldType,
  AssetLocation,
} from 'src/common/Enums';

export const CommonAssetFields = [
  {
    label: 'Asset Code',
    fieldName: 'assetCode',
    type: FieldType.TEXT,
    dataType: FieldDataType.STRING,
    required: true,
  },
  {
    label: 'Name',
    fieldName: 'name',
    type: FieldType.TEXT,
    dataType: FieldDataType.STRING,
    required: true,
  },
  {
    label: 'Type',
    fieldName: 'type',
    type: FieldType.DROPDOWN,
    dataType: FieldDataType.STRING,
    values: AssetTypes,
    isFilterable: true,
    required: true,
  },
  {
    label: 'Location',
    fieldName: 'location',
    type: FieldType.DROPDOWN,
    dataType: FieldDataType.STRING,
    values: AssetLocation,
    isFilterable: true,
    required: true,
  },
  {
    label: 'Category',
    fieldName: 'category',
    type: FieldType.DROPDOWN,
    dataType: FieldDataType.STRING,
    values: AssetCategories,
    required: true,
  },
  {
    label: 'Serial No.',
    fieldName: 'sr_no',
    type: FieldType.TEXT,
    dataType: FieldDataType.STRING,
    required: true,
  },
  {
    label: 'Purchase Date',
    fieldName: 'purchaseDate',
    type: FieldType.DATE,
    dataType: FieldDataType.STRING,
    required: true,
  },
];
