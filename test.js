exports.changePassword = async (req, res) => {
    try {
      const userId = req.user._id; 
  
      const { oldPassword, newPassword } = req.body;
  
      // validation
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          status: false,
          message: "Please provide old password and new password",
        });
      }
  
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
  
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
      if (!isOldPasswordValid) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid old password" });
      }
  
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  
      user.password = hashedNewPassword;
      await user.save();
  
      return res.status(200).json({
        status: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Error in changePassword:", error.message);
      return res.status(500).json({ status: false, message: error.message });
    }
  };