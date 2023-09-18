const urlBase = 'http://beanbookcontacts.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let loginInput = document.getElementById("loginName");
    let passwordInput = document.getElementById("loginPassword");

    let login = loginInput.value;
    let password = passwordInput.value;

    if (!login || !password) {

        alert("Please fill in all required (*) fields.");
        return;
    }


    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;

                    if (userId < 1) {
                        alert("Username or password is incorrect.");
                        return;
                    }

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();

                    window.location.href = "book.html";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function doSignup() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddUser.' + extension;

	if(!firstName || !login || !password){
		alert("Please fill in all required (*) fields.");
        return;
	}

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonPayload
    })
    .then(response => {

		if (response.status === 200) {
			// Redirect to index.html with a query parameter
		window.location.href = "index.html?signup=true";
		} else if (response.status === 409) {
			// Username is already taken (HTTP status code 409 Conflict)
			alert("Username is already taken. Please choose a different username.");
		} else {
			throw new Error('User creation failed');
		}
	})
    .catch(error => {
        document.getElementById("loginResult").innerHTML = error.message;
    });
}



function readCookie(){
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome back " + firstName + " " + lastName + "!";
		populateContactList(userId);
	}
}

function getUserIdFromCookie() {
    
	const cookies = document.cookie.split(',');
	for(const cookie of cookies){
		const [name, value] = cookie.trim().split('=');
		if(name == 'userId'){
			return value;
		}
	}

	return null;
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

 // Function to clear the contact form fields
function clearContactForm() {
	const firstNameInput = document.getElementById("firstName");
	const lastNameInput = document.getElementById("lastName");
	const emailInput = document.getElementById("email");
	const phoneNumberInput = document.getElementById("phoneNumber");
 
	firstNameInput.value = "";
	lastNameInput.value = "";
	emailInput.value = "";
	phoneNumberInput.value = "";

 }

 function addBean() {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phoneNumber = document.getElementById("phoneNumber");
    const userID = getUserIdFromCookie();

    console.log(userID);

    if (firstName.checkValidity() && lastName.checkValidity()) {
        const requestData = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            userID: userID,
        };

        fetch(urlBase + '/AddContact.' + extension, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log("Contact added successfully.");
                    clearContactForm();
                    $('#addContactModal').modal('hide');
                    populateContactList(userID);
                } else {
                    console.error("Error adding contact: ", data.error);
                }
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    } else {
        console.error("Form is not valid. Please fill in all required fields.");
        alert("Please fill in all required (*) fields.");
    }
}


function editBeanUI(button){

	const firstName = button.parentNode.querySelector(".first-name").textContent;
	const lastName = button.parentNode.querySelector(".last-name").textContent;
	const email = button.parentNode.querySelector(".email").textContent;
	const phoneNumber = button.parentNode.querySelector(".phone").textContent;

	const contactID = button.parentNode.querySelector(".contact-id").value;

	document.getElementById("editFirstName").value = firstName;
	document.getElementById("editLastName").value = lastName;
	document.getElementById("editEmail").value = email;
	document.getElementById("editPhone").value = phoneNumber;

	document.getElementsByClassName("contact-id")[0].value = contactID;

	$('#editContactModal').modal('show');
}

