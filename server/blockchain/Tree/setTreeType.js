const getTreeContract = require('./getTreeContract');

module.exports = async (treeId, typeName, scientificName, price, 
  geolocation, region, drive, age, O2RatePerDay) => {
  const Tree = await getTreeContract();
  const result = await Tree.setTreeType(+treeId, typeName, scientificName, 
    +price, geolocation, region, drive, +age, +O2RatePerDay).send();
  return result;
};
