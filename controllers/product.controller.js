const { response } = require('express');
const { Product, Category } = require('../models');
const { populate } = require('../models/category');

//* getProducts - pagination - total - populate = consultar de mongoos*//
const getProducts = async (req, res = response) => {

  const {limit = 5, since = 0} = req.query;

  const [ total, products ] = await Promise.all([
    Product.countDocuments({state: true}),
    Product.find({state: true})
      .populate('user', 'name')
      .populate('category', 'name')
      .limit(Number(limit))
      .skip(Number(since))
  ])

  res.status(200).json({
    stadoPeticion: true,
    total,
    showData: products.length,
    products
  });

}

//* getProduct - populate = consultar de mongoos*//
const getProduct = async (req, res = response) => {
  const { id } = req.params;

  const findProduct = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.status(200).json({
    estadoPeticion: true,
    id,
    findProduct
  })

}

//* CreateProduct *//
const createProduct = async (req, res = response) => {
  // const {price, category, description} = req.body;
  // const name = req.body.name.toUpperCase();

  const { state, user, ...body} = req.body;

  const newProduct = await Product.findOne({name: body.name});

  // const axistCategory = await Category.findOne({name: category.toUpperCase()})
  // if(!axistCategory) return  res.status(400).json({msg: `La Categoría ${category} no existe`});


  if(newProduct) return res.status(400).json({
    msg: `El producto ${newProduct.name}, ya existe.`
  });

  //* GEnerar la data a guardar *//
  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  }

  const createPr = await Product.create(data);
  createPr.save();

  res.status(201).json(createPr);
}

//* updateProduct *//
const updateProduct = async (req, res = response) => {
  const { id } = req. params;
  const {state, user, ...data} = req.body;

  if(data.name){
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id; //* para actualizar el usuario por el usuario que actualiza el registro *//

  const update = await Product.findByIdAndUpdate(id, data, {new: true});

  res.status(200).json({
    estadoPeticion: true,
    update
  })
}

//* deleteProduct - state = false *//
const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const dlProduct = await Product.findByIdAndUpdate(id, {state: false}).populate('user', 'name');

  res.status(200).json({
    estadoPeticion: true,
    dlProduct
  })
}


module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
}