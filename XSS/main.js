document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("commentForm"); // Corrected ID: "commentForm"
  const commentsList = document.getElementById("commentsList");
  const clearCommentsButton = document.getElementById("clearCommentsButton"); // Corrected ID: "clearCommentsButton"

  const loadComments = () => {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.forEach((comment) => {
      const commentItem = document.createElement("li");
      // XSS VULNERABILITY HERE: Direct insertion of stored user input into innerHTML
      commentItem.innerHTML = `<p><strong>${comment.userName}:</strong> ${comment.userComment}</p>`;
      commentsList.appendChild(commentItem);
    });
  }

  loadComments();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const userName = document.getElementById("userName").value; // Corrected ID: "userName"
    const userComment = document.getElementById("userComment").value;

    if (userName.trim() === "" || userComment.trim() === "") {
      alert("All fields must be filled.");
      return;
    }

    const commentItem = document.createElement("li");
    // XSS VULNERABILITY HERE: Direct insertion of new user input into innerHTML
    commentItem.innerHTML = `<p><strong>${userName}:</strong> ${userComment}</p>`; // CORRECTED: Use userName and userComment
    commentsList.appendChild(commentItem);

    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push({userName, userComment});
    localStorage.setItem("comments", JSON.stringify(comments));

    form.reset();
  });

  clearCommentsButton.addEventListener("click", () => {
    commentsList.innerHTML = "";
    localStorage.removeItem("comments");
  });
});

// Solution use textContent instead of innerHTML, instead of <p>something</p >
// use createElement("p") and use it