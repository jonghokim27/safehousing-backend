import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface CorporateAttributes {
  idx: number;
  UserId: string;
  regId: string;
  type: number;
  status: number;
  name: string;
  pdfUrl?: string;
  pdfSummary?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type CorporatePk = "idx";
export type CorporateId = Corporate[CorporatePk];
export type CorporateOptionalAttributes = "idx" | "pdfUrl" | "pdfSummary" | "createdAt" | "updatedAt";
export type CorporateCreationAttributes = Optional<CorporateAttributes, CorporateOptionalAttributes>;

export class Corporate extends Model<CorporateAttributes, CorporateCreationAttributes> implements CorporateAttributes {
  idx!: number;
  UserId!: string;
  regId!: string;
  type!: number;
  status!: number;
  name!: string;
  pdfUrl?: string;
  pdfSummary?: string;
  createdAt!: Date;
  updatedAt?: Date;

  // Corporate belongsTo User via UserId
  User!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Corporate {
    return sequelize.define('Corporate', {
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
      type: DataTypes.STRING(100),
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
    name: {
      type: DataTypes.STRING(200),
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
    tableName: 'Corporate',
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
        name: "Corporate_User_id_fk",
        using: "BTREE",
        fields: [
          { name: "UserId" },
        ]
      },
    ]
  }) as typeof Corporate;
  }
}
