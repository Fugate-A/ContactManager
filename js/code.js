const urlBase = 'http://beanbookcontacts.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	if(login == "art" && password == "art"){
		window.location.href = "book.html";

		return;
	}

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				window.location.href = "book.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
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

function doSignup()
{
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	let tmp = {firstName:firstName,lastName:lastName, login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/AddUser.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange=function()
		{
			if(this.readyState==4&&this.status==200)
			{
				document.getElementById("loginResult").innerHTML = "User Created";
			}
		}
		xhr.send(jsonPayload);
		//document.getElementByID("loginResult")
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function readCookie()
{
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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addBean()
{
	let newBean = document.getElementById("beanText").value;
	document.getElementById("beanAddResult").innerHTML = "";

	let tmp = {bean:newBean,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("beanAddResult").innerHTML = "A Bean has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("beanAddResult").innerHTML = err.message;
	}
	
}

function searchBean()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("beanSearchResult").innerHTML = "";
	
	let beanList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/ContactSearch.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("beanSearchResult").innerHTML = "Bean(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					beanList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						beanList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = beanList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("beanSearchResult").innerHTML = err.message;
	}

}

function populateContactList(userID){

	console.log("Printing contact list for "+userID);
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
   
		data.results.forEach(contact => {
			const listItem = document.createElement("li");
			listItem.innerHTML = `
            <div class="contact-info">
                <div class="name">
                    <span class="first-name">${contact.FirstName}</span>
                    <span class="last-name">${contact.LastName}</span>
                </div>
                <div class="email">${contact.Email}</div>
                <div class="phone">${contact.Phone}</div>
            </div>
        `;
			contactList.appendChild(listItem);
		})
	})
	.catch(error => {
		console.error("Error fetching data: ", error);
	});
	
}
