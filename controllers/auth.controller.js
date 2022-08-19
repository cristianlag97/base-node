const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');


const login = async (req, res = response) => {

  const {email, password} = req.body;

  try {

    //* verificar si el email existe *//
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({
      msg: 'Usuario / Contraseña no son correctos - correo'
    });

    //* verificar si el usuario está activo *//
    if(!user.state) return res.status(400).json({
      msg: 'Usuario / Contraseña no son correctos - estado: false'
    });

    //* verificar la contraseña *//
    const validatePassword = bcryptjs.compareSync(password, user.password)
    if(!validatePassword)return res.status(400).json({
      msg: 'Usuario / Contraseña no son correctos - contraseña'
    });

    //* generar JWT *//
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    })

  } catch (error) {
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }


}

module.exports = {
  login
}