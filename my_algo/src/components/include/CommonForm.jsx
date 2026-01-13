import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { fetchApi } from "../../utils/frondend";

const CommonForm = ({
  initialValues = {},
  fields = [],
  submitApi,
  onSuccess,
  submitButton = { label: "Submit" },
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* -------------------- handlers -------------------- */

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};

    fields.forEach((field) => {
      const value = values[field.name];

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.validate) {
        const err = field.validate(value, values);
        if (err) newErrors[field.name] = err;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || loading) return;

    try {
      setLoading(true);
      const res = await fetchApi(submitApi, JSON.stringify(values));
      setLoading(false);

      if (res?.statusCode === 200) {
        toast.success(res?.data?.message || "Success");
        onSuccess && onSuccess(res);
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (e) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  /* -------------------- render field -------------------- */

  const renderField = (field) => {
    const commonProps = {
      className: "form-control",
      placeholder: field.placeholder,
      value: values[field.name] || "",
      onChange: (e) => setFieldValue(field.name, e.target.value),
    };

    switch (field.type) {
      case "select":
        return (
          <Select
            options={field.options}
            value={field.options.find((o) => o.value === values[field.name])}
            onChange={(opt) => setFieldValue(field.name, opt.value)}
          />
        );

      case "date":
        return (
          <DatePicker
            className="form-control"
            selected={values[field.name]}
            minDate={field.minDate}
            onChange={(date) => setFieldValue(field.name, date)}
          />
        );

      case "radio":
        return field.options.map((opt) => (
          <div className="custom-control custom-radio me-2" key={opt.value}>
            <input
              type="radio"
              className="custom-control-input"
              checked={values[field.name] === opt.value}
              onChange={() => setFieldValue(field.name, opt.value)}
            />
            <label className="custom-control-label cursor-pointer">
              {opt.label}
            </label>
          </div>
        ));
      case "password-strength": {
        return (
          <>
            <div className="input-group">
              <input
                type={showPwd[field.name] ? "text" : "password"}
                className="form-control"
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) =>
                  setFieldValue(field.name, e.target.value, field)
                }
                onKeyUp={(e) => e.keyCode === 13 && handleSubmit()}
              />

              <div
                className="input-group-text cursor-pointer"
                onClick={() =>
                  setShowPwd((prev) => ({
                    ...prev,
                    [field.name]: !prev[field.name],
                  }))
                }
              >
                <i
                  className={`mdi mdi-eye${
                    showPwd[field.name] ? "" : "-off"
                  } fs-4`}
                />
              </div>
            </div>

            {/* PASSWORD RULE UI */}
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
          </>
        );
      }

      default:
        return <input type={field.type || "text"} {...commonProps} />;
    }
  };

  /* -------------------- JSX -------------------- */

  return (
    <div className="row">
      {fields.map((field) => (
        <div
          key={field.name}
          className={`col-12 col-md-${field.col || 6} mb-2`}
        >
          <label className="col-form-label">{field.label}</label>

          <div className={field.suffix ? "input-group" : ""}>
            {renderField(field)}

            {field.suffix && (
              <div className="input-group-append">
                <div className="input-group-text">{field.suffix}</div>
              </div>
            )}
          </div>

          {errors[field.name] && (
            <small className="text-danger">{errors[field.name]}</small>
          )}
        </div>
      ))}

      <div className="col-12 mt-3">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : submitButton.label}
        </button>
      </div>
    </div>
  );
};

export default CommonForm;
