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
- **URL:** `/user/:username`
- **Método:** `PUT`
- **Descripción:** Actualiza los detalles de un usuario por su username.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
- **Cuerpo de la solicitud:**
    ```json
    {
        "password": "string",
        "re_password": "string"
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
        "password": "string"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `200 Created`
    - **Cuerpo:**
        ```json
        {
            "message": "string",
            "token": "string"
        }
        ```

## Síntomas
### Obtener síntomas
- **URL:** `/symptoms/:username`
- **Método:** `GET`
- **Descripción:** Obtiene los síntomas de un paciente.
- **Parámetros de la URL:**
    - `username` (string): username del paciente.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "suffocate": "boolean",
            "cough": "boolean",
            "mucus": "boolean",
            "congestion": "boolean",
            "throat": "boolean",
            "fever": "boolean",
            "chest_pain": "boolean",
            "whistle": "boolean",
            "malaise": "boolean"
        }
        ```

### Crear síntomas
- **URL:** `/symptoms`
- **Método:** `POST`
- **Descripción:** Crea un nuevo set de síntomas.
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "suffocate": "boolean",
        "cough": "boolean",
        "mucus": "boolean",
        "congestion": "boolean",
        "throat": "boolean",
        "fever": "boolean",
        "chest_pain": "boolean",
        "whistle": "boolean",
        "malaise": "boolean"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `201 Created`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "suffocate": "boolean",
            "cough": "boolean",
            "mucus": "boolean",
            "congestion": "boolean",
            "throat": "boolean",
            "fever": "boolean",
            "chest_pain": "boolean",
            "whistle": "boolean",
            "malaise": "boolean"
        }
        ```

## Historial médico
### Obtener Historial
- **URL:** `/history/:username`
- **Método:** `GET`
- **Descripción:** Obtiene el historial médico de un paciente por su username.
- **Parámetros de la URL:**
    - `username` (string): username del paciente.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "mpid": "string",
            "ttm_base": "string",
            "immuno": "boolean",
            "comorbi": "string"
        }
        ```

### Crear Historial
- **URL:** `/history`
- **Método:** `POST`
- **Descripción:** Crea un nuevo registro en el historial médico de un paciente.
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "mpid": "string",
        "ttm_base": "string",
        "immuno": "boolean",
        "comorbi": "string"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `201 Created`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "mpid": "string",
            "ttm_base": "string",
            "immuno": "boolean",
            "comorbi": "string"
        }
        ```

## QR
### Obtener QR
- **URL:** `/qr/:username`
- **Método:** `GET`
- **Descripción:** Obtiene el qr de un paciente.
- **Parámetros de la URL:**
    - `username` (string): username del paciente.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        {
            "qrCode": "string"
        }
        ```

### Crear QR
- **URL:** `/qr`
- **Método:** `POST`
- **Descripción:** Crea el código QR de un paciente por su username y password y lo almacena en BD.
- **Cuerpo de la solicitud:**
```json
{
    "username": "string",
    "password": "string"
}
```
- **Respuesta exitosa:**
    - **Código:** `201 OK`
    - **Cuerpo:**
        ```json
        {
            "qrCode": "string"
        }
        ```

## Diagnóstico
### Crear diagnóstico
- **URL:** `/diagnostic`
- **Método:** `POST`
- **Descripción:** Crea el diagnóstico de un paciente y si debe ir a urgencias o no.
- **Cuerpo de la solicitud:**
```json
{
    "username": "string"
}
```
- **Respuesta exitosa:**
    - **Código:** `201 OK`
    - **Cuerpo:**
        ```json
        {
            "emergency": "boolean",
            "diagnostic": "string"
        }
        ```

## Pruebas médicas
### Obtener pruebas
- **URL:** `/tests/:username`
- **Método:** `GET`
- **Descripción:** Obtienes las pruebas médicas de un paciente por su username.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        [
            {
                "username": "string",
                "analitic": "string",
                "gasometry": "string",
                "ecg": "string",
                "torax": "string",
                "curr_date": "date"
            }
        ]
        ```

### Crear pruebas médicas
- **URL:** `/tests`
- **Método:** `POST`
- **Descripción:** Crea las pruebas médicas realizadas a un paciente en cierta fecha.
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "analitic": "string",
        "gasometry": "string",
        "ecg": "string",
        "torax": "string",
        "curr_date": "date"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `201 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "analitic": "string",
            "gasometry": "string",
            "ecg": "string",
            "torax": "string",
            "curr_date": "date"
        }
        ```

### Borrar pruebas médicas
- **URL:** `/tests/:username/:curr_date`
- **Método:** `DELETE`
- **Descripción:** Elimina un conjunto de pruebas médicas de un usuario en cierta fecha.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
    - `curr_date` (date): fecha de las pruebas.
- **Respuesta exitosa:**
    - **Código:** `204 No Content`

## Pruebas médicas 2
### Obtener pruebas
- **URL:** `/tests2/:username`
- **Método:** `GET`
- **Descripción:** Obtienes las pruebas médicas de un paciente por su username.
- **Respuesta exitosa:**
    - **Código:** `200 OK`
    - **Cuerpo:**
        ```json
        [
            {
                "username": "string",
                "micro": "string",
                "antigenuria": "string",
                "hemo": "string",
                "pcr": "string",
                "curr_date": "date"
            }
        ]
        ```

### Crear pruebas médicas
- **URL:** `/tests2`
- **Método:** `POST`
- **Descripción:** Crea las pruebas médicas realizadas a un paciente en cierta fecha.
- **Cuerpo de la solicitud:**
    ```json
    {
        "username": "string",
        "micro": "string",
        "antigenuria": "string",
        "hemo": "string",
        "pcr": "string",
        "curr_date": "date"
    }
    ```
- **Respuesta exitosa:**
    - **Código:** `201 OK`
    - **Cuerpo:**
        ```json
        {
            "username": "string",
            "micro": "string",
            "antigenuria": "string",
            "hemo": "string",
            "pcr": "string",
            "curr_date": "date"
        }
        ```

### Borrar pruebas médicas
- **URL:** `/tests2/:username/:curr_date`
- **Método:** `DELETE`
- **Descripción:** Elimina un conjunto de pruebas médicas de un usuario en cierta fecha.
- **Parámetros de la URL:**
    - `username` (string): username del usuario.
    - `curr_date` (date): fecha de las pruebas.
- **Respuesta exitosa:**
    - **Código:** `204 No Content`