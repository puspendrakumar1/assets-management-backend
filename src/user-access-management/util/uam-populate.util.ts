const commonUserPopulation = {
  _id: 1,
  firstName: 1,
  lastName: 1,
  email: 1,
};

export const UAMPopulateFields = [
  {
    path: 'createdBy',
    select: commonUserPopulation,
  },
  {
    path: 'transaction.user',
    select: commonUserPopulation,
  },
  {
    path: 'windows.userInformation.users.department',
  },
  {
    path: 'windows.userInformation.reportingManager',
    select: commonUserPopulation,
  },
  {
    path: 'windows.userSystemDataAndEmailIdTreatment.dataHandOverTo',
    select: commonUserPopulation,
  },
  {
    path: 'windows.uamApprovals.requestedBy.user',
    select: commonUserPopulation,
  },
  {
    path: 'windows.uamApprovals.headOfDepartmentDesignee.user',
    select: commonUserPopulation,
  },
  {
    path: 'windows.uamApprovals.itHeadDesignee.user',
    select: commonUserPopulation,
  },
  {
    path: 'windows.uamApprovals.dpoDesignee.user',
    select: commonUserPopulation,
  },

  {
    path: 'windows.forITDepartmentUseOnly.executedBy.user',
    select: commonUserPopulation,
  },
];
