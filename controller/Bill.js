import billschema from "../models/billschema.js";


export const createBill = async (req, res) => {
  try {
    const bill = new billschema({ ...req.body, createdBy: req.user._id });
    await bill.save();
    res.status(201).json({ message: 'Bill created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const { search = '', status, startDate, endDate } = req.query;
    const query = {
      $or: [
        { customerName: new RegExp(search, 'i') },
        { billNo: new RegExp(search, 'i') }
      ]
    };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (req.user.role === 'Admin') {
      query.createdBy = req.user._id;
    }

    const bills = await billschema.find(query).populate('createdBy', 'name email');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await billschema.findById(req.params.id).populate('createdBy', 'name email');
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};