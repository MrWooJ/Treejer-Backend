let fs = require('fs-extra');
let path = require('path');

module.exports = async app => {
  
  let directory = path.resolve(__dirname + '/../../template');
  app.templates = {};

  let filesInDirectory = await fs.readdir(directory);
  
  filesInDirectory.forEach(async file => {
    let fileDirectory = await fs.open(directory + '/' + file, 'r+');
    let data = await fs.readFile(fileDirectory);
    console.log(file.slice(0, -5));

    app.templates[file.slice(0, -5)] = data.toString();

    await fs.close(fileDirectory);
  });

};
