import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = File.create({
      name,
      path,
    });

    return res.status(200).json(file);
  }
}

export default new FileController();
