const Target = require("../models/Target");

// Lấy tất cả các mục tiêu (targets)
const getAllTargets = async (req, res) => {
   try {
      const targets = await Target.find();
      res.status(200).json(targets);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving targets", error: err });
   }
};

// Lấy thông tin mục tiêu theo ID
const getTargetById = async (req, res) => {
   try {
      const { id } = req.params;
      const target = await Target.findById(id);
      if (!target) {
         return res.status(404).json({ message: "Target not found" });
      }
      res.status(200).json(target);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving target", error: err });
   }
};

// Tạo mới một mục tiêu
const createTarget = async (req, res) => {
   try {
      const { target } = req.body;

      // Tạo mục tiêu mới
      const newTarget = new Target({ target });
      await newTarget.save();

      res.status(201).json({ message: "Target created successfully", target: newTarget });
   } catch (err) {
      res.status(500).json({ message: "Error creating target", error: err });
   }
};

// Cập nhật mục tiêu theo ID
const updateTarget = async (req, res) => {
   try {
      const { id } = req.params;
      const { target } = req.body;

      const updatedTarget = await Target.findByIdAndUpdate(
         id,
         { target },
         { new: true, runValidators: true } // Kiểm tra giá trị đầu vào
      );

      if (!updatedTarget) {
         return res.status(404).json({ message: "Target not found" });
      }

      res.status(200).json({ message: "Target updated successfully", target: updatedTarget });
   } catch (err) {
      res.status(500).json({ message: "Error updating target", error: err });
   }
};

// Xóa mục tiêu theo ID
const deleteTarget = async (req, res) => {
   try {
      const { id } = req.params;

      const deletedTarget = await Target.findByIdAndDelete(id);
      if (!deletedTarget) {
         return res.status(404).json({ message: "Target not found" });
      }

      res.status(200).json({ message: "Target deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting target", error: err });
   }
};

module.exports = {
   getAllTargets,
   getTargetById,
   createTarget,
   updateTarget,
   deleteTarget,
};
