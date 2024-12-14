# Endpoints del CRUD de Usuarios y Pacientes

## Usuarios

### Obtener Usuario
- **URL:** `/user/:username`
- **Método:** `GET`
- **Descripción:** Obtiene los detalles de un usuario por su username.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "password": "string"
        }
        ```

### Crear Usuario
- **URL:** `/user`
- **Método:** `POST`
- **Descripción:** Crea un nuevo usuario.
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "password": "string",
        "re_password": "string"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `201 Created`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "password": "string"
        }
        ```

### Actualizar Usuario
- **URL:** `/user/:user`
- **Método:** `PUT`
- **Descripción:** Actualiza los detalles de un usuario por su username.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
- **Cuerpo de la solicitud:**
    ```json
    {
        "password": "string"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "password": "string"
        }
        ```

### Eliminar Usuario
- **URL:** `/user/:username`
- **Método:** `DELETE`
- **Descripción:** Elimina un usuario y paciente por su username.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
- **Respuesta exitosa:**
    - **Código:** `204 No Content`
    - **Cuerpo:**
        'User' *username* 'deleted'

## Pacientes

### Obtener Paciente
- **URL:** `/patient/:username`
- **Método:** `GET`
- **Descripción:** Obtiene los detalles de un paciente por su username.
- **Parámetros de la URL:**
    - `username` (string): username del paciente.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "dni": "string",
            "name": "string",
            "last_name": "string",
            "birth": "date",
            "tel": "integer",
            "gender": "char",
            "age": "integer"
        }
        ```

### Crear Paciente
- **URL:** `/patient`
- **Método:** `POST`
- **Descripción:** Crea un nuevo paciente (debe existir previamente su usuario).
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "dni": "string",
        "name": "string",
        "last_name": "string",
        "birth": "date",
        "tel": "integer",
        "gender": "char"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `201 Created`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "dni": "string",
            "name": "string",
            "last_name": "string",
            "birth": "date",
            "tel": "integer",
            "gender": "char",
            "age": "integer"
        }
        ```

### Actualizar Paciente
- **URL:** `/patient/:username`
- **Método:** `PUT`
- **Descripción:** Actualiza los detalles de un paciente por su username.
- **Parámetros de la URL:**
    - `username` (string): username del paciente.
- **Cuerpo de la solicitud:**
    ```json
    {
        "dni": "string",
        "name": "string",
        "last_name": "string",
        "birth": "date",
        "tel": "integer",
        "gender": "char"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "dni": "string",
            "name": "string",
            "last_name": "string",
            "birth": "date",
            "tel": "integer",
            "gender": "char",
            "age": "integer"
        }
        ```

### Eliminar Paciente
- **URL:** `/user/:username`
- **Método:** `DELETE`
- **Descripción:** Elimina un usuario y paciente por su username.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
- **Respuesta exitosa:**
    - **Código:** `204 No Content`
    - **Cuerpo:**
        'User' *username* 'deleted'

## Login

### Hacer login de un usuario
- **URL:** `/login`
- **Método:** `POST`
- **Descripción:** El usuario inicia sesión en la página.
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "password": "string
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `200 Created`
    - **Cuerpo:**
        ```json
        {
            "message": "string",
            "token": "string
        }
        ```