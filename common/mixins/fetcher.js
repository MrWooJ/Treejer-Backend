const createError = require('http-errors');
const utility = rootRequire('./helper/utility');

module.exports = Model => {

  Model.fetchModel = async id => {
		let model = await Model.findById(id.toString());
		if (!model) {
			throw createError(404);
		}
		return model;
	};

  Model.fetchModel = utility.wrapper(Model.fetchModel);

  Model.fetchModelWithNullOption = async id => {
		let model = await Model.findById(id.toString());
		return model;
	};

  Model.fetchModelWithNullOption =
    utility.wrapper(Model.fetchModelWithNullOption);

  Model.fetchModels = async filter => {
		let models = await Model.find(filter);
		if (models.length === 0) {
			throw createError(404);
		}
		return models;
	};

  Model.fetchModels = utility.wrapper(Model.fetchModels);

	Model.fetchModelsWithNullOption = async filter => {
		let models = await Model.find(filter);
		return models;
	};

  Model.fetchModelsWithNullOption =
	  utility.wrapper(Model.fetchModelsWithNullOption);

};
