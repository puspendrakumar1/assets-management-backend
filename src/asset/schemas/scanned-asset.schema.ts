import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

const memLayout = {
  size: { type: Number, required: false },
  bank: { type: String, required: false },
  type: { type: String, required: false },
  ecc: { type: Boolean, required: false },
  clockSpeed: { type: Number, required: false },
  formFactor: { type: String, required: false },
  manufacturer: { type: String, required: false },
  partNum: { type: String, required: false },
  serialNum: { type: String, required: false },
  voltageConfigured: { type: Number, required: false },
  voltageMin: { type: Number, required: false },
  voltageMax: { type: Number, required: false },
};

export type ScannedAssetDocument = ScannedAsset & Document;

@Schema({
  timestamps: true,
})
export class ScannedAsset {
  @Prop(
    raw({
      manufacturer: { type: String, required: false },
      model: { type: String, required: false },
      version: { type: String, required: false },
      serial: { type: String, required: false },
      uuid: { type: String, required: false },
      sku: { type: String, required: false },
      virtual: { type: Boolean, required: false },
    }),
  )
  system: any;

  @Prop(
    raw({
      platform: { type: String, required: false },
      distro: { type: String, required: false },
      release: { type: String, required: false },
      codename: { type: String, required: false },
      kernel: { type: String, required: false },
      arch: { type: String, required: false },
      hostname: { type: String, required: false },
      fqdn: { type: String, required: false },
      codepage: { type: String, required: false },
      logofile: { type: String, required: false },
      serial: { type: String, required: false },
      build: { type: String, required: false },
      servicepack: { type: String, required: false },
      uefi: { type: Boolean, required: false },
    }),
  )
  os: any;

  @Prop(
    raw({
      total: { type: Number, required: false },
      free: { type: Number, required: false },
      used: { type: Number, required: false },
      active: { type: Number, required: false },
      available: { type: Number, required: false },
      buffers: { type: Number, required: false },
      cached: { type: Number, required: false },
      slab: { type: Number, required: false },
      buffcache: { type: Number, required: false },
      swaptotal: { type: Number, required: false },
      swapused: { type: Number, required: false },
      swapfree: { type: Number, required: false },
    }),
  )
  mem: any;

  @Prop(
    raw({
      type: [memLayout],
      nullable: true,
    }),
  )
  memLayout: any;

  @Prop(
    raw({
      hasBattery: { type: Boolean, required: false },
      cycleCount: { type: Number, required: false },
      isCharging: { type: Boolean, required: false },
      designedCapacity: { type: Number, required: false },
      maxCapacity: { type: Number, required: false },
      currentCapacity: { type: Number, required: false },
      voltage: { type: Number, required: false },
      capacityUnit: { type: String, required: false },
      percent: { type: Number, required: false },
      timeRemaining: { type: Number, required: false },
      acConnected: { type: Number, required: false },
      type: { type: String, required: false },
      model: { type: String, required: false },
      manufacturer: { type: String, required: false },
      serial: { type: String, required: false },
    }),
  )
  battery: any;

  @Prop(
    raw({
      manufacturer: { type: String, required: false },
      model: { type: String, required: false },
      version: { type: String, required: false },
      serial: { type: String, required: false },
      assetTag: { type: String, required: false },
      memMax: { type: String, required: false },
      memSlots: { type: Number, required: false },
    }),
  )
  baseboard: any;

  @Prop(
    raw({
      manufacturer: { type: String, required: false },
      brand: { type: String, required: false },
      cores: { type: Number, required: false },
      physicalCores: { type: Number, required: false },
      processors: { type: Number, required: false },
    }),
  )
  cpu: any;

  @Prop({
    nullable: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    autopopulate: false,
  })
  user: string | UserDocument;
}

export const ScannedAssetSchema = SchemaFactory.createForClass(ScannedAsset);
