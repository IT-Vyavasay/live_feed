import React, { useState } from "react";
import CommonModal from "../../include/CommonModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { fetchApi } from "../../../utils/frondend";
import { chk_password, validate_string } from "../../../utils/common";
import Loader from "../../include/Loader";

const ChangePasswordModal = ({
  show,
  setShow,
  showPwd,
  loading,
  setShowPwd,
  setLoading,
  user_id,
  user_email,
  GetUserList,
  setAuthTkn,
  activationLdr,
  setActivationLdr,
  varificationLdr,
  setVarificationLdr,
  twoFaLdr,
  setTwoFaLdr,
  setListindex,
}) => {
  const [fields, setFields] = useState({
    admPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleClose = () => {
    setShow(false);
    setFields({
      admPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const updateStatus = async (status, userId, email, i) => {
    if (!activationLdr) {
      await Swal.fire({
        title: "Are you sure?",
        text: `You want to ${status == 0 ? "active" : "deactive"} ${email}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#448ec5",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setActivationLdr(true);
          setListindex(i);
          const ActivationData = JSON.stringify({
            userId: userId,
            status: status == 1 ? 0 : 1,
          });
          const change_status = await fetchApi(
            "user/change-status",
            ActivationData
          );
          setActivationLdr(false);
          setListindex(-1);
          if (change_status.statusCode == 200) {
            toast.success(change_status.data.message);
            GetUserList();
          } else {
            if (change_status.data.message == "Unauthorized") {
              setAuthTkn(change_status.data.message);
            } else {
              toast.error(change_status?.data?.message);
            }
          }
        }
      });
    }
  };
  const updateVerification = async (userId, email, i) => {
    if (!varificationLdr) {
      Swal.fire({
        title: "Are you sure?",
        text: `You want to verify ${email}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#448ec5",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setVarificationLdr(true);
          setListindex(i);
          const ActivationData = JSON.stringify({
            userId: userId,
          });
          const change_status = await fetchApi(
            "user/change-verification",
            ActivationData
          );
          setVarificationLdr(false);
          setListindex(-1);
          if (change_status.statusCode == 200) {
            toast.success(change_status.data.message);
            GetUserList();
          } else {
            if (change_status.data.message == "Unauthorized") {
              setAuthTkn(change_status.data.message);
            } else {
              toast.error(change_status?.data?.message);
            }
          }
        }
      });
    }
  };
  const twoOff = async (userId, email, i) => {
    if (!twoFaLdr) {
      Swal.fire({
        title: "Are you sure?",
        text: `You want to disable google authenticator for ${email}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#448ec5",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setTwoFaLdr(true);
          setListindex(i);
          const ActivationData = JSON.stringify({
            userId: userId,
          });
          const change_status = await fetchApi("user/two-off", ActivationData);
          setTwoFaLdr(false);
          setListindex(-1);
          if (change_status.statusCode == 200) {
            toast.success(change_status.data.message);
            GetUserList();
          } else {
            if (change_status.data.message == "Unauthorized") {
              setAuthTkn(change_status.data.message);
            } else {
              toast.error(change_status?.data?.message);
            }
          }
        }
      });
    }
  };
  const checkPass = (pass) => {
    const v = pass;
    const digit = /[0-9]/;
    const lower = /[a-z]/;
    const cap = /[A-Z]/;
    const spchar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (v == "" || v == undefined) {
      $("#er1").addClass("text-danger").removeClass("text-success");
      $("#er2").addClass("text-danger").removeClass("text-success");
      $("#er3").addClass("text-danger").removeClass("text-success");
      $("#er4").addClass("text-danger").removeClass("text-success");
      $("#er5").addClass("text-danger").removeClass("text-success");
    } else {
      const c = v.length;
      $("#er1")
        .addClass(v.match(digit) ? "text-success" : "text-danger")
        .removeClass(v.match(digit) ? "text-danger" : "text-success");
      $("#er2")
        .addClass(v.match(lower) ? "text-success" : "text-danger")
        .removeClass(v.match(lower) ? "text-danger" : "text-success");
      $("#er3")
        .addClass(v.match(spchar) ? "text-success" : "text-danger")
        .removeClass(v.match(spchar) ? "text-danger" : "text-success");
      $("#er4")
        .addClass(c < 8 || c > 32 ? "text-danger" : "text-success")
        .removeClass(c < 8 || c > 32 ? "text-success" : "text-danger");
      $("#er5")
        .addClass(v.match(cap) ? "text-success" : "text-danger")
        .removeClass(v.match(cap) ? "text-danger" : "text-success");
    }
  };
  const ClickOnEye = (field) => {
    setShowPwd({ ...showPwd, [field]: !showPwd[field] });
  };
  const handleSubmit = () => {
    if (!loading) {
      try {
        validate_string(fields.newPassword, "new password");
        chk_password(fields.newPassword);
        validate_string(fields.confirmPassword, "confirm password");
        if (fields.newPassword !== fields.confirmPassword) {
          throw `Password and confirm password doesn't match`;
        }
        validate_string(fields.admPassword, "admin password");
        chk_password(fields.admPassword);
      } catch (e) {
        toast.error(e);
        return false;
      }

      Swal.fire({
        title: "Are you sure?",
        text: `You want to change password for ${user_email}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#448ec5",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          let bodyData = {
            admPassword: fields.admPassword,
            newPassword: fields.newPassword,
            userId: user_id,
          };
          const add_user = await fetchApi(
            "user/change-password",
            JSON.stringify(bodyData)
          );
          setLoading(false);
          if (add_user?.statusCode == 200) {
            toast.success(add_user?.data?.message);
            setFields({});
            handleClose();
          } else {
            if (add_user.data.message == "Unauthorized") {
              setAuthTkn(add_user.data.message);
            } else {
              toast.error(add_user.data.message);
            }
          }
        }
      });
    }
  };
  return (
    <CommonModal
      show={show}
      onClose={handleClose}
      title="Change Password"
      footerButtons={[
        {
          label: "Close",
          className: "btn btn-secondary waves-effect",
          onClick: handleClose,
        },
        {
          label: " Submit",
          className:
            "btn btn-bordered-primary waves-effect waves-light loadingButton",
          onClick: handleSubmit,
          loading: loading,
          Loader: Loader,
          icon: <i className="bx bx-save"></i>,
        },
      ]}
    >
      {/* New Password */}
      <div className="mb-2">
        <label className="col-form-label">New Password</label>

        <div className="input-group">
          <input
            type={showPwd.newPassword ? "text" : "password"}
            value={fields.newPassword}
            placeholder="New password"
            className="form-control"
            onChange={(e) =>
              setFields({ ...fields, newPassword: e.target.value })
            }
            onKeyUp={(e) => {
              checkPass(e.target.value);
              e.keyCode === 13 && handleSubmit();
            }}
          />

          <div className="input-group-append curser-pointer">
            <div
              className="input-group-text"
              onClick={() => ClickOnEye("newPassword")}
            >
              <i
                className={`mdi mdi-eye${
                  showPwd.newPassword ? "" : "-off"
                } fs-4`}
              ></i>
            </div>
          </div>
        </div>

        <span className="password-validation-span">
          <span>
            <i className="fa fa-check-circle"></i> 1 Number
          </span>
          <span>
            <i className="fa fa-check-circle"></i> 1 Uppercase
          </span>
          <span>
            <i className="fa fa-check-circle"></i> 1 Lowercase
          </span>
          <span>
            <i className="fa fa-check-circle"></i> 1 Special Character
          </span>
          <span>
            <i className="fa fa-check-circle"></i> 8–32 Characters
          </span>
        </span>
      </div>

      {/* Confirm Password */}
      <div className="mb-2">
        <label className="col-form-label">Confirm Password</label>

        <div className="input-group">
          <input
            type={showPwd.confirmPassword ? "text" : "password"}
            value={fields.confirmPassword}
            placeholder="Confirm password"
            className="form-control"
            onChange={(e) =>
              setFields({ ...fields, confirmPassword: e.target.value })
            }
            onKeyUp={(e) => e.keyCode === 13 && handleSubmit()}
          />

          <div
            className="input-group-text"
            onClick={() => ClickOnEye("confirmPassword")}
          >
            <i
              className={`mdi mdi-eye${
                showPwd.confirmPassword ? "" : "-off"
              } fs-4`}
            ></i>
          </div>
        </div>
      </div>

      {/* Admin Password */}
      <div className="mb-2">
        <label className="col-form-label">Admin Password</label>

        <div className="input-group">
          <input
            type={showPwd.admPassword ? "text" : "password"}
            value={fields.admPassword}
            placeholder="Admin password"
            className="form-control"
            onChange={(e) =>
              setFields({ ...fields, admPassword: e.target.value })
            }
            onKeyUp={(e) => e.keyCode === 13 && handleSubmit()}
          />

          <div
            className="input-group-text"
            onClick={() => ClickOnEye("admPassword")}
          >
            <i
              className={`mdi mdi-eye${showPwd.admPassword ? "" : "-off"} fs-4`}
            ></i>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default ChangePasswordModal;
