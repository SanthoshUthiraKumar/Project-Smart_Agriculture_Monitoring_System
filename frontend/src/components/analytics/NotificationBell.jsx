import React from "react";

export default function NotificationBell({ count, onClick }) {
  return (
    <div className="notif-bell" onClick={onClick} title={`${count} alerts`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{cursor:"pointer"}}>
        <path d="M12 22c1.104 0 2-.895 2-2h-4c0 1.105.896 2 2 2zM18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.93 6 11v5l-1.9 1.9C4 18.17 4 19 4 19h16s0-.83-.1-1.1L18 16z" fill="#fff"/>
      </svg>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}
