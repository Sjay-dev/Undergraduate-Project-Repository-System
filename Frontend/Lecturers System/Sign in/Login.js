document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');
  const signUpForm = document.getElementById("signUpForm");
  const signInForm = document.getElementById("signInForm");
  const messageBox = document.createElement("div");
  
  messageBox.className = "message-box";
  document.body.appendChild(messageBox);

  function showMessage(message, type) {
      messageBox.textContent = message;
      messageBox.classList.add(type, "show");
      setTimeout(() => messageBox.classList.remove("show"), 3000);
  }

  signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
  });

  signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
  });

  signUpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
          const response = await fetch("http://localhost:5000/api/users/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ firstName, lastName , email, password })
          });

          const data = await response.json();

          if (response.ok) {
              showMessage("Registration Successful!", "success");
              signUpForm.reset();
              container.classList.remove("right-panel-active");
          } 

          else {
              showMessage(data.msg || "Registration failed!", "error");
          }
          
      } 
      catch (error) {
          showMessage("An error occurred. Please try again.", "error");
          console.error("Registration Error:", error);
      }
  });

  signInForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      try {
          const response = await fetch("http://localhost:5000/api/users/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
          });

          const data = await response.json();
          console.log(data)
          if (response.ok) {
              localStorage.setItem("token", data.accessToken);
              localStorage.setItem("firstName", data.firstName);
              localStorage.setItem("lastName", data.lastName);
              const fullName = `${data.firstName} ${data.lastName}`;
                localStorage.setItem("fullName", fullName);
              
              showMessage("Login successful! Redirecting...", "success");
              setTimeout(() => {
                  window.location.href = "/Frontend/Lecturers System/Supervisor DashBoard/Home.html";
              }, 2000);
          } else {
              showMessage(data.msg || "Invalid login credentials!", "error");
          }
      } catch (error) {
          showMessage("An error occurred. Please try again.", "error");
          console.error("Login Error:", error);
      }
  });
});

/* CSS Styles for Message Box */
const style = document.createElement("style");
style.innerHTML = `
.message-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  display: none;
  z-index: 1000;
}

.message-box.success {
  background-color: #28a745;
}

.message-box.error {
  background-color: #dc3545;
}

.message-box.show {
  display: block;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}`;
document.head.appendChild(style);
