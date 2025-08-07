import billschema from "../models/billschema.js";

export const createBill = async (req, res) => {
  try {
    const {
      customerName, customerAddress, customerGstin, billNo, vehicleNo,
      items, subTotal, totalGst, totalAmount, paidAmount, date
    } = req.body;

    const balance = totalAmount - paidAmount;
    const paymentStatus = balance === 0 ? 'Paid' : 'Unpaid';

    if (!customerName || !items?.length || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bill = new billschema({
      customerName,
      customerAddress,
      customerGstin,
      billNo,
      vehicleNo,
      date,
      items,
      subTotal,
      totalGst,
      totalAmount,
      paidAmount,
      balance,
      paymentStatus,
      createdBy: req.user._id
    });

    await bill.save();
    res.status(201).json({ message: 'Bill created successfully', bill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const updateBill = async (req, res) => {
  try {
    const billId = req.params.id;
    const updatedData = req.body;

    const updatedBill = await Bill.findByIdAndUpdate(billId, updatedData, {
      new: true,
    });

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const { search, startDate, endDate, name } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { customerName: new RegExp(search, 'i') },
        { billNo: new RegExp(search, 'i') }
      ];
    }

    if (name) {
      query.customerName = new RegExp(name, 'i');
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // include entire endDate

      query.createdAt = {
        $gte: start,
        $lte: end
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



export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // validate id length (optional)
    if (!userId || userId.length < 24) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password'); // don't return pwd

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
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

