const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  descrition: { type: String },
  available: { type: Boolean, default: true}

});

ProductSchema.methods.toJSON = function() {
  const { __v, state, _id, ...product } = this.toObject();
  product.uid = _id;
  return product;
}


module.exports = model('Product', ProductSchema);