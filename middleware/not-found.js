const notFound = (req, res) => res.status(404).json({message: "Page cannot be found"});


module.exports = notFound;