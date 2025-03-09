document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
const email = localStorage.getItem("email");
const matric_number = localStorage.getItem("matric_number");
const level = localStorage.getItem("level");
const department = localStorage.getItem("department");

const userName = document.getElementById("userName");
const profileName = document.getElementById("profileName");

if (!token) {
  window.location.href = "/Frontend/Student Repo System/Sign in/Login.html";
  return;
}

    // Fetch current student info
    try {
      const response = await fetch("http://localhost:5000/api/students/current", 
        {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        userName.textContent = name || "Supervisor";
      }
      
      else {
        userName.textContent = "Supervisor";
      }
    }
    
    catch (error) {
      console.error("Error fetching user details:", error);
      userName.textContent = "Supervisor";
    }

     // Fetch groups data from backend
     try {
      const groupsResponse = await fetch("http://localhost:5000/api/groups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (groupsResponse.ok) {
        const groups = await groupsResponse.json();
        // Update total group count on dashboard
        document.getElementById("groupCount").innerText = groups.length;
  
        // Update the dynamic group list in the sidebar card (replace hard-coded list)
        const groupListUL = document.getElementById("groupList");
        if (groupListUL) {
          groupListUL.innerHTML = ""; // Clear any existing list items
          groups.forEach((group) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = group.groupName;
            li.style.cursor = "pointer";
            // When clicked, pass the full group object to showGroupDetails
            li.addEventListener("click", () => showGroupDetails(group));
            groupListUL.appendChild(li);
          });
        }
      } else {
        console.error("Error fetching groups data");
      }
    } catch (error) {
      console.error("Error fetching groups data:", error);
    }
  });







