import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gstRate: { type: Number },
  hsnCode: { type: String, required: true } // ✅ HSN Code as select/dropdown
});

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerGstin: { type: String },
  billNo: { type: String, required: true },
  vehicleNo: { type: String },
  date: { type: Date, required: true },
  items: [itemSchema],
  subTotal: { type: Number, required: true },
  totalGst: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  balance: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Bill', billSchema);
