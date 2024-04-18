export async function contactHandler() {

    let authToken = localStorage.getItem('authToken');
    let friends = [];
    let users = [];
    let pending = [];

    let userId = await fetch("/api/user/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        },
      }).then((response) => {
        if (response.status === 401) {
          console.error("Unauthorized");
        }
        return response.json();
      }).then((data) => {
        return data["id"];
      }).catch((error) => {
        console.error("Error:", error);
    });


    async function updateFriends() {
       friends = await fetch("/api/user/me/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
            },
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }).then((data) => {
            return data["friends"];
          }).catch((error) => {
            console.error("Error:", error);
        });
    }

    async function updateUsers() {
        users = await fetch("/api/user/users/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
            },
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }).then((data) => {
            return data;
          }).catch((error) => {
            console.error("Error:", error);
        });
    }

    async function updatePending() {
        pending = await fetch("/api/user/friend-invitations/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
            },
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }).then((data) => {

            return data;
          }).catch((error) => {
            console.error("Error:", error);
        });
    }

    await updatePending();
    await updateFriends();
    await updateUsers();

    
    async function addFriend(id) {
        let response = await fetch("/api/user/friend-invitations/create/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
              "Content-Type": "application/json",
            },
            body: `{
              "user1": ${userId},
              "user2": ${id}
            }`,
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }).then((data) => {
            return data;
          }).catch((error) => {
            console.error("Error:", error);
        });

        await updateFriends();
        await updateUsers();
        await updatePending();
        filterFriends();
        filterUsers();
        filterPending();
    }

    async function denyFriend(id) {
      let response = await fetch(`/api/user/friend-invitations/update/${id}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
            "Content-Type": "application/json",
          },
          body: `{
            "status": "denied",
            "user1": ${userId},
            "user2": ${id}
          }`,
        }).then((response) => {
          if (response.status === 401) {
            console.error("Unauthorized");
          }
          return response.json();
        }).then((data) => {
          return data;
        }).catch((error) => {
          console.error("Error:", error);
      });

      await updateFriends();
      await updateUsers();
      await updatePending();
      filterFriends();
      filterUsers();
      filterPending();
  }

  async function acceptFriend(id) {
    let response = await fetch(`/api/user/friend-invitations/update/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
          "Content-Type": "application/json",
        },
        body: `{
          "status": "accepted",
          "user1": ${userId},
          "user2": ${id}
        }`,
      }).then((response) => {
        if (response.status === 401) {
          console.error("Unauthorized");
        }
        return response.json();
      }).then((data) => {
        return data;
      }).catch((error) => {
        console.error("Error:", error);
    });

    await updateFriends();
    await updateUsers();
    await updatePending();
    filterFriends();
    filterUsers();
    filterPending();
}


async function deleteFriend(id) {
  let response = await fetch(`/api/user/delete_friend/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
  });

  await updateFriends();
  await updateUsers();
  await updatePending();
  filterFriends();
  filterUsers();
  filterPending();
}
  

    function firstTenUsers(usList) {
        let firstTen = usList.slice(0, 10);
        let userList = document.getElementById("user-list");
        userList.innerHTML = "";
        firstTen.forEach((user) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerText = user.email;

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");

            // Create a button element for adding friend
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-primary btn-sm';
            addButton.textContent = 'Add';
            addButton.addEventListener('click', () => {
                console.log(user.id);
                addFriend(user.id);
                console.log(`Added ${user.email} as friend`);
            });

            buttonContainer.appendChild(addButton);
            li.appendChild(buttonContainer);

            userList.appendChild(li);
        });
    }

    function limitStringTo20Chars(str) {
      if (str.length > 20) {
        return str.slice(0, 16) + "...";
      } else {
        return str;
      }
    }

    function firstTenFriends(frList) {
        let firstTen = frList.slice(0, 10);
        let friendList = document.getElementById("friend-list");
        friendList.innerHTML = "";
        firstTen.forEach((user) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between";
            const txt = document.createElement("p");
            txt.innerText = user.email;
            txt.style = "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");

            // Create a button element for adding friend
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-danger btn-sm';
            addButton.textContent = 'Remove';
            addButton.addEventListener('click', () => {
            // Handle adding friend functionality here, for example:
                deleteFriend(user.id);
                console.log(`Removed ${user.email} from friend`);
            });

            buttonContainer.appendChild(addButton);
            li.appendChild(txt);
            li.appendChild(buttonContainer);

            friendList.appendChild(li);
        });
    }

    function firstTenPending(penList) {
        let firstTen = penList.slice(0, 10);
        let pendingList = document.getElementById("pending-list");
        pendingList.innerHTML = "";
        firstTen.forEach((user) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerText = user.email;

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex");

            // Create a button element for adding friend
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-primary btn-sm';
            addButton.textContent = 'Accept';
            addButton.addEventListener('click', () => {
                acceptFriend(user.id);
                console.log(`Accepted ${user.email} as friend`);
            });

            // Create a button element for adding friend
            const denyButton = document.createElement('button');
            denyButton.className = 'btn btn-danger btn-sm';
            denyButton.textContent = 'Deny';
            denyButton.addEventListener('click', () => {
                denyFriend(user.id);
                console.log(`Denied ${user.email} as friend`);
            });

            buttonContainer.appendChild(denyButton);
            buttonContainer.appendChild(addButton);
            li.appendChild(buttonContainer);

            pendingList.appendChild(li);
        });
    }

    function filterUsers() {
        const search = document.getElementById("user-search").value.toLowerCase();
        let filteredUsers = users.filter((user) => user.email.toLowerCase().includes(search));
        filteredUsers = filteredUsers.filter((user) => !friends.includes(user.id));
        firstTenUsers(filteredUsers);
    }

    function filterFriends() {
        console.log(friends);
        const search = document.getElementById("friend-search").value.toLowerCase();
        let filteredFriends = users.filter((user) => user.email.toLowerCase().includes(search));
        filteredFriends = filteredFriends.filter((user) => friends.includes(user.id));
        // let filteredFriends = friends.filter((user) => users.getItem.includes(search));
        firstTenFriends(filteredFriends);
    }


    const search = document.getElementById("pending-search").value.toLowerCase();
  
    function filterPending() {
    // Extract user IDs from pending invites
    const inviteUserIds = new Set();
    pending.forEach(invite => {
      if (invite.status === "pending") { // Making sure the invite is pending
        inviteUserIds.add(invite.user1);
        inviteUserIds.add(invite.user2);
      }
    });
  
    // Filter users based on the search term in their email and if their ID is in 'inviteUserIds'
    let filteredPending = users.filter(user => user.email.toLowerCase().includes(search) && inviteUserIds.has(user.id));
  
      console.log(filteredPending);
    
    // Assuming 'firstTenPending' is a function that you've defined to handle the filtered list
      firstTenPending(filteredPending);
    }

    document.querySelector("#user-search").addEventListener("input", (e) => {
        filterUsers();
    });

    document.querySelector("#friend-search").addEventListener("input", (e) => {
        filterFriends();
    });

    filterUsers();
    filterFriends();
    filterPending();
}