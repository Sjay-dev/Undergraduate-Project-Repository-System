const notifications = [
    { id: 1, message: "New assignment uploaded.", time: "10 mins ago", read: false },
    { id: 2, message: "Meeting scheduled for 3 PM.", time: "30 mins ago", read: false },
    { id: 3, message: "Student submitted an assignment.", time: "1 hour ago", read: true }
];

function renderNotifications() {
    const notificationList = document.getElementById("notification-list");
    notificationList.innerHTML = "";
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement("div");
        notificationItem.classList.add("list-group-item", "notification-card", "d-flex", "justify-content-between", "align-items-center");
        if (!notification.read) {
            notificationItem.classList.add("unread");
        }
        notificationItem.innerHTML = `
            <span>${notification.message} <small class="text-muted">(${notification.time})</small></span>
            <button class="btn btn-sm btn-primary" onclick="markAsRead(${notification.id})">Mark as Read</button>
        `;
        notificationList.appendChild(notificationItem);
    });
}

function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        renderNotifications();
    }
}

document.addEventListener("DOMContentLoaded", renderNotifications);