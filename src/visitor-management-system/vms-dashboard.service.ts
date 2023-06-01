import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor, VisitorDocument } from './schema/visitor.schema';
import * as moment from 'moment';

export class VisitorManagementSystemDashboardService {
  constructor(
    @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
  ) {}

  async getDashboardData(query: any) {
    const startDate =
      (query.startDate && moment(query.startDate)) || moment().startOf('month');
    const endDate =
      (query.endDate && moment(query.endDate)) || moment().endOf('month');
    const thisMonthVisitors = await this.getThisMonthVisitors();
    const dailyAverage = await this.getDailyAverage(
      startDate.toDate(),
      endDate.toDate(),
    );
    const averageVisitHours = await this.getAverageVisitTime(
      startDate.toDate(),
      endDate.toDate(),
    );

    return {
      data: { thisMonthVisitors, dailyAverage, averageVisitHours },
    };
  }

  async getThisMonthVisitors() {
    return this.visitorModel.count({
      $and: [
        {
          createdAt: { $gte: moment().startOf('month').toDate() },
        },
        {
          createdAt: { $lt: moment().endOf('month').toDate() },
        },
      ],
    });
  }

  async getDailyAverage(startDate: Date, endDate: Date) {
    const rawAverage = await this.visitorModel.aggregate([
      {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: startDate,
              },
            },
            {
              createdAt: {
                $lte: endDate,
              },
            },
          ],
        },
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$count' },
        },
      },
    ]);

    return rawAverage && rawAverage.length ? Math.round(rawAverage[0].avg) : 0;
  }

  async getAverageVisitTime(startDate: Date, endDate: Date) {
    const rawAverage = await this.visitorModel.aggregate([
      {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: startDate,
              },
            },
            {
              createdAt: {
                $lte: endDate,
              },
            },
          ],
        },
      },
      {
        $project: {
          duration: {
            $divide: [
              {
                $subtract: [
                  '$actualVisitToDateTime',
                  '$actualVisitFromDateTime',
                ],
              },
              // Milliseconds of 1 Minute
              1000 * 60,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$duration' },
        },
      },
    ]);

    const averageMinutes =
      rawAverage && rawAverage.length ? Math.round(rawAverage[0].avg) : 0;

    return `${moment
      .utc(moment.duration(averageMinutes, 'minutes').asMilliseconds())
      .format('HH:mm')} Hours`;
  }
}
