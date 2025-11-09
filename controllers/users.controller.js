const getAllUsers = (req, res) => {
  res.json({ message: "Fetched Users Successfully" });
};

module.exports = { getAllUsers };
