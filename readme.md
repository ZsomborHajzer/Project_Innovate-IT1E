Signup: 

Backend information: 

Sign-up URL : localhost:8082/auth/signup 

Request method: PUT 

Required info:  

{ 
email: “exampleemail@gmail.com”, 
password: “Atleast5letters”, 
firstName:”John”, 
lastName: “Doe” 

} 

Possible returns:  

“Validation Failed” Status: 422 

OR 

{ 

Message: “User successfully created!”, 

 userID: “64633e1c095fd0b128f6f76d” 

} 

Status: 201 

 

Login: 

Backend information: 

Login URL: localhost:8082/auth/login 

Request method: POST 

Required info:  

{ 

“email”: “exampleemail@gmail.com”, 
“password”: “Atleast5lettersPassword”, 

} 

 

Possible Returns: 

{ 

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpzb21ib3IzLmhhanplckBnbWFpbC5jb20iLCJ1c2VySWQiOiI2NDYzM2VjMTA5NWZkMGIxMjhmNmY3NzIiLCJpYXQiOjE2ODQyMjU4MzAsImV4cCI6MTY4NDIzMzAzMH0.aDhfjB9n88kQwoA9X72OfIqPfqePxt56801b47mgDzw", 

    "userId": "64633ec1095fd0b128f6f772" 

}  

status: 200 
 
OR 

Error: Wrong Password 

Status: 201; 

OR 

Error: A user with this email does not exist 

Status: 201; 

 

JWT authorization on every subsequent page requires: 

Header:  

Authentication : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpzb21ib3IzLmhhanplckBnbWFpbC5jb20iLCJ1c2VySWQiOiI2NDYzM2VjMTA5NWZkMGIxMjhmNmY3NzIiLCJpYXQiOjE2ODQyMjU4MzAsImV4cCI6MTY4NDIzMzAzMH0.aDhfjB9n88kQwoA9X72OfIqPfqePxt56801b47mgDzw 

 

Each JWT token includes information about: 

User-ID 

Email address 