document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve token and supervisor's user id from local storage.
    // Make sure these values are set during login.
    const token = localStorage.getItem("token");
    const lecturerID = localStorage.getItem("lecturerID"); // the supervisor's user id



    try {
        // Call the GET user endpoint to retrieve supervisor details
        const response = await fetch(`http://localhost:5000/api/users/${lecturerID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const lecturer = await response.json();

        // Update the HTML elements with the retrieved supervisor details.
        const supervisorNameElement = document.getElementById("supervisorName");
        const supervisorEmailElement = document.getElementById("supervisorEmail");

            supervisorNameElement.textContent = `${lecturer.firstName} ${lecturer.lastName}`;


        if (supervisorEmailElement) {
            supervisorEmailElement.textContent = lecturer.email;
            supervisorEmailElement.href = `mailto:${lecturer.email}`;
        }
    } catch (error) {
        console.error("Error fetching supervisor details:", error);
    }
});
