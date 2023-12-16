import type { Sequelize } from "sequelize";
import { RealEstate as _RealEstate } from "./RealEstate";
import type { RealEstateAttributes, RealEstateCreationAttributes } from "./RealEstate";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";

export {
  _RealEstate as RealEstate,
  _User as User,
};

export type {
  RealEstateAttributes,
  RealEstateCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const RealEstate = _RealEstate.initModel(sequelize);
  const User = _User.initModel(sequelize);

  RealEstate.belongsTo(User, { as: "User", foreignKey: "UserId"});
  User.hasMany(RealEstate, { as: "RealEstates", foreignKey: "UserId"});

  return {
    RealEstate: RealEstate,
    User: User,
  };
}
