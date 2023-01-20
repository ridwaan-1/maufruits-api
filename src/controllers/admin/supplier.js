const { sqlQueryExecutor } = require("../../services/queyExecutor")


exports.getAllSupplier = async (req, res) => {
    try {
        const response = await sqlQueryExecutor("SELECT id, name FROM supplier");

        res.status(200).json({
            status: true,
            data: response
        })
    } catch (err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}