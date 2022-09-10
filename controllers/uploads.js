const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require("../helpers/uoload-file");
const { User, Product } = require('../models');



const uploadFiles = async (req, res = response) => {

  try {
    //* Imagenes *//
    const name = await uploadFile(req.files, undefined, 'imgs');
    //* txt, pdf *//
    // const name = await uploadFile(req.files, ['txt', 'pdf'], 'texts');
    res.json({ name })
  } catch (error) {
    res.status(400).json({msg: error})
    // res.status(400).json({msg: 'La extensión jpg no es permitida - txt, pdf'})
  }

}

const updateImage = async (req, res = response) => {

  const {id, collection} = req.params;

  let model;

  switch( collection ) {
    case 'users':
      model = await User.findById(id);
      if(!model) return res.status(400).json({
        msg: `No existe un usuario con el id ${id}`
      });
      break;
    case 'products':
      model = await Product.findById(id);
      if(!model) return res.status(400).json({
        msg: `No existe un producto con el id ${id}`
      });
      break;
    default:
      return res.status(500).json({
        smg: 'Se me olvidó usar esto'
      });
  }

  //* Limpiar imagenes previas *//
  if(model.img) {
    //* hay que borrar la imagen del servidor *//
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage); //* Elimina el archivo *//
    }
  }

  const name = await uploadFile(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json({ model })

}

const updateImageCloudinary = async (req, res = response) => {

  const {id, collection} = req.params;

  let model;

  switch( collection ) {
    case 'users':
      model = await User.findById(id);
      if(!model) return res.status(400).json({
        msg: `No existe un usuario con el id ${id}`
      });
      break;
    case 'products':
      model = await Product.findById(id);
      if(!model) return res.status(400).json({
        msg: `No existe un producto con el id ${id}`
      });
      break;
    default:
      return res.status(500).json({
        smg: 'Se me olvidó usar esto'
      });
  }

  //* Limpiar imagenes previas *//
  if(model.img) {
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  //console.log( req.files.file );

  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json(model);

}

const showImage = async (req, res = response) => {

  const {id, collection} = req.params;

  let model;

  switch( collection ) {
    case 'users':
      model = await User.findById(id);
      if(!model) return res.status(400).json({
        msg: `No existe un usuario con el id ${id}`
      });
      break;
    case 'products':
      model = await Product.findById(id);
      if(!model) return res.status(400).json({
        msg: `No existe un producto con el id ${id}`
      });
      break;
    default:
      return res.status(500).json({
        smg: 'Se me olvidó usar esto'
      });
  }

  //* Limpiar imagenes previas *//
  if(model.img) {
    //* hay que borrar la imagen del servidor *//
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImage)) {
      return res.sendFile(pathImage)
    }
  }

  const pathImage = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImage);

}


module.exports = {
  showImage,
  updateImage,
  updateImageCloudinary,
  uploadFiles,
}