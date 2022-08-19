const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res = response, next) => {

  const token = req.header('x-token');

  if(!token) return res.status(401).json({
    msg: 'No hay token en la petición'
  })

  try {

    const {uid} = jwt.verify(token, process.env.SECRET_KEY);

    // req.dataUSer = await User.findById(uid)
    const user = await User.findById(uid);
    if(!user) return res.status(401).json({
      msg: 'Token no valido - usuario no existente'
    })

    //* verificar si el uid tiene estado true *//
    if(!user.state) return res.status(401).json({
      msg: 'Token no valido - usuario con estado false'
    })

    req.dataUSer = user;
    req.uid = uid;//* para poder procesar el uid en los controladores *//

    next();
  } catch (error) {
    console.log( error );
    res.status(401).json({
      msg: 'Token no válido'
    })
  }

}


module.exports = {
  validateJWT
}