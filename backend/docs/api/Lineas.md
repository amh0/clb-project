# 🚍 API - Líneas de Transporte

Indice:

- [GET /api/lines/near-point](#get-apilinesnear-point)
- [GET /api/lines/all](#get-apilinesall)
- [POST /api/lines/add](#post-apilinesadd)
- [GET /api/lines/:number](#get-apilinesnumber)
- [DELETE /api/lines/:number](#delete-apilinesnumber)

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

## GET `/api/lines/near-point`

Obtiene las líneas de transporte cercanas (1km de radio) a un punto geoespacial dado.

---

### Request

- **URL**: `/api/lines/near-point`
- **Método**: `GET`
- **Headers**: `Content-Type: application/json`
- **Parametros (Query Parameters)**:
  | Parametro | Tipo | Req. | Descripción |
  | ------------------- | ------- | ----- | -------------------------------------------------- |
  | lat, lon | Number | ✅ Sí | Latitud del punto |
  | includePoints | Boolean | ❌ No | Verdadero si se requiere puntos de la linea |
  | includeVectorPoints | Boolean | ❌ No | Verdadero si se requiere puntos de la linea vector |

Ejemplo de solicitud

```http
/api/lines/near?lat=-16.4909&lon=-68.1216&includePoints=true&includeVectorLine=true
```

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
        "_id": "686b35ecba132ce68c77673d",
        "number": 901,
        "vectorPoints": [
          { "lat": -16.49097107433775, "lon": -68.12159328600671 },
          { "lat": -16.49306470735297, "lon": -68.12149403772518 },
        ]
      },
      {
        "_id": "6880508b9ef7a1f84d06f953",
        "number": 910,
        "vectorPoints": [
          { "lat": -16.49097107433775, "lon": -68.12159328600671 },
          { "lat": -16.49306470735297, "lon": -68.12149403772518 },
        ]
      }
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
        "processedLines": [
            {
                "_id": "686b35ecba132ce68c77673d",
                "number": 901,
                "points": [
                    { "lat": -16.49094533292501, "lon": -68.1216060485491 },
                    { "lat": -16.493157459340182, "lon": -68.12150259383797}
                ],
                "__v": 0,
                "vectorPoints": [
                    {"lat": -16.49097107433775, "lon": -68.12159328600671},
                    {"lat": -16.49306470735297, "lon": -68.12149403772518 },
                ]
            },
            {
                "_id": "6880508b9ef7a1f84d06f953",
                "number": 910,
                "points": [
                    {"lat": -16.49094533292501, "lon": -68.1216060485491},
                    {"lat": -16.493157459340182, "lon": -68.12150259383797 },
                ],
                "__v": 0,
                "vectorPoints": [
                    {"lat": -16.49097107433775, "lon": -68.12159328600671},
                    {"lat": -16.49306470735297, "lon": -68.12149403772518},
                ]
            }
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

## POST `/api/lines/add`

### Descripción

Crea una nueva línea de transporte público, asocia a una lista de puntos geoespaciales, y una lista de puntos vector.  
Si un punto geoespacial ya existe (misma `lat` y `lon`), se reutiliza.

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
        { "lat": -16.49094533292501 , "lon": -68.1216060485491 },
        { "lat": -16.49094533292504 , "lon": -68.1216060485494 },
    ],
    "vectorPoints": [
        { "lat": -16.49094533292501 , "lon": -68.1216060485491 },
        { "lat": -16.49094533292502 , "lon": -68.1216060485492 },
    ]
  }
  ```

| Campo        | Tipo   | Requerido | Descripción                                                      |
| ------------ | ------ | --------- | ---------------------------------------------------------------- |
| number       | String | ✅ Sí     | Número de Minibus                                                |
| syndicate    | String | ❌ No     | Nombre del sindicato                                             |
| points       | Array  | ✅ Sí     | Lista de puntos de la ruta {`lat`, `lon`}                        |
| vectorPoints | Array  | ✅ Sí     | Lista de puntos para graficar la linea en el mapa (`lat`, `lon`) |

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
        {
          "type":"Point",
          "coordinates":[ -68.1216060485491,-16.49094533292501],
          "_id":"685fe82322fa41696ad47e8a"
        },
        {
          "type":"Point",
          "coordinates":[ -68.1216060485494,-16.49094533292504],
          "_id":"685fe82322fa41696ad47e8a"
        },
      ],
      "__v": 0
    }
  },
  "vectorLine": {
      "_id": "33810d82b21b9638ecfd7b431",
      "vectorPoints": [
        {
          "type":"Point",
          "coordinates":[ -68.1216060485491,-16.49094533292501],
          "_id":"685fe82322fa41696ad47e8a"
        },
        {
          "type":"Point",
          "coordinates":[ -68.1216060485492,-16.49094533292502],
          "_id":"685fe82322fa41696ad47e8a"
        },
      ],
      "__v": 0
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

## GET `/api/lines/:number`

### Descripción

Obtiene la información de una línea de transporte según su número.

---

### Solicitud (Request)

- **Método**: `GET`
- **URL**: `/api/lines/:number`
- **Encabezados**: `Content-Type: application/json`

#### Parámetros de Ruta

| Parámetro | Tipo   | Requerido | Descripción                      |
| --------- | ------ | --------- | -------------------------------- |
| `number`  | String | ✅ Sí     | Número identificador de la línea |

---

### Ejemplo de Solicitud

```http
GET /api/lines/341
```

### Respuesta (Response)

```json
{
  "success": true,
  "message": "Línea obtenida correctamente",
  "data": {
    "line": {
      "_id": "665fd756d40656a45d94e96c",
      "number": "341",
      "syndicate": "21 de Septiembre",
      "points": [
        { "lat": -16.4909, "lon": -68.1216 },
        { "lat": -16.4908, "lon": -68.1217 }
      ],
      "vectorLine": {
        "_id": "665fd756d40656a45d94e96d",
        "vectorPoints": [
          { "lat": -16.4909, "lon": -68.1216 },
          { "lat": -16.49085, "lon": -68.12165 }
        ]
      }
    }
  }
}
```

### Errores

| Código | Mensaje                                        | Causa                                           |
| ------ | ---------------------------------------------- | ----------------------------------------------- |
| 400    | `El número de linea es requerido`              | Falta el parámetro `number` en la ruta.         |
| 404    | `No se encontró una línea con número {number}` | No existe una línea con ese número en la base.  |
| 500    | `Error interno del servidor`                   | Error inesperado al consultar la base de datos. |

## DELETE `/api/lines/:number`

### Descripción

Elimina una línea de transporte según su número.  
Si la línea tiene asociada una VectorLine, también se elimina.

---

### Solicitud (Request)

- **Método**: `DELETE`
- **URL**: `/api/lines/:number`
- **Encabezados**: `Content-Type: application/json`

#### Parámetros de Ruta

| Parámetro | Tipo   | Requerido | Descripción                      |
| --------- | ------ | --------- | -------------------------------- |
| `number`  | String | ✅ Sí     | Número identificador de la línea |

---

### Ejemplo de Solicitud

```http
DELETE /api/lines/341
```

### Respuesta

```json
{
  "success": true,
  "message": "Línea 341 eliminada exitosamente"
}
```

### Error

| Código | Mensaje                             | Causa                                               |
| ------ | ----------------------------------- | --------------------------------------------------- |
| 404    | `No se encontró una línea {number}` | No existe una línea con ese número.                 |
| 500    | `Error interno del servidor`        | Error al intentar eliminar la línea o sus vectores. |
