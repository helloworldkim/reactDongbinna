import React from 'react';
import { post } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    hidden: {
        display: 'none'
    }
});

class CustomerAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: '',
            open: false

        }
    }
    handleFormSubmit = (e) => {
        e.preventDefault()
        this.addCustomer()
            .then((response) => {
                console.log(response.data);
                //입력정보에 대한 response를 받고 state를 초기화하는 메서드 실행
                this.props.stateRefresh();
            })
        this.setState({
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: ''
        })


    }
    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        })
    }
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    addCustomer = () => {
        const url = '/api/customers'; //보낼 url주소
        const formData = new FormData();    //body에 담아보낼 정보들
        formData.append('image', this.state.file);
        formData.append('name', this.state.userName);
        formData.append('birthday', this.state.birthday);
        formData.append('gender', this.state.gender);
        formData.append('job', this.state.job);
        //헤더설정!
        const config = {
            headers: {
                'contentType': 'multipart/form-data'
            }
        }
        //axios post방식
        return post(url, formData, config);
    }

    handleClickOpen = () => {
        console.log(this.state.open);
        this.setState({
            open: true
        });
    }
    handleClose = () => {
        this.setState({
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: '',
            open: false
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>고객추가하기</Button>
                <Dialog open={this.state.open} onClose={this.handleClose} >
                    <DialogTitle>고객추가</DialogTitle>
                    <DialogContent>
                        <input className={classes.hidden} accept="image/*" type="file" id="raised-button-file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} ></input>
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName === "" ? "프로필 이미지선택" : this.state.fileName}
                            </Button>
                        </label>
                        <br />
                        <TextField label="이름" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} ></TextField><br />
                        <TextField label="생년월일" type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} ></TextField><br />
                        <TextField label="성별" type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange} ></TextField><br />
                        <TextField label="직업" type="text" name="job" value={this.state.job} onChange={this.handleValueChange} ></TextField><br />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가하기</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>

            // <form onSubmit={this.handleFormSubmit}>
            //     <h1>고객추가</h1>
            //     프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} /><br />
            //     이름:<input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} /><br />
            //     생년월일:<input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} /><br />
            //     성별:<input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange} /><br />
            //     직업:<input type="text" name="job" value={this.state.job} onChange={this.handleValueChange} /><br />
            //     <button type="submit">추가하기</button>
            // </form>
        )

    }
}

export default withStyles(styles)(CustomerAdd);