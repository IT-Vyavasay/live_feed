import Swal from "sweetalert2";

export const ConfirmAction = (text) => {
  return Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#448ec5",
    confirmButtonText: "Yes",
  });
};
