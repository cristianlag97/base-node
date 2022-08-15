const Role = require('../models/role');
const User = require('../models/user');

const isRoleValidate = async (role = '') => {
  const existRole = await Role.findOne({role});
  if(!existRole) throw new Error(`El rol ${role} no está registrado en la base de datos`)
}

const emailExist = async (email = '') => {
  const existEmail = await User.findOne({email});
  if(existEmail) throw new Error(`El correo ${email} ya se encuentra registrado`)
}

const existUserById = async (id) => {
  const existUser = await User.findById(id);
  if(!existUser) throw new Error(`El id ${id} no existe`)
}

module.exports = {
  isRoleValidate,
  emailExist,
  existUserById
}