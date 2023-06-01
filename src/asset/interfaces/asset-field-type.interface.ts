export interface IAssetFieldType {
  label: string;
  type: string;
  fields?: {
    label: string;
    fieldName: string;
    type: string;
    dataType: string;
    values?: string[];
    arrayValues?: IAssetFieldType;
  }[];
}
