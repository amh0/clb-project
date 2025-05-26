# 🚍 API - Líneas de Transporte

## POST `/api/lineas/add`

### Descripción

Crea una nueva línea de transporte público y asocia a una lista de puntos geoespaciales (Ubicaciones).  
Si un punto ya existe (misma `lat` y `long`), se reutiliza.

---

### Solicitud (Request)

- **Método**: `POST`
- **URL**: `/api/lineas/add`
- **Encabezados**: `Content-Type: application/json`
- **Body**:
  ```JSON
  {
    "numero": "341",
    "sindicato": "21 de Septiembre",
    "puntos": [
        { "lat": 13.6929, "long": -89.2182 },
        { "lat": 13.7000, "long": -89.2100 }
    ]
  }
  ```

| Campo     | Tipo   | Requerido | Descripción                                      |
| --------- | ------ | --------- | ------------------------------------------------ |
| numero    | String | ✅ Sí     | Número de Minibus                                |
| sindicato | String | ❌ No     | Nombre del sindicato                             |
| puntos    | Array  | ✅ Sí     | Lista de id de objetos Ubicacion (`lat`, `long`) |

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
    "linea": {
      "_id": "66512a8b21b9638ecfd7b431",
      "numero": "341",
      "sindicato": "21 de Septiembre",
      "puntos": [
        "664f3e11998a3b65ddfacd1a",
        "664f3e11998a3b65ddfacd1b", ...
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

## GET `/api/lineas/all`

Obtiene todas las líneas de transporte registradas.

---

### Request

- **URL**: `/api/lineas/all`
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
      "lineas": [
        {
          "_id": "66512a8b21b9638ecfd7b431",
          "numero": "341",
          "sindicato": "21 de Septiembre",
          "puntos": ["664f3e11998a3b65ddfacd1a", "664f3e11998a3b65ddfacd1b"],
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

## GET `/api/lineas/find-close-to-point`

Obtiene las líneas de transporte cercanas a un punto geoespacial dado.  
Si el punto no existe en la base de datos, se busca el punto más cercano.

---

### Request

- **URL**: `/api/lineas/find-close-to-point`
- **Método**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "lat": 13.6929,
    "long": -89.2182
  }
  ```

| Campo     | Tipo   | Req.  | Descripción                   |
| --------- | ------ | ----- | ----------------------------- |
| lat, long | Number | ✅ Sí | Latitud del punto geoespacial |

### Respuesta (Response)

| Campo        | Tipo    | Descripción                                |
| ------------ | ------- | ------------------------------------------ |
| success      | Boolean | Indica si la operación fue exitosa         |
| message      | String  | Mensaje descriptivo de la operación        |
| data         | Object  | Información sobre el punto y las líneas    |
| closestPoint | Object  | El punto más cercano o el punto encontrado |
| lines        | Array   | Lista de líneas que contienen el punto     |

#### ✅ `200 OK`

```JSON
  {
    "success": true,
    "message": "Lineas encontradas cercanas al punto",
    "data": {
      "puntoMasCercano": {
        "_id": "664f3e11998a3b65ddfacd1a",
        "lat": 13.6929,
        "long": -89.2182,
        "location": {
          "type": "Point",
          "coordinates": [-89.2182, 13.6929]
        },
        "__v": 0
      },
      "lineas": [
        {
          "_id": "66512a8b21b9638ecfd7b431",
          "numero": "341",
          "sindicato": "21 de Septiembre",
          "puntos": ["664f3e11998a3b65ddfacd1a", "664f3e11998a3b65ddfacd1b"],
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
