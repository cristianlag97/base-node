const { responde, request } = require('express');

const userGet = (req = request, res = responde) => {

  const params = req.query;

  res.json({
    estadoPeticion: true,
    msn: 'Get API - Controller',
    params
  });
}

const userDelete = (req, res) => {
  res.json({
    estadoPeticion: true,
    msn: 'Delete API - Controller'
  });
}

const userPut = (req, res) => {

  const {id} = req.params;

  res.json({
    estadoPeticion: true,
    msn: 'Put API - Controller',
    id
  });
}

const userPost = (req, res) => {

  const body = req.body;

  res.json({
    estadoPeticion: true,
    msn: 'Post API - Controller',
    body
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