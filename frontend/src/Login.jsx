import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const login = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formLoginErrors, setFormLoginErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/user/auth", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Token verification failed");
        }
        navigate("/dashboard");
      } catch (error) {
        console.error("Token verification error:", error);
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues);
    const regexusr = /^[A-Za-z0-9@#_+\.\-]{4,9}$/;
    const regexpass =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

    let errors = {};

    if (!regexusr.test(formValues.username)) {
      errors.username =
        "Username must be 4-9 characters long and can include letters, numbers, and special characters @#_+.-";
    }

    if (!regexpass.test(formValues.password)) {
      errors.password =
        "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (Object.keys(errors).length === 0) {
      setFormLoginErrors({});
      fetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            setFormLoginErrors({ global: "Login Successfull" });
            setTimeout(() => {}, 5000);
            navigate("/dashboard");
          } else {
            response.text().then((text) => {
              setFormLoginErrors({ global: text });
            });
          }
        })
        .catch((error) => {
          setFormLoginErrors({ global: "Network error" });
        });
    } else {
      setFormLoginErrors({ global: "Invalid Input" });
    }
  };
  return (
    <div className="w-full">
      <div className="text-2xl">CHATBOT</div>

      <div className="fixed top-1/4 left-1/3 mx-auto w-[400px] h-fit py-12 mr-16  bg-gray-300 ">
        <div className="w-full inline-flex">
          <p className="flex text-3xl m-auto pl-4">Login</p>
        </div>
        <div className="mx-auto flex justify-center text-xl">
          <form onSubmit={handleLoginSubmit}>
            <div>
              {formLoginErrors.global && (
                <p className="text-red-500 text-xs">{formLoginErrors.global}</p>
              )}
              <label className="block">Username</label>
              <input
                className="w-full p-2 mb-6 border-b-2 outline-none focus:bg-gray-300"
                type="text"
                name="username"
                required
              />
              {formLoginErrors.username && (
                <p className="text-red-500 text-xs">
                  {formLoginErrors.username}
                </p>
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
              {formLoginErrors.password && (
                <p className="text-red-500 text-xs">
                  {formLoginErrors.password}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="flex mx-auto rounded-full bg-black text-white px-4 py-1"
              >
                Login
              </button>
            </div>
            <p
              className="cursor-pointer"
              onClick={() => {
                navigate("/signup");
              }}
            >
              New User? Sign up
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default login;
