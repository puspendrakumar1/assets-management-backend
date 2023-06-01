export const VMSPopulateFields = [
  {
    path: 'createdBy',
    select: {
      _id: 1,
      firstName: 1,
      lastName: 1,
    },
  },
  {
    path: 'host',
    select: {
      _id: 1,
      firstName: 1,
      lastName: 1,
    },
  },
  {
    path: 'checkInCreatedBy',
    select: {
      _id: 1,
      firstName: 1,
      lastName: 1,
    },
  },
  {
    path: 'checkOutCreatedBy',
    select: {
      _id: 1,
      firstName: 1,
      lastName: 1,
    },
  },
];
