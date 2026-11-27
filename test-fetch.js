const payload = {
  schedules: [
    { dayOfWeek: "Monday", startTime: "19:00", endTime: "20:00" },
    { dayOfWeek: "Wednesday", startTime: "19:00", endTime: "20:00" }
  ]
};

console.log("Sending POST to /api/schedule/bulk...");
fetch("http://127.0.0.1:3000/api/schedule/bulk", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-user-id": "usr_test_student_123"
  },
  body: JSON.stringify(payload)
})
  .then(async res => {
    console.log("STATUS:", res.status, res.statusText);
    console.log("HEADERS:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("BODY:", text);
  })
  .catch(err => {
    console.error("FETCH ERROR:", err);
  });
