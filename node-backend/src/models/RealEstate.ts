import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface RealEstateAttributes {
  idx: number;
  UserId: string;
  regId: string;
  type: number;
  status: number;
  address: string;
  pdfUrl?: string;
  pdfSummary?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type RealEstatePk = "idx";
export type RealEstateId = RealEstate[RealEstatePk];
export type RealEstateOptionalAttributes = "idx" | "pdfUrl" | "pdfSummary" | "createdAt" | "updatedAt";
export type RealEstateCreationAttributes = Optional<RealEstateAttributes, RealEstateOptionalAttributes>;

export class RealEstate extends Model<RealEstateAttributes, RealEstateCreationAttributes> implements RealEstateAttributes {
  idx!: number;
  UserId!: string;
  regId!: string;
  type!: number;
  status!: number;
  address!: string;
  pdfUrl?: string;
  pdfSummary?: string;
  createdAt!: Date;
  updatedAt?: Date;

  // RealEstate belongsTo User via UserId
  User!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RealEstate {
    return sequelize.define('RealEstate', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    regId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    pdfUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    pdfSummary: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'RealEstate',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
      {
        name: "idx",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
      {
        name: "RealEstate_User_id_fk",
        using: "BTREE",
        fields: [
          { name: "UserId" },
        ]
      },
    ]
  }) as typeof RealEstate;
  }
}
