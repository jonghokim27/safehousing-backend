import type { Sequelize } from "sequelize";
import { Corporate as _Corporate } from "./Corporate";
import type { CorporateAttributes, CorporateCreationAttributes } from "./Corporate";
import { RealEstate as _RealEstate } from "./RealEstate";
import type { RealEstateAttributes, RealEstateCreationAttributes } from "./RealEstate";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";

export {
  _Corporate as Corporate,
  _RealEstate as RealEstate,
  _User as User,
};

export type {
  CorporateAttributes,
  CorporateCreationAttributes,
  RealEstateAttributes,
  RealEstateCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Corporate = _Corporate.initModel(sequelize);
  const RealEstate = _RealEstate.initModel(sequelize);
  const User = _User.initModel(sequelize);

  Corporate.belongsTo(User, { as: "User", foreignKey: "UserId"});
  User.hasMany(Corporate, { as: "Corporates", foreignKey: "UserId"});
  RealEstate.belongsTo(User, { as: "User", foreignKey: "UserId"});
  User.hasMany(RealEstate, { as: "RealEstates", foreignKey: "UserId"});

  return {
    Corporate: Corporate,
    RealEstate: RealEstate,
    User: User,
  };
}
