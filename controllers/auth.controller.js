const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async (req, res = response) => {

  const { id_token } = req.body;

  try {
    // console.log( id_token );

    const {name, picture, email} = await googleVerify(id_token);
    // console.log({name,picture,email});

    //* generar referencia para verificar si el correo ya existe en la DB *//
    let user = await User.findOne({email});

    if(!user) {
      //* CREAR *//
      const data = {
        name,
        email,
        password: ':P',
        img: picture,
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    //* Verificar si está activo el usuario *//
    if(!user.state) return res.status(401).json({
      msg: 'Hable con el administrador, Usuario bloqueado'
    });

    //* generar JWT *//
    const token = await generateJWT(user.id);

    res.json({
      estadoPeticion: true,
      user,
      token
    })
  } catch (error) {
    console.log( error );
    return res.status(400).json({
      estadoPeticion: false,
      msg: 'El token no se pudo verificar'
    })
  }


}

module.exports = {
  login,
  googleSignIn
}