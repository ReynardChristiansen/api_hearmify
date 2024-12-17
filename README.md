# Hearmify API
The Hearmify API provides a set of endpoints for managing songs and user authentication. With this API, users can register, log in, manage songs (create, update, delete), and retrieve song details.



## Features

- Register User (POST): https://api-hearmify.vercel.app/api/songs/register
- Login User (POST): https://api-hearmify.vercel.app/api/songs/login
- Get All Songs (GET): https://api-hearmify.vercel.app/api/songs/getAllSongs
- Get Song by ID (GET): https://api-hearmify.vercel.app/api/songs/getSongById/{id}
- Create Song (POST): https://api-hearmify.vercel.app/api/songs/createSong
- Update Song (PUT): https://api-hearmify.vercel.app/api/songs/updateSong/{id}
- Delete Song (DELETE): https://api-hearmify.vercel.app/api/songs/delete/{id}
- Get User Info (GET): https://api-hearmify.vercel.app/api/songs/getUser


## Authorization

Most endpoints require an Authorization token, which you can obtain by logging in. The token must be included in the request headers as follows:

    Authorization: Bearer <TOKEN_FROM_LOGIN>


## Request Body

- Register User

    To register a new user, send a POST request with the following body:

        {
            "name": STRING,
            "password": STRING
        }

- Login User

    To log in and get a Bearer token, send a POST request with the following body:

        {
            "name": STRING,
            "password": STRING
        }

- Create Song

    To create a new song, send a POST request with the following body:

        {
            "title": STRING,
            "lyrics": ARRAY,
            "chords": ARRAY
        }

- Update Song

    To update an existing song, send a PUT request with the following body:

        {
            "title": STRING,
            "lyrics": ARRAY,
            "chords": ARRAY
        }

- Update Song

    To delete a song, send a DELETE request. No body is needed.

- Get User Info

    To retrieve the current user’s information, send a GET request with the Authorization token.


## Demo

You can try out Hearmify here: https://hearmify.vercel.app

## Feedback

If you have any feedback, please reach out to me at reynard.satria@gmail.com

