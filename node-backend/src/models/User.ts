import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { RealEstate, RealEstateId } from './RealEstate';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "createdAt" | "updatedAt";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;
  updatedAt?: Date;

  // User hasMany RealEstate via UserId
  RealEstates!: RealEstate[];
  getRealEstates!: Sequelize.HasManyGetAssociationsMixin<RealEstate>;
  setRealEstates!: Sequelize.HasManySetAssociationsMixin<RealEstate, RealEstateId>;
  addRealEstate!: Sequelize.HasManyAddAssociationMixin<RealEstate, RealEstateId>;
  addRealEstates!: Sequelize.HasManyAddAssociationsMixin<RealEstate, RealEstateId>;
  createRealEstate!: Sequelize.HasManyCreateAssociationMixin<RealEstate>;
  removeRealEstate!: Sequelize.HasManyRemoveAssociationMixin<RealEstate, RealEstateId>;
  removeRealEstates!: Sequelize.HasManyRemoveAssociationsMixin<RealEstate, RealEstateId>;
  hasRealEstate!: Sequelize.HasManyHasAssociationMixin<RealEstate, RealEstateId>;
  hasRealEstates!: Sequelize.HasManyHasAssociationsMixin<RealEstate, RealEstateId>;
  countRealEstates!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return sequelize.define('User', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
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
    tableName: 'User',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof User;
  }
}
