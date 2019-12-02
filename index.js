const template = require('./template.js');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "receipts/")
	},
	filename: function(req, file, cb) {
		cb(null, "r.jpg")
	}
});
const receipt = multer({storage: storage});
app.use(express.static('receipts'));



const request = {
	  image: {
		      source: {imageUri: 'r.jpg'}
		    }
};

app.get('/', (req, res) => {
	res.send(template.HTML("소종 이미지 입력",
	`<form action="/image_process" method="post" enctype="multipart/form-data">
		<input type="file" name="image" />
		<input type="submit" value="제출" />
	</form>`
	));
});

app.post('/image_process', receipt.single("image"), (req, res) => {
	console.log(req.file);
	client
	  .textDetection(request)
	  .then(response => {
		console.log(response);
		res.send(template.HTML("OCR 결과",
		`<img src="/receipts/r.jpg" width="400px" />
		<p>${response}</p>`));
	   })
	  .catch(err => {
		console.error(err);
	  });
});

app.listen(3000, () => console.log('Sojong app listening on port 3000'));
