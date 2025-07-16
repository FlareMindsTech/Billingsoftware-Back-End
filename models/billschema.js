import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gstRate: { type: Number, required: true }
}, { _id: false });

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerGstin: { type: String, required: true },
  billNo: { type: String, required: true, unique: true },
  vehicleNo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  items: [itemSchema],
  subTotal: { type: Number, required: true },
  totalGst: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Bill', billSchema);