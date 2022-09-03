const Role = require('../models/role');
const {User, Category, Product} = require('../models');

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
  if(!existUser) throw new Error(`El id ${id} no existe`);
}

const existsCategoryById = async (id) => {
  const exist = await Category.findById(id);
  if (!exist) throw new Error(`El id ${id} no existe`);
}

const diferentCategory = async(name) => {
  const repeat = await Category.findOne({name: name.toUpperCase()});
  if(repeat) throw new Error(`El nombre ${name} ya existe`);
}

const existsProductById = async (id) => {
  const exist = await Product.findById(id);
  if (!exist) throw new Error(`El id ${id} no existe`);
}

const diferentProduct = async(name) => {
  const repeat = await Product.findOne({name: name.toUpperCase()});
  if(repeat) throw new Error(`El nombre ${name} ya existe`);
}

const findCategory = async (category) => {
  const axistCategory = await Category.findOne({name: category.toUpperCase()})
  if(!axistCategory) throw new Error(`La Categoría ${category} no existe`);

  req.category = axistCategory;
}

module.exports = {
  diferentCategory,
  diferentProduct,
  emailExist,
  existsCategoryById,
  existsProductById,
  existUserById,
  findCategory,
  isRoleValidate,
}