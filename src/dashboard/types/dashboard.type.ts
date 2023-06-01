export class DashboardResponse {
  assets?: {
    assetStatusCount?: {
      IN_POOL: number;
      ASSIGNED: number;
      SCRAP: number;
      DOWN: number;
    };
    assetStatuses?: string[];

    lastTenCreatedAssetsDetails?: {
      _id: string;
      serialNo: string;
      hostName: string;
      type: string;
      createdAt: Date;
    }[];
    assetsCountWithUpcommingExpireingInDays?: {
      WARRANTY: number;
      AMC: number;
    };
    registeredAssets?: number;
    branchWiseOverallAssets?: {
      _id: string;
      count: number;
      branchCode: string;
      name: string;
    }[];

    branchWiseAssetAllocationAssets?: {
      _id: string;
      branchCode: string;
      name: string;

      IN_POOL: number;
      ASSIGNED: number;
      SCRAP: number;
      DOWN: number;
    }[];
  };

  ticket?: {
    ticketStatusCount?: any;
  };

  itUserSpecificDetails?: {
    assignedTickets?: number;
    todaysCompletedTickets?: number;
    ongoingTickets?: number;
  };

  users?: {
    totalUsers?: number;
    thisWeekNewJoinees?: any[];
    branchWiseUsers?: any[];
  };

  uam?: {
    totalUAM?: number;
    branchWiseUAM?: {
      _id: string;
      branchCode: string;
      name: string;

      Created: 0;
      UAMNumberCreated: number;
      ApprovedByLineManager: number;
      AssignedToITAfterApprovalOfLineManager: number;
      Closed: number;
      Rejected: number;
    }[];
  };
}
