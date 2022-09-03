const { response } = require("express");
const { Category } = require('../models');

//* getCategories - pagination - total - populate = consultar de mongoos*//
const getCategories = async (req, res = response) => {

  const {limit = 5, since = 0} = req.query;

  //* el async y el await son un código bloqueante, es decir, hasta que no termine el primer await el segundo await va a estar a la espera de que el primero temrine *//
  const [total, categories] = await Promise.all([// TODO: ejecuta promesas de manera simultanea, es decir, ejecuta todas mis promesas que quiero que se ejecuten (todas al mismo tiempo) para tener en cuenta si una da error, todas daran error, y otra cosa hay que ponerle await para que no siga la ejecución hasta que no de toda la respuesta
    Category.countDocuments({state: true}),//* cuenta los registros que hay en la base de datos  y los trae y le envio a la consulta el state:true para que solo me cuente los registros que el state esten en true *//
    Category.find({state: true}) //* me consulta los datos en la db y le envio a la consulta que solo me traiga todos aquellos que tengan el state en true *//
      .populate('user', 'name') //* nos trae los datos de la tabla relacionada *//
      .limit(Number(limit))//* se transforma el limit a numero y trae un limite de datos *//
      .skip(Number(since)) //* trae datos desde donde quiero empezar a contarlos *//
  ]);

  res.status(200).json({
    stadoPeticion: true,
    total,
    showData: categories.length,
    categories
  });
}

//* getCategory - populate = consultar de mongoos*//
const getCategory = async (req, res = response) => {

  const { id } = req.params;

  const category = await Category.findById(id)
                          .populate('user', 'name');
  console.log( category );

  res.status(200).json({
    estadoPeticion: true,
    id,
    category
  })

}

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({name});

  if (categoryDB)  return res.status(400).json({
    msg: `La categoria ${categoryDB.name}, ya existe.`
  });

  //* Generar la data a guardar *//
  console.log( req.user );
  const data = {
    estadoPeticion: true,
    name,
    user: req.user._id
  }

  const category = new Category(data);

  //* Guardar en DB *//
  await category.save();

  res.status(201).json(category);
}


//* updateCategory *//
const updateCategory = async (req, res = response) => {

  // const {name} = req.body;
  const {id} = req.params;
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id; //* para actualizar el usuario por el usuario que actualiza el registro *//

  const update = await Category.findByIdAndUpdate(id, data, {new: true})
    .populate('user', 'name');


  res.status(200).json({
    estadoPeticion: true,
    update
  })

}

//* deleteCategory - state = false *//
const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const dlCategory = await Category.findByIdAndUpdate(id, {state: false}).populate('user', 'name');

  res.status(200).json({
    estadoPeticion: true,
    dlCategory
  })

}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}