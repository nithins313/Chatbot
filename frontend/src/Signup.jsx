import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const handleSignupSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    const regexusr = /^[A-Za-z0-9@#_+\.\-]{4,9}$/;
    const regexpass =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
    const regexemail = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/;

    let errors = {};

    if (!regexusr.test(formValues.username)) {
      errors.username =
        "Username must be 4-9 characters long and can include letters, numbers, and special characters @#_+.-";
    }

    if (!regexpass.test(formValues.password)) {
      errors.password =
        "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    if (!regexemail.test(formValues.email)) {
      errors.email = "Invalid email address";
    }

    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      const response = fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (response.status === 200) {
            navigate("/");
          } else {
            setFormErrors({ global: response.data });
          }
        })

        .catch((error) => {
          setFormErrors({ global: "Network error" });
        });
    } else {
      setFormErrors(errors);
    }
  };
  return (
    <>
      <div className="w-full">
        <div className="text-2xl">CHATBOT</div>

        <div className="fixed top-1/4 left-1/3 mx-auto w-[400px] h-fit py-12 mr-16  bg-gray-300 ">
          <div className="w-full inline-flex">
            <p className="flex text-xl m-auto pl-4">Sign up</p>
          </div>
          <div className="mx-auto flex justify-center text-xl">
            <form onSubmit={handleSignupSubmit}>
              {formErrors.global && (
                <p className="text-red-500 text-xs">{formErrors.username}</p>
              )}
              <div>
                <label className="block">Username</label>
                <input
                  className="w-full p-2 mb-6 border-b-2 outline-none focus:bg-gray-300"
                  type="text"
                  name="username"
                  required
                />
                {formErrors.username && (
                  <p className="text-red-500 text-xs">{formErrors.username}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Password</label>
                <input
                  className="w-full p-2 mb-6 border-b-2 outline-none focus:bg-gray-300"
                  type="password"
                  name="password"
                  required
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs">{formErrors.password}</p>
                )}
              </div>
              <div>
                <label className="block">Email</label>
                <input
                  type="email"
                  className="w-full p-2 mb-6 border-b-2 outline-none focus:bg-gray-300"
                  name="email"
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs">{formErrors.email}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="flex mx-auto rounded-full bg-black text-white px-4 py-1"
                >
                  Sign up
                </button>
              </div>
              <p
                className="cursor-pointer"
                onClick={() => {
                  navigate("/");
                }}
              >
                Already have an account?Log in
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
