const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const allowedCollections = [
  'categorys',
  'products',
  'roles',
  'users',
];

const searchUser = async (termn = '', res = response) => {

  const isMongoId = ObjectId.isValid(termn); //* si es un id regresa true *//

  if(isMongoId) {
    const userSearch = await User.findById(termn);
    return res.status(200).json({
      results: userSearch ? [userSearch] : []
    });
  }

  const regex = new RegExp( termn, 'i' );

  const users = await User.find({
    $or: [{name: regex}, {email: regex}],
    $and: [{state: true}]
  });
  res.status(200).json({
    results: users
  });

}

const searchCategory = async (termn = '', res = response) => {

  const isMongoId = ObjectId.isValid(termn); //* si es un id regresa true *//

  if(isMongoId) {
    const category = await Category.findById(termn);
    return res.status(200).json({
      results: category ? [category] : []
    });
  }

  const regex = new RegExp( termn, 'i' );

  const category = await Category.find({
    name: regex,
    $and: [{state: true}]
  });
  res.status(200).json({
    results: category
  });

}

const searchProduct = async (termn = '', res = response) => {

  const isMongoId = ObjectId.isValid(termn); //* si es un id regresa true *//

  if(isMongoId) {
    const productS = await Product.findById(termn).populate('category', 'name');
    return res.status(200).json({
      results: productS ? [productS] : []
    });
  }

  const regex = new RegExp( termn, 'i' );

  const productA = await Product.find({
    name: regex,
    $and: [{state: true}]
  }).populate('category', 'name');
  res.status(200).json({
    results: productA
  });

}


const search = (req, res = response) => {

  const { collection, searchTerm } = req.params;

  if(!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${allowedCollections}`
    })
  }

  switch(collection) {
    case 'users':
      searchUser(searchTerm, res);
    break;
    case 'categorys':
      searchCategory(searchTerm, res)
    break;
    case 'products':
      searchProduct(searchTerm, res)
    break;
    case 'roles':

    break;
    default:
      res.status(500).json({
        msg: 'No hay mas busquedas'
      })
  }
}

module.exports = {
  search
}