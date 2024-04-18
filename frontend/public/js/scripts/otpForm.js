import pageRouting from '../../changeContent.js'

export const otpFormModule = (() => {
  const otpCheck = (otp) => {
    console.log("in otp check");
    const id = localStorage.getItem('user_id');
    localStorage.removeItem('user_id');
    fetch("/api/user/otp/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'otp': otp, 'user_id': id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data received");
        console.log(data);
        if (Object.hasOwn(data, "access") && Object.hasOwn(data, "refresh")) {
          const successDiv = document.getElementById("loginSuccess");
          successDiv.textContent = "Login Successful.";
          successDiv.style.display = "block";
          localStorage.setItem("authToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
        } else {
          var errorString = "Login Error";

          for (const property in data) {
            console.log(`${property}: ${data[property]}`);
            errorString += `\n${property}: ${data[property]}`;
          }
          const errorMessageDiv = document.getElementById("loginError");
          errorMessageDiv.textContent = errorString;
          errorMessageDiv.style.display = "block"; // Make the error message visible
        }
        //   window.location.href = "/";
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Handle login error, e.g., show error message
      });
  };

  const init = () => {
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errorMessageDiv = document.getElementById("loginError");
        const successDiv = document.getElementById("loginSuccess");
        successDiv.style.display = "none"; // Make the error message visible
        errorMessageDiv.style.display = "none"; // Make the error message visible
        const otp = document.getElementById("otp").value;
        otpCheck(otp);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
