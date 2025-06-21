# 🚍 API - Líneas de Transporte

## Respuestas del API

Todas las respuestas que retorna el API tienen el siguiente formato:

| Campo   | Tipo    | Descripción                                          |
| ------- | ------- | ---------------------------------------------------- |
| success | boolean | Verdadero si la solicitud fue realizada exitosamente |
| message | String  | Mensaje descriptivo del estado de respuesta          |
| data    | Object  | Objeto                                               |

```JSON
{
  "success": true,
  "message": "Objeto creado exitosamente",
  "data": {
    "object": {
      "_id": "1",
      "number": "341",
    }
  }
}
```

## POST `/api/lines/add`

### Descripción

Crea una nueva línea de transporte público y asocia a una lista de puntos geoespaciales.  
Si un punto ya existe (misma `lat` y `lon`), se reutiliza.

---

### Solicitud (Request)

- **Método**: `POST`
- **URL**: `/api/lines/add`
- **Encabezados**: `Content-Type: application/json`
- **Body**:
  ```JSON
  {
    "number": "341",
    "syndicate": "21 de Septiembre",
    "points": [
        { "lat": 13.6929, "lon": -89.2182 },
        { "lat": 13.7000, "lon": -89.2100 }
    ]
  }
  ```

| Campo     | Tipo   | Requerido | Descripción                                     |
| --------- | ------ | --------- | ----------------------------------------------- |
| number    | String | ✅ Sí     | Número de Minibus                               |
| syndicate | String | ❌ No     | Nombre del sindicato                            |
| points    | Array  | ✅ Sí     | Lista de id de objetos Ubicacion (`lat`, `lon`) |

### Respuesta (Response)

El formato de la respuesta es:

| Campo   | Tipo    | Descripción                                          |
| ------- | ------- | ---------------------------------------------------- |
| success | boolean | Verdadero si la solicitud fue realizada exitosamente |
| message | String  | Mensaje descriptivo                                  |
| data    | Object  | Linea creada con IDs                                 |

#### ✅ `201 Created`

```JSON
{
  "success": true,
  "message": "Linea creada exitosamente",
  "data": {
    "line": {
      "_id": "66512a8b21b9638ecfd7b431",
      "number": "341",
      "syndicate": "21 de Septiembre",
      "points": [
        { "lat": 13.6929, "lon": -89.2182 },
        { "lat": 13.7000, "lon": -89.2100 }
      ],
      "__v": 0
    }
  }
}
```

#### ❌ `400/500 Errores`

```JSON
{
  "success": false,
  "message": "Numero de Linea y puntos son requeridos",
  "error": null
}
```

## GET `/api/lines/all`

Obtiene todas las líneas de transporte registradas.

---

### Request

- **URL**: `/api/lines/all`
- **Método**: `GET`
- **Headers**: `Content-Type: application/json`

### Respuesta (Response)

| Campo   | Tipo    | Descripción                         |
| ------- | ------- | ----------------------------------- |
| success | Boolean | Indica si la operación fue exitosa  |
| message | String  | Mensaje descriptivo de la operación |
| data    | Object  | Array de lineas encontradas         |

#### ✅ `200 OK`

```JSON
  {
    "success": true,
    "message": "Lineas obtenidas",
    "data": {
      "lines": [
        {
          "_id": "66512a8b21b9638ecfd7b431",
          "number": "341",
          "syndicate": "21 de Septiembre",
          "points": [{ "lat": 13.6929, "lon": -89.2182 }, { "lat": 13.7000, "lon": -89.2100 }],
          "__v": 0
        },
        ...
      ]
    }
  }
```

#### ❌ `400/500 Errores`

```JSON
  {
    "success": false,
    "message": "Error interno del servidor",
    "error": null
  }
```

## GET `/api/lines/near-point`

Obtiene las líneas de transporte cercanas (1km de radio) a un punto geoespacial dado.

---

### Request

- **URL**: `/api/lines/near-point`
- **Método**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "lat": 13.6929,
    "lon": -89.2182
  }
  ```

| Campo    | Tipo   | Req.  | Descripción                   |
| -------- | ------ | ----- | ----------------------------- |
| lat, lon | Number | ✅ Sí | Latitud del punto geoespacial |

### Respuesta (Response)

| Campo   | Tipo    | Descripción                             |
| ------- | ------- | --------------------------------------- |
| success | Boolean | Indica si la operación fue exitosa      |
| message | String  | Mensaje descriptivo de la operación     |
| data    | Object  | Información sobre el punto y las líneas |
| lines   | Array   | Lista de líneas cercanas al punto       |

#### ✅ `200 OK`

```JSON
  {
    "success": true,
    "message": "Lineas encontradas cercanas al punto",
    "data": {
      "lines": [
        {
          "_id": "66512a8b21b9638ecfd7b431",
          "number": "341",
          "syndicate": "21 de Septiembre",
          "points": [{ "lat": 13.6929, "lon": -89.2182 }, { "lat": 13.7000, "lon": -89.2100 }],
          "__v": 0
        },
        ...
      ]
    }
  }
```

#### ❌ `400/500 Errores`

```JSON
  {
    "success": false,
    "message": "Latitud y longitud deben ser numeros",
    "error": null
  }
```
