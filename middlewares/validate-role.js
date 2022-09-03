const { response } = require("express");


const isAdminRole= (req, res = response, next) => {

  if(!req.user) return res.status(500).json({
    msg:'Se quiere verificar el rol primero sin validar el token primero'
  })

  const { role, name } = req.user;

  if(role !== 'ADMIN_ROLE') return res.status(401).json({
    msg: `${name} no es administrador - No puede hacer esto`
  })

  next();

}

const addRole = (...restoRoles) => {
  return (req, res = response, next) => {

    if(!req.user) return res.status(500).json({
      msg:'Se quiere verificar el rol primero sin validar el token primero'
    })

    if(!restoRoles.includes(req.user.role)) return res.status(401).json({
      msg: `El servicio requiere uno de estos roles ${restoRoles}`
    })


    next();
  }
}

module.exports = {
  isAdminRole,
  addRole
}