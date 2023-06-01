import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BranchDocument } from 'src/branch/schemas/branch.schema';
import { ClientDocument } from 'src/client/schemas/client.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AssetsAllocationStatus, WarrantyType } from '../../common/Enums';
import { IWarranty } from '../interfaces/warranty.interface';
import { Warranty } from '../types/warranty.types';
import * as AssetSpecificFields from './asset-specific-fields';

export type AssetDocument = Asset & Document;

@Schema({
   timestamps: true,
   toJSON: {
      virtuals: true,
   },
})
export class Asset
{
   // common fields
   @Prop({ nullable: true }) assetCode: string;
   @Prop({ nullable: true }) name: string;
   // type: laptop, printer
   @Prop({ nullable: true }) type: string;
   @Prop({ nullable: true }) location: string;
   // category: hardware, software
   @Prop({ nullable: true }) category: string;
   @Prop({ nullable: true }) subCategory: string;
   @Prop({ nullable: true }) sr_no: string;

   // purchase details
   @Prop({ nullable: true, type: Date }) purchaseDate: Date;
   @Prop({ nullable: true }) vendorId: string;
   @Prop({ nullable: true }) poNumber: string;

   // allocation details
   @Prop({
      default: AssetsAllocationStatus.IN_POOL,
   })
   allocationStatus: string;

   @Prop({
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      // autopopulate: true,
   })
   allocationToUserId: string | UserDocument;

   // parent asset ref if any
   @Prop({
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'Asset',
      // autopopulate: true,
   })
   parentAssetId: string;
   @Prop({
      nullable: true,
   })
   parentAssetUsedIndate: Date;

   // asset type specific fields
   @Prop(raw(AssetSpecificFields.Laptop)) laptop: AssetSpecificFields.ILaptop;

   @Prop(raw(AssetSpecificFields.Printer)) printer: AssetSpecificFields.IPrinter;

   @Prop(raw(AssetSpecificFields.PC)) pc: AssetSpecificFields.IPC;

   @Prop(raw(AssetSpecificFields.Software))
   software: AssetSpecificFields.ISoftware;

   @Prop(raw(AssetSpecificFields.Monitor)) monitor: AssetSpecificFields.IMonitor;

   @Prop(raw(AssetSpecificFields.Projector))
   projector: AssetSpecificFields.IProjector;

   @Prop(raw(AssetSpecificFields.Furniture))
   furniture: AssetSpecificFields.IFurniture;

   @Prop(raw(AssetSpecificFields.Server)) server: AssetSpecificFields.IServer;

   @Prop(raw(AssetSpecificFields.Switches))
   switches: AssetSpecificFields.ISwitches;

   @Prop(raw(AssetSpecificFields.Firewall))
   firewall: AssetSpecificFields.IFirewall;

   @Prop(raw(AssetSpecificFields.Router)) router: AssetSpecificFields.IRouter;

   @Prop(raw(AssetSpecificFields.AP)) ap: AssetSpecificFields.IAP;

   @Prop(raw(AssetSpecificFields.SmartTV))
   smart_tv: AssetSpecificFields.ISmartTV;

   @Prop(raw(AssetSpecificFields.VCDevice))
   vc_device: AssetSpecificFields.IVCDevice;

   @Prop(raw(AssetSpecificFields.Mouse)) mouse: AssetSpecificFields.IMouse;

   @Prop(raw(AssetSpecificFields.Keyboard))
   keyboard: AssetSpecificFields.IKeyboard;

   @Prop(raw(AssetSpecificFields.Mobile)) mobile: AssetSpecificFields.IMobile;

   @Prop(raw(AssetSpecificFields.Dongle)) dongle: AssetSpecificFields.IDongle;

   @Prop(raw(AssetSpecificFields.Headphone))
   headphone: AssetSpecificFields.IHeadphone;

   @Prop(raw(AssetSpecificFields.LaptopBag))
   laptop_bag: AssetSpecificFields.ILaptopBag;

   @Prop(raw(AssetSpecificFields.Battery)) battery: AssetSpecificFields.IBattery;

   @Prop(raw(AssetSpecificFields.UPS)) ups: AssetSpecificFields.IUPS;

   @Prop(raw(AssetSpecificFields.OnlineUPS))
   online_ups: AssetSpecificFields.IOnlineUPS;

   @Prop({
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
      // autopopulate: true,
   })
   addedByUser: string | UserDocument;

   @Prop({
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'Client',
      // autopopulate: true,
   })
   client: string | ClientDocument;

   @Prop({
      nullable: true,
      type: MongooseSchema.Types.ObjectId,
      ref: 'Branch',
      // autopopulate: false,
   })
   branch: string | BranchDocument;

   @Prop({
      type: [Warranty],
      nullable: true,
   })
   warranty: IWarranty[];

   @Prop({
      type: Object,
   })
   timeline: any;

   // Virtual
   warrantyInfo: any;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);

AssetSchema.virtual('warrantyInfo').get(function (this: AssetDocument)
{
   const ongoingAMC: IWarranty = this.warranty.find(
      (warranty) =>
         warranty.type === WarrantyType.AMC &&
         moment(warranty.endAt).isBetween(moment(), moment().add(30, 'days')),
   );
   const ongoingWarranty: IWarranty = this.warranty.find(
      (warranty) =>
         warranty.type === WarrantyType.WARRANTY &&
         moment(warranty.endAt).isBetween(moment(), moment().add(30, 'days')),
   );
   return {
      ongoingWarrantyExpiringInThirtyDays: ongoingWarranty ? true : false,
      ongoingAMCExpiringInThirtyDays: ongoingAMC ? true : false,
      ongoingWarranty: ongoingWarranty || null,
      ongoingAMC: ongoingAMC || null,
   };
});
