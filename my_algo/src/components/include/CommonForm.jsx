import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { fetchApi } from "../../utils/frondend"; // Adjust path as needed
import Loader from "../include/Loader"; // Adjust path as needed

const CommonForm = ({
  formConfig,
  initialValues = {},
  apiEndpoint,
  submitBtnText = "Submit",
  onSuccess, // Callback after successful API call
  extraPayload = {}, // Any hidden data (like userId)
  isModal = false, // To adjust layout if needed
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState({}); // Track password visibility

  // Handle generic input changes
  const handleChange = (name, value, config) => {
    let finalValue = value;

    // 1. Handle Input Masking (Regex Replace)
    if (config.mask) {
      finalValue = value.replace(config.mask, "");
    }

    // 2. Handle specific replace logic (e.g. double dots)
    if (config.replaceRule) {
      finalValue = finalValue.replace(
        config.replaceRule.regex,
        config.replaceRule.replaceWith
      );
    }

    // 3. Update State
    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // 4. Real-time Validation (Optional: e.g. for Password Strength)
    if (config.validateOnChange) {
      const error = config.validate(finalValue, formData);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      // Clear error on type
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // 5. Handle Side Effects (e.g., changing 'isOffer' based on price)
    if (config.onChangeSideEffect) {
      const updates = config.onChangeSideEffect(finalValue, formData);
      setFormData((prev) => ({ ...prev, ...updates }));
    }
  };

  const togglePassword = (field) => {
    setShowPwd((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    formConfig.forEach((field) => {
      if (field.validate) {
        const error = field.validate(formData[field.name], formData);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      } else if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    // SweetAlert Confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#448ec5",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const payload = { ...formData, ...extraPayload };
          const response = await fetchApi(apiEndpoint, JSON.stringify(payload));

          setLoading(false);

          if (response?.statusCode === 200) {
            toast.success(response?.data?.message || "Success");
            if (onSuccess) onSuccess(response);
          } else {
            toast.error(response?.data?.message || "Error submitting form");
          }
        } catch (error) {
          setLoading(false);
          toast.error("Network error");
        }
      }
    });
  };

  return (
    <div className="row">
      {formConfig.map((field, index) => {
        // Check if field should be hidden
        if (field.hideIf && field.hideIf(formData)) return null;

        return (
          <div key={index} className={field.colClass || "col-12 col-md-6 mb-2"}>
            <label className="col-form-label modalLabel">{field.label}</label>

            <div
              className={
                field.appendIcon || field.appendText ? "input-group" : ""
              }
            >
              {/* --- TEXT / PASSWORD / NUMBER INPUTS --- */}
              {["text", "number", "password"].includes(field.type) && (
                <input
                  type={
                    field.type === "password" && showPwd[field.name]
                      ? "text"
                      : field.type
                  }
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  disabled={field.disabled}
                  maxLength={field.maxLength}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field)
                  }
                  onKeyUp={(e) => e.keyCode === 13 && handleSubmit()}
                />
              )}

              {/* --- REACT SELECT --- */}
              {field.type === "select" && (
                <Select
                  options={field.options}
                  placeholder={field.placeholder}
                  value={field.options.find(
                    (opt) => opt.value == formData[field.name]
                  )}
                  onChange={(opt) => handleChange(field.name, opt.value, field)}
                  isDisabled={field.disabled}
                />
              )}

              {/* --- DATE PICKER --- */}
              {field.type === "date" && (
                <DatePicker
                  className="form-control"
                  placeholderText={field.placeholder}
                  selected={formData[field.name]}
                  onChange={(date) => handleChange(field.name, date, field)}
                  dateFormat="dd/MM/yyyy"
                  minDate={field.minDate ? field.minDate() : null}
                />
              )}

              {/* --- RADIO BUTTONS --- */}
              {field.type === "radio" && (
                <div className="d-flex mt-2">
                  {field.options.map((opt, i) => (
                    <div key={i} className="custom-control custom-radio mr-3">
                      <input
                        type="radio"
                        id={`${field.name}-${i}`}
                        name={field.name}
                        className="custom-control-input"
                        checked={formData[field.name] == opt.value}
                        onChange={() =>
                          handleChange(field.name, opt.value, field)
                        }
                      />
                      <label
                        className="custom-control-label cursor-pointer"
                        htmlFor={`${field.name}-${i}`}
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* --- APPEND TEXT/ICON (Input Group Append) --- */}
              {field.appendText && (
                <div className="input-group-append">
                  <div className="input-group-text">{field.appendText}</div>
                </div>
              )}

              {/* --- PASSWORD EYE TOGGLE --- */}
              {field.type === "password" && (
                <div
                  className="input-group-append curser-pointer"
                  onClick={() => togglePassword(field.name)}
                >
                  <div className="input-group-text">
                    <i
                      className={`mdi mdi-eye${
                        showPwd[field.name] ? "" : "-off"
                      } fs-4`}
                    ></i>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Text Display */}
            {field.renderHelper && field.renderHelper(formData[field.name])}
            {errors[field.name] && (
              <div className="text-danger small">{errors[field.name]}</div>
            )}
          </div>
        );
      })}

      {/* --- ACTION BUTTONS --- */}
      <div className="col-12 mt-3 text-right">
        {loading ? (
          <Loader />
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            {submitBtnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommonForm;
