import { FieldDataType, FieldType } from '../Enums';

export const stringTypeGenerator = (label: string, fieldName: string) => {
  return {
    label,
    fieldName,
    type: FieldType.TEXT,
    dataType: FieldDataType.STRING,
  };
};
export const toggleTypeGenerator = (label: string, fieldName: string) => {
  return {
    label,
    fieldName,
    type: FieldType.TOGGLE,
    dataType: FieldDataType.BOOLEAN,
  };
};
export const dropDownTypeGenerator = (
  label: string,
  fieldName: string,
  values: any,
) => {
  return {
    label,
    fieldName,
    type: FieldType.DROPDOWN,
    dataType: FieldDataType.STRING,
    values,
  };
};
