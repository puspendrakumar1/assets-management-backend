import { Injectable } from '@nestjs/common';
import { ActiveDirectoryService } from 'src/active-directory/active-directory.service';
import {
  TicketingCallMedium,
  TicketingCallStatus,
  TicketingCategories,
  TicketingNatureOfCall,
  TicketingPriority,
  TicketingSubCategories,
} from 'src/common/Enums';
import { CommonResponse } from 'src/common/interfaces';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GetTicketFieldsService {
  constructor(private readonly userService: UsersService) {}

  async getTicketFields(): Promise<CommonResponse> {
    const usersForDropDown: any = await this.userService.getUsersForDropDown();

    const ticketFields = [
      {
        fieldName: 'requestFromUserId',
        type: 'dropdown',
        label: 'Requester',
        isFilterable: true,
        values: usersForDropDown,
      },
      {
        fieldName: 'assignedToUserId',
        type: 'dropdown',
        label: 'Assigned To',
        isFilterable: true,
        values: usersForDropDown,
      },

      {
        fieldName: 'callMedium',
        type: 'dropdown',
        label: 'Call Medium',
        isFilterable: true,
        values: TicketingCallMedium,
      },
      {
        fieldName: 'natureOfCall',
        type: 'dropdown',
        label: 'Nature of Call',
        isFilterable: true,
        values: TicketingNatureOfCall,
      },

      {
        fieldName: 'category',
        type: 'dropdown',
        label: 'Category',
        isFilterable: true,
        values: TicketingCategories,
      },
      {
        fieldName: 'subCategory',
        type: 'dropdown',
        label: 'Sub Category',
        isFilterable: true,
        values: TicketingSubCategories,
      },
      {
        fieldName: 'callStatus',
        type: 'dropdown',
        label: 'Call Status',
        isFilterable: true,
        values: TicketingCallStatus,
      },
      {
        fieldName: 'priority',
        type: 'dropdown',
        label: 'Priority',
        isFilterable: true,
        values: TicketingPriority,
      },
      {
        fieldName: 'description',
        type: 'text',
        label: 'Description',
      },
    ];

    return {
      data: {
        allUserBasicDetails: await this.userService.getAllUsersBasicDetails(),
        ticketFields,
      },
    };
  }
}
