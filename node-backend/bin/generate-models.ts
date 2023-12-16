import { SequelizeAuto } from 'sequelize-auto';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DEFAULT_SCHEMA } from "../src/configs";
const auto = new SequelizeAuto(DB_DEFAULT_SCHEMA, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
    directory: "./src/models",
    additional: {
      timestamps: false
    },
    useDefine: true,
    port: DB_PORT,
    singularize: false,
    lang: 'ts',
});

auto.run().then(data => {
  console.log("✅ Model generation complete");
});