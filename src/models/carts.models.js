import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        id_prod: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: function () {
      return [];
    },
  },
  active: {
    type: Boolean,
    default: false
  }
});

cartSchema.pre('findOne', function() {
  this.populate('products.id_prod')
})

const cartsModel = model("carts", cartSchema, "carts");

export default cartsModel;
