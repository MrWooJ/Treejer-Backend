module.exports = async server => {
  const vars = server.vars;
  // remove users email validation
  delete server.models.User.validations.email;

  let { Client, Role, RoleMapping } = server.models;
  // list of users data
  let users = [
    {
      username: 'support1',
      status: vars.config.clientStatus.available,
      built: 'script',
      emailVerified: true,
      email: 'support1@treejer.com',
      password: 'Tr33j3r5upp0rt0n3'
    },
    {
      username: 'support2',
      status: vars.config.clientStatus.available,
      built: 'script',
      emailVerified: true,
      email: 'support2@treejer.com',
      password: 'Tr33j3r5upp0rtTw0'
    },
    {
      username: 'support3',
      status: vars.config.clientStatus.available,
      built: 'script',
      emailVerified: true,
      email: 'support3@treejer.com',
      password: 'Tr33j3r5upp0rtThr33'
    }
  ];

  // fetch all script built users
  let fetchedUsers = await Client.find({ where: { built: 'script' } });
  // check if script built users exists or not
  if (fetchedUsers.length === 0) {
    // create users script in case does not exist
    let createdUsers = await Client.create(users);
    // attach role to users one by one
    let role = await Role.create({ name: 'admin' });
    for (let i = 0; i < users.length; i++) {
      await role.principals.create({
        principalType: RoleMapping.USER,
        principalId: createdUsers[i].id
      });
    }
  }
};
