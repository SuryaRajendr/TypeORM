# USERS

## List Users

List Users lambda fn is used for listing all the users with pagination query.

## Command for testing

npm run start users

## How to use?

GET {baseUrl}/list-users - return first 30 users
GET {baseUrl}/list-users?limit=5 - return first 5 users
GET {baseUrl}/list-users?limit=5&page=2 - skip first users and return next 5 users
GET {baseUrl}/list-users?user.userId=2 - return user with userId = 2
GET {baseUrl}/list-users?select=-user.phoneNumber,user.userId - return users without phone nuber and with userId
GET {baseUrl}/list-users?sort=userInformation.firstName - return users with ascending order of first name
GET {baseUrl}/list-users?sort=-user.userId - return users with descending order of userId
