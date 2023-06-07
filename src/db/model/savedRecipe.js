const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connections.js");

class SavedRecipe extends Model {}
SavedRecipe.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		servings: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ingredients: {
			type: DataTypes.TEXT,
			allowNull: false,
			get: function () {
				return JSON.parse(this.getDataValue("ingredients"));
			},
			set: function (value) {
				return this.setDataValue("ingredients", JSON.stringify(value));
			},
		},
		instructions: {
			type: DataTypes.TEXT,
			allowNull: false,
			get: function () {
				return JSON.parse(this.getDataValue("instructions"));
			},
			set: function (value) {
				return this.setDataValue("instructions", JSON.stringify(value));
			},
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
		},
  },
	{
		sequelize,
		modelName: "SavedRecipe",
		hooks: {
			beforeCreate: (recipe) => {
				recipe.ingredients = JSON.stringify(recipe.ingredients);
				recipe.instructions = JSON.stringify(recipe.instructions);
			},
			beforeUpdate: (recipe) => {
				recipe.ingredients = JSON.stringify(recipe.ingredients);
				recipe.instructions = JSON.stringify(recipe.instructions);
				// if (Array.isArray(recipe.ingredients)) {
				// 	recipe.ingredients = JSON.stringify(recipe.ingredients);
				// }
				// if (Array.isArray(recipe.instructions)) {
				// 	recipe.instructions = JSON.stringify(recipe.instructions);
				// }
			},
			afterFind: (recipe) => {
				if (typeof recipe.ingredients === "string") {
					const parsedIngredients = JSON.parse(recipe.ingredients);
					recipe.ingredients = parsedIngredients.map((ingredient) =>
						JSON.parse(ingredient)
					);
				}
				if (typeof recipe.instructions === "string") {
					recipe.instructions = JSON.parse(recipe.instructions);
				}
			},
		},
	}
);

module.exports = SavedRecipe;