function editBeanSubmit(){

	const firstName = document.getElementById("editFirstName");
	const lastName = document.getElementById("editLastName");
	const email = document.getElementById("editEmail");
	const phoneNumber = document.getElementById("editPhone");
	const userID = getUserIdFromCookie();


	const contactID = document.getElementsByClassName("contact-id")[0].value;

	if(firstName.checkValidity() && lastName.checkValidity()){
		const requestData = {
			firstName: firstName.value,
			lastName: lastName.value,
			email: email.value,
			phoneNumber: phoneNumber.value,
			contactID: contactID,
		}
	
		fetch(urlBase + '/EditContact.' + extension, {
			method: 'POST',
			headers: {
				'Content-Type':'application/json',
			},
			body: JSON.stringify(requestData),
		})
		.then(response => {
			if(!response.ok){
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			if(data.success){
				console.log("Contact edited successfully.");
				$('#editContactModal').modal('hide');
				populateContactList(userID);
			}else{
				console.error("Error editing contact: ", data.error);
			}
		})
		.catch(error => {
			console.error("Error fetching data: ", error);
		})
	}else{
		console.error("Form is not valid. Please fill in all required fields.");
		alert("Please fill in all required (*) fields.");
	}
}

function searchBean() {
    const srch = document.getElementById("searchBeans").value; // Get the input value
    const userID = getUserIdFromCookie();
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    const requestData = {
        search: srch,
        userID: userID,
    };

    fetch(urlBase + '/ContactSearch.' + extension, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

			if(data && data.results){
	
				data.results.forEach(contact => {
					const listItem = document.createElement("li");
					listItem.innerHTML = `
					<input type="hidden" class="contact-id" value="${contact.ContactID}">
					<div class="contact-item">
						<div class="contact-image">
							<img src="/images/bean.png" alt="Contact Image">
						</div>
						<div class="contact-info">
							<div class="name">
								<span class="first-name">${contact.FirstName}</span>
								<span class="last-name">${contact.LastName}</span>
							</div>
							<div class="info">
								<span class="email">${contact.Email}</span>
								<span class="phone">${contact.Phone}</span>
							</div>
						</div>
					</div>
					<button class="delete-button" onclick="deleteContact(this)">
						<i class="fas fa-trash"></i> Delete
					</button>
					<button class="edit-button" onclick="editBeanUI(this)">
						<i class="fas fa-edit"></i> Edit
					</button>
				</li>
				`;
					contactList.appendChild(listItem);
				})	
			} else {
				// Display "No contacts" message when data is undefined
				const noContactsMessage = document.createElement("li");
                noContactsMessage.textContent = "No Beans";
                noContactsMessage.classList.add("no-contacts");
                contactList.appendChild(noContactsMessage);
			}
		})
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}


function populateContactList(userID){

	const contactList = document.getElementById("contactList");

	contactList.innerHTML = "";

	const requestData = {
		userID: userID
	};

	fetch(urlBase + '/ContactSearch.' + extension, {
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
		},
		body: JSON.stringify(requestData),
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {

		if(data && data.results){

			data.results.forEach(contact => {
				const listItem = document.createElement("li");
				listItem.innerHTML = `
				<input type="hidden" class="contact-id" value="${contact.ContactID}">
				<div class="contact-item">
					<div class="contact-image">
						<img src="/images/bean.png" alt="Contact Image">
					</div>
					<div class="contact-info">
						<div class="name">
							<span class="first-name">${contact.FirstName}</span>
							<span class="last-name">${contact.LastName}</span>
						</div>
						<div class="info">
							<span class="email">${contact.Email}</span>
							<span class="phone">${contact.Phone}</span>
						</div>
					</div>
				</div>
				<button class="delete-button" onclick="deleteContact(this)">
					<i class="fas fa-trash"></i> Delete
				</button>
				<button class="edit-button" onclick="editBeanUI(this)">
					<i class="fas fa-edit"></i> Edit
				</button>
			</li>
			`;
				contactList.appendChild(listItem);
			})	
		} else {
			// Display "No contacts" message when data is undefined
			const noContactsMessage = document.createElement("li");
			noContactsMessage.textContent = "No Beans";
			noContactsMessage.classList.add("no-contacts");
			contactList.appendChild(noContactsMessage);
		}
	})
	.catch(error => {
		console.error("Error fetching data: ", error);
	});
	
}

function deleteContact(button) {
    const listItem = button.parentNode;
    const contactID = listItem.querySelector(".contact-id").value;

    // Show a confirmation dialog
    const confirmation = confirm("Are you sure you want to delete this bean?");

    if (confirmation) {
        // User confirmed the deletion
        deleteContactAPI(contactID)
            .then(response => {
                if (response.success) {
                    listItem.remove();
					populateContactList(getUserIdFromCookie());
                } else {
                    alert("Failed to delete contact!!!");
                }
            })
            .catch(error => {
                console.error("Error deleting contact: ", error);
                alert("An error has occurred while deleting contact.");
            });
    }
}


function deleteContactAPI(contactID){
	const url = urlBase + '/DeleteContact.' + extension;

	const requestData = {
		contactID: contactID,
	};

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestData),
	})
	.then(response => response.json())
	.catch(error =>{
		throw new Error(error.message);
	});
}
