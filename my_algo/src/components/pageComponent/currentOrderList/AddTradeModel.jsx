import React, { useState } from "react";
import CommonModal from "../../include/CommonModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { fetchApi } from "../../../utils/frondend";
import { chk_password, validate_string } from "../../../utils/common";
import Loader from "../../include/Loader";
import CommonForm from "../../include/CommonForm";

const AddTradeModel = ({
  show,
  setShow,
  loading,
  setLoading,
  user_id,
  user_email,
  setAuthTkn,
}) => {
  const [fields, setFields] = useState({
    tradeId: "test123",
    strategyCode: "TEST_STRATEGY", // Default selected
    isShortSell: false,
    qty: 1,
    entryPrice: 0,
    exitPrice: 0,
    openAt: null,
    closeAt: null,
    pnl: 0.0,
    securityType: "CRYPTO",
    instrumentToken: "BTCUSDT",
    exchangeSegment: "BINANCE",
    status: "WAITING",
    triggerPrice: "43500.50",
  });

  const handleClose = () => {
    setShow(false);
    setFields({
      admPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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

  const tradeFormConfig = [
    // --- Section: Identifiers ---
    {
      name: "tradeId",
      label: "Trade ID",
      type: "text",
      placeholder: "Enter Trade ID",
      required: true,
      colClass: "col-12 col-md-4 mb-2", // Custom sizing
    },
    {
      name: "strategyCode",
      label: "Strategy Code",
      type: "select",
      options: [{ label: "TEST_STRATEGY", value: "TEST_STRATEGY" }],
      required: true,
      colClass: "col-12 col-md-4 mb-2",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "WAITING", value: "WAITING" },
        { label: "OPEN", value: "OPEN" },
        { label: "CLOSED", value: "CLOSED" },
      ],
      colClass: "col-12 col-md-4 mb-2",
    },

    // --- Section: Market Details ---
    {
      name: "securityType",
      label: "Security Type",
      type: "select",
      options: [{ label: "CRYPTO", value: "CRYPTO" }],
      colClass: "col-12 col-md-4 mb-2",
    },
    {
      name: "exchangeSegment",
      label: "Exchange",
      type: "select",
      options: [{ label: "BINANCE", value: "BINANCE" }],
      colClass: "col-12 col-md-4 mb-2",
    },
    {
      name: "instrumentToken",
      label: "Token / Symbol",
      type: "select",
      options: [{ label: "BTCUSDT", value: "BTCUSDT" }],
      colClass: "col-12 col-md-4 mb-2",
    },

    // --- Section: Trade Settings ---
    {
      name: "isShortSell",
      label: "Is Short Sell?",
      type: "radio",
      options: [
        { label: "No (Long)", value: false },
        { label: "Yes (Short)", value: true },
      ],
      colClass: "col-12 col-md-6 mb-2",
    },
    {
      name: "qty",
      label: "Quantity",
      type: "text",
      mask: /[^0-9]/g, // Integer only
      placeholder: "Qty",
      colClass: "col-12 col-md-6 mb-2",
    },

    // --- Section: Pricing ---
    {
      name: "triggerPrice",
      label: "Trigger Price",
      type: "text",
      mask: /[^0-9.]/g, // Decimals allowed
      replaceRule: { regex: /(\..*)\./g, replaceWith: "$1" }, // No double dots
      appendText: "USDT",
      colClass: "col-12 col-md-6 mb-2",
    },
    {
      name: "entryPrice",
      label: "Entry Price",
      type: "text",
      mask: /[^0-9.]/g,
      replaceRule: { regex: /(\..*)\./g, replaceWith: "$1" },
      placeholder: "Optional",
      colClass: "col-12 col-md-6 mb-2",
    },
    {
      name: "exitPrice",
      label: "Exit Price",
      type: "text",
      mask: /[^0-9.]/g,
      replaceRule: { regex: /(\..*)\./g, replaceWith: "$1" },
      placeholder: "Optional",
      colClass: "col-12 col-md-6 mb-2",
    },
    {
      name: "pnl",
      label: "PnL",
      type: "text",
      // Allow digits, dots, and minus sign for negative PnL
      mask: /[^0-9.-]/g,
      replaceRule: { regex: /(\..*)\./g, replaceWith: "$1" },
      colClass: "col-12 col-md-6 mb-2",
    },

    // --- Section: Timestamps ---
    {
      name: "openAt",
      label: "Open Time",
      type: "date",
      placeholder: "Select Open Date",
      colClass: "col-12 col-md-6 mb-2",
    },
    {
      name: "closeAt",
      label: "Close Time",
      type: "date",
      placeholder: "Select Close Date",
      colClass: "col-12 col-md-6 mb-2",
    },
  ];

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
      <CommonForm
        formConfig={tradeFormConfig}
        initialValues={fields}
        extraPayload={{ userId: 1 }}
        apiEndpoint="pending-order/"
        submitBtnText="Update Password"
      />
    </CommonModal>
  );
};

export default AddTradeModel;
