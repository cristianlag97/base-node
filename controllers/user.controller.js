const { responde: response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const userGet = async (req = request, res = response) => {

  const { limit = 5, since = 0 } = req.query;


  const [total, users] = await Promise.all([
    User.countDocuments({state: true}),
    User.find({ state: true })
      .skip(Number(since))
      .limit(Number(limit))
  ]);

  res.json({
    estadoPeticion: true,
    total,
    showData: users.length,
    users
  });
}

const userDelete = async (req, res = response) => {

  const { id } = req.params;

  //* se elimina fisicamente *//
  // const user = await User.findByIdAndDelete(id);

  //* cambiar estado de usuario *//
  const user = await User.findByIdAndUpdate(id, {state: false});

  res.json({
    estadoPeticion: true,
    user
  });
}

const userPut = async (req, res = response) => {

  const {id} = req.params;

  const {_id, password, google, email, ...resto} = req.body;

  if(password) {
    //* enctriptar contraseña *//
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  const user = await User.findByIdAndUpdate(id, resto);

  res.json({
    estadoPeticion: true,
    user
  });
}

const userPost = async (req, res) => {

  const {name, email, password, role} = req.body;
  const user = new User({name, email, password, role});

  //* verificar si el correo existe *//
  // const existEmail = await User.findOne({email});
  // if(existEmail) return res.status(400).json({
  //   msg: 'El correo ya se encuentra registrado'
  // });

  //* enctriptar contraseña *//
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync( password, salt );

  //* guardar en base de datos *//
  await user.save()

  res.json({
    estadoPeticion: true,
    user
  });
}

const userPatch = (req, res) => {
  res.json({
    estadoPeticion: true,
    msn: 'Post API'
  });
}

module.exports = {
  userGet,
  userDelete,
  userPut,
  userPost,
  userPatch
}