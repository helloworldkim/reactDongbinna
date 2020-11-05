const fs = require('fs'); //파일에 접근할수있는 라이브러리
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api/hello',(req,res) =>{
//     res.send({message:'Hello Express!'});
// });
const data = fs.readFileSync('./database.json'); //db정보 담긴 json파일 불러옴
const conf = JSON.parse(data);
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

const multer = require('multer'); //multer 객체생성!
const upload = multer({ dest: './upload' }) //root 폴더내의 upload폴더로 파일업로드 경로 지정


app.get('/api/customers', (req, res) => {
    connection.query(
        "SELECT * FROM CUSTOMER WHERE isDeleted=0",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});
app.post('/api/customers', upload.single('image'), (req, res) => {
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?,?,?,?,?,now(),0)';
    let image = '/image/' + req.file.filename; //multer 라이브러리가 자동으로 안겹치는이름으로 설정해줌
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;

    let params = [image, name, birthday, gender, job];

    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
            console.log(err);
        }
    );
});
app.delete('/api/customers/:id', (req, res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted= 1 WHERE id =?';
    let params = [req.params.id];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});
app.use('/image', express.static('./upload')); //사용자는 image 폴더로 접근하는데 보여주는건 static 폴더인 upload폴더!
app.listen(port, () => console.log(`Listening on port ${port}`));