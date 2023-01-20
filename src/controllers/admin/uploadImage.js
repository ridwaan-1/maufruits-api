const Resize = require("../../services/imgResize");


exports.uploadImage = async (req, res) => {
    try {
        const imagePath = 'images';
        const fileUpload = new Resize(imagePath);

        if (!req.file) {
            return res.status(401).json({ message: 'Please provide an image' });
        }
        const filename = await fileUpload.save(req.file.buffer);

        return res.status(200).json({ url: `${process.env.SERVER_URL}/images/${filename}` });
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}