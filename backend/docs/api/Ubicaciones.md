# 🚍 API - Ubicaciones

## GET `/api/ubicaciones/all`

Obtiene todas las Ubicaciones registradas.

---

### Request

- **URL**: `/api/ubicaciones/all`
- **Método**: `GET`
- **Headers**: `Content-Type: application/json`

### Respuesta (Response)

| Campo   | Tipo    | Descripción                         |
| ------- | ------- | ----------------------------------- |
| success | Boolean | Indica si la operación fue exitosa  |
| message | String  | Mensaje descriptivo de la operación |
| data    | Object  | Ubicaciones encontradas             |

#### ✅ `200 OK`

```JSON
  {
    "success": true,
    "message": "Ubicaciones obtenidas",
    "data": {
        "ubicaciones": [
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
                "long": -68.108191,
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
                "long": -68.107614,
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
