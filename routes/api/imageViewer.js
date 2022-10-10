const express = require('express')

const router = express.Router();

const { downloadFile } = require('../../utils/s3')

router.get('/:key', (req, res) => {
  const key = req.params.key
  const downloadedImage = downloadFile(key)

  downloadedImage.pipe(res)
})

module.exports = router;
