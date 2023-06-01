import { FieldDataType, FieldType } from 'src/common/Enums';

const RegisterUserFields = [
  {
    label: 'Firstname',
    fieldName: 'firstName',
    type: FieldType.TEXT,
    dataType: FieldDataType.STRING,
  },
  {
    label: 'Lastname',
    fieldName: 'lastName',
    type: FieldType.TEXT,
    dataType: FieldDataType.STRING,
  },
  {
    label: 'Email',
    fieldName: 'email',
    type: FieldType.EMAIL,
    dataType: FieldDataType.STRING,
  },
];

export { RegisterUserFields };
