import React, { Component } from "react";
import "./FormValidation.css";
import { connect } from "react-redux";
import Swal from "sweetalert2";
class BaiTapForm extends Component {
  state = {
    values: {
      firstName: "",
      lastName: "",
      account: "",
      email: "",
      password: "",
      checkPassword: "",
    },
    errors: {
      firstName: "",
      lastName: "",
      account: "",
      email: "",
      password: "",
      checkPassword: "",
    },
  };
  setDefault = () => {
    const arrID = [
      "firstName",
      "lastName",
      "account",
      "email",
      "password",
      "checkPassword",
    ];
    arrID.forEach((id) => (document.getElementById(id).value = ""));
    this.setState({
      values: {
        firstName: "",
        lastName: "",
        account: "",
        email: "",
        password: "",
        checkPassword: "",
      },
      errors: {
        firstName: "",
        lastName: "",
        account: "",
        email: "",
        password: "",
        checkPassword: "",
      },
    });
  };
  checkExist = (value) => {
    let isExist = false;
    this.props.mangNguoiDung.forEach((element) => {
      if (element.account === value || element.email === value) {
        isExist = true;
      }
    });
    return isExist;
  };
  handleChange = (event) => {
    let { name, value } = event.target;
    let label = event.target.getAttribute("placeholder");
    let type = event.target.getAttribute("type");
    let newValues = { ...this.state.values, [name]: value };

    //kiem tra rong
    let errorMess = "";
    if (value.trim() === "") {
      errorMess = label + " không được bỏ trống!";
    }

    //Kiểm tra account tồn tại chưa
    if (type === "text" && label === "Tài Khoản") {
      if (this.checkExist(value)) {
        errorMess = "Tài khoản đã tồn tại!";
      }
    }

    //Kiem tra email
    if (type === "email") {
      let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!regexEmail.test(value)) {
        errorMess = `${label} không hợp lệ!`;
      }
      if (this.checkExist(value)) {
        errorMess = "Email đã đăng ký";
      }
    }

    //Kiem tra password, checkPassword
    if (type === "password" && label === "Mật Khẩu") {
      if (value.length < 8) {
        errorMess = `${label} phải có từ 8 ký tự trở lên`;
      }
    }
    if (newValues["checkPassword"] !== newValues["password"]) {
      if (type === "password" && label === "Xác Nhận Mật Khẩu") {
        errorMess = "Mật khẩu xác nhận chưa trùng khớp";
      }
    }

    let newErrors = { ...this.state.errors, [name]: errorMess };

    this.setState({
      values: newValues,

      errors: newErrors,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;
    let { values, errors } = this.state;
    delete values.edit;
    //Duyet ca truong values cua state
    for (let key in values) {
      if (values[key].trim() === "") {
        Swal.fire("Oops...", "Có gì đó sai sai!", "error");
        valid = false;
        return;
      }
    }
    //Duyệt các trường errors cả state
    for (let key in errors) {
      if (errors[key].trim() !== "") {
        Swal.fire("Oops...", "Something went wrong!", "error");
        valid = false;
        return;
      }
    }
    if (valid) {
      this.props.submit(this.state.values);
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
      this.setDefault();
    }
  };
  render() {
    return (
      <div className="container mt-5 ">
        <form
          onSubmit={(event) => this.handleSubmit(event)}
          className="form-group bg-white p-5"
        >
          <h2>THÔNG TIN NGƯỜI DÙNG</h2>
          <div className="row">
            <div className="group col-6">
              <input
                type="text"
                className="form-control"
                name="firstName"
                id="firstName"
                placeholder="Họ"
                onChange={this.handleChange}
              />
              <p className="text-left text-danger mt-1">
                {this.state.errors.firstName}
              </p>
              <span></span>
            </div>
            <div className="group col-6">
              <input
                type="text"
                className="form-control"
                name="lastName"
                id="lastName"
                placeholder="Tên"
                onChange={this.handleChange}
              />
              <p className="text-left text-danger mt-1">
                {this.state.errors.lastName}
              </p>
            </div>
          </div>
          <div className="group col-12">
            <input
              type="text"
              className="form-control"
              name="account"
              id="account"
              placeholder="Tài Khoản"
              onChange={this.handleChange}
            />
            <p className="text-left text-danger mt-1">
              {this.state.errors.account}
            </p>
          </div>
          <div className="group col-12">
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              placeholder="Email"
              onChange={this.handleChange}
            />
            <p className="text-left text-danger mt-1">
              {this.state.errors.email}
            </p>
          </div>
          <div className="row">
            <div className="group col-6">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Mật Khẩu"
                onChange={this.handleChange}
              />
              <p className="text-left text-danger mt-1">
                {this.state.errors.password}
              </p>
            </div>
            <div className="group col-6">
              <input
                type="password"
                className="form-control"
                name="checkPassword"
                id="checkPassword"
                placeholder="Xác Nhận Mật Khẩu"
                onChange={this.handleChange}
              />
              <p className="text-left text-danger mt-1">
                {this.state.errors.checkPassword}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Đăng ký
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submit: (nguoiDung) => {
      dispatch({
        type: "SUBMIT",
        nguoiDung,
      });
    },
  };
};

const mapStateToProps = (state) => {
  return {
    mangNguoiDung: state.FormReducer.mangNguoiDung,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BaiTapForm);
