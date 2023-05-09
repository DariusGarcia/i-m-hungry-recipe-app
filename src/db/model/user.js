const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connections");
const bcrypt = require("bcrypt");

class User extends Model {
	checkPassword(loginPassword) {
		return bcrypt.compareSync(loginPassword, this.password);
	}
}

User.init(
	{
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
      validate: {
        notNull: {
          msg: "Please enter a username",
        },
        notEmpty: {
          msg: "Please enter a username",
        },
      },
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
        msg: "Email already in use!",
      },
			validate: {
        notNull: {
          msg: "Please enter an email",
        },
        notEmpty: {
          msg: "Please enter an email",
        },
				isEmail: {
          msg: "Please enter a valid email address",
        },
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
        notNull: {
          msg: "Please enter a password",
        },
        notEmpty: {
          msg: "Please enter a password",
        },
				len: {
          args: [8,30],
          msg: "Password must be between 8 and 30 characters",
        },
			},
		},
	},
	{
		hooks: {
			beforeCreate: async (newUser) => {
				newUser.password = await bcrypt.hash(newUser.password, 10);
				return newUser;
			},
			beforeUpdate: async (updateUser) => {
				if (updateUser.password) {
					updateUser.password = await bcrypt.hash(updateUser.password, 10);
				}
				return updateUser;
			},
		},
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: "hungry_user",
	}
);

module.exports = User;
