import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = File.create({
      name,
      path,
    });

    const data = await File.findByPk(id, {
      attributes: ['id', 'name', 'path'],
    });

    return res.status(200).json(data);
  }
}

export default new FileController();
