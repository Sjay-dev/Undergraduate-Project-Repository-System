document.getElementById('date').innerText = new Date().toLocaleDateString();
function showGroupDetails(groupName) {
    let students = {
        'Group 1': 'Sanusi Joseph, Lemuel Umoh, Mbah Kelechi',
        'Group 2': 'Jane john, John Doe, Jane Doe',
        'Group 3': 'Alice Smith, Bob Brown',
        'Group 4': 'Charlie White, Eve Black'
    };

    let dept ={
        'Group 1': 'Computer Info Systems',
        'Group 2': 'Computer Science',
        'Group 3': 'Software Engineering',
        'Group 4': 'Computer Info Systems',
    };

    let topics = {
        'Group 1': 'Class System',
        'Group 2': 'E-Learning Platform',
        'Group 3': 'Blockchain Voting System',
        'Group 4': 'AI-Powered Chatbot'
    };



    document.getElementById('students').innerText = students[groupName] || 'N/A';
    document.getElementById('dept').innerText = dept[groupName] || 'N/A';
    document.getElementById('topic').innerText = topics[groupName] || 'N/A';
    document.getElementById('groupDetails').style.display = 'block';
}



function closeGroupDetails() {
    document.getElementById("groupDetails").style.display = "none";
}

function showFeedbackDetails() {
    document.getElementById("feedbackCard").style.display = "block";
}

function closeFeedbackCard() {
    document.getElementById("feedbackCard").style.display = "none";
}

function submitFeedback() {
    const action = document.getElementById("feedbackAction").value;
    const feedbackText = document.getElementById("feedbackText").value;

    if (!action) {
        alert("Please select an action.");
        return;
    }

    alert(`Feedback: ${action}\nMessage: ${feedbackText}`);
    closeFeedbackCard();
}
