# 🚍 API - Puntos

## GET `/api/points/all`

Obtiene todos los Puntos registrados.

---

### Request

- **URL**: `/api/points/all`
- **Método**: `GET`
- **Headers**: `Content-Type: application/json`

### Respuesta (Response)

| Campo   | Tipo    | Descripción                         |
| ------- | ------- | ----------------------------------- |
| success | Boolean | Indica si la operación fue exitosa  |
| message | String  | Mensaje descriptivo de la operación |
| data    | Object  | Puntos encontradas                  |

#### ✅ `200 OK`

```JSON
  {
    "success": true,
    "message": "Puntos obtenidos",
    "data": {
        "points": [
            {
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -68.108191,
                        -16.526177
                    ]
                },
                "_id": "6833a262ad3dbf871f79bb4a",
                "lat": -16.526177,
                "lon": -68.108191,
                "__v": 0
            },
            {
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -68.107614,
                        -16.526458
                    ]
                },
                "_id": "6833a262ad3dbf871f79bb48",
                "lat": -16.526458,
                "lon": -68.107614,
                "__v": 0
            },...

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

## GET `/api/points/closest-point`

Obtiene el puntos mas cercano a un punto enviado.

---

### Request

- **URL**: `/api/points/closest-point`
- **Método**: `GET`
- **Headers**: `Content-Type: application/json`

### Respuesta (Response)

| Campo   | Tipo    | Descripción                         |
| ------- | ------- | ----------------------------------- |
| success | Boolean | Indica si la operación fue exitosa  |
| message | String  | Mensaje descriptivo de la operación |
| data    | Object  | Punto mas cercano                   |

#### ✅ `200 OK`

```JSON
  {
    "success": true,
    "message": "Punto más cercano encontrado",
    "data": {
        "point": [
            {
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -68.108191,
                        -16.526177
                    ]
                },
                "_id": "6833a262ad3dbf871f79bb4a",
                "lat": -16.526177,
                "lon": -68.108191,
                "__v": 0
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
