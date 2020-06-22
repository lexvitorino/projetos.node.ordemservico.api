import Sequelize, { Model } from 'sequelize';
import fs from 'fs';
import { resolve } from 'path';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  async unlink(avatar_id) {
    const avatar = await File.findByPk(avatar_id);
    if (avatar) {
      const dir = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads');
      fs.unlink(`${dir}\\${avatar.path}`, async err => {
        if (!err) {
          await File.destroy({ where: { id: avatar_id } });
        }
      });
    }
  }
}

export default File;
