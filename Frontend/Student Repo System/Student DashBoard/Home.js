document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const studentID = localStorage.getItem("studentID");
  const name = localStorage.getItem("name");

  const userName = document.getElementById("userName");
  const profileName = document.getElementById("profileName");
  const groupMembersContainer = document.getElementById("groupMembers");
  const projectTopicContainer = document.getElementById("projectTopic");
  const projectSupervisorContainer = document.getElementById("projectSupervisor");

  if (!token) {
    window.location.href = "/Frontend/Student Repo System/Sign in/Login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/students/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      userName.textContent = name || "Student";
    } else {
      userName.textContent = "Student";
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }

  // Fetch Student's group data
  try {
    const groupsResponse = await fetch(`http://localhost:5000/api/students/${studentID}/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (groupsResponse.ok) {
      const studentGroups = await groupsResponse.json();
      
      if (studentGroups.length > 0) {
        const group = studentGroups[0]; // Assuming the student is in one group

        // Update project topic
        projectTopicContainer.textContent = group.projectTopic || "No project assigned yet";

        projectSupervisorContainer.textContent = group.lecturer || "No supervisor assigned yet";


        // Update group members
        groupMembersContainer.innerHTML = ""; // Clear existing content
        group.students.forEach(student => {
          if (student._id !== studentID) { // Exclude current student
            const memberElement = document.createElement("p");
            memberElement.textContent = `${student.name}`;
            groupMembersContainer.appendChild(memberElement);
          }
        });
      } else {
        projectTopicContainer.textContent = "No project assigned yet";
        groupMembersContainer.innerHTML = "<p>No group members</p>";
      }




      
    }
  } catch (error) {
    console.error("Error fetching group details:", error);
  }

  // Fetch Recent Uploads
  try {
    const uploadsResponse = await fetch("http://localhost:5000/api/projects/recent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (uploadsResponse.ok) {
      const uploads = await uploadsResponse.json();
      const uploadsTableBody = document.getElementById("uploadsTableBody");
      uploadsTableBody.innerHTML = ""; // Clear table before inserting new data

      uploads.forEach((project) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${project.projectName}</td>
          <td>${new Date(project.createdAt).toLocaleDateString()}</td>
          <td>${project.status}</td>
          <td>${project.technologies.join(", ")}</td>
        `;
        uploadsTableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching recent uploads:", error);
  }
});
