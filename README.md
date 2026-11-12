# S08 | AP6 – Exposición de Servicios y Configuración Segura en Minikube

Proyecto práctico del curso **Orquestación y Automatización de Software**.

## Objetivo

Desplegar una arquitectura de dos capas (Backend + MongoDB) en Minikube, externalizando la configuración con **ConfigMaps** y **Secrets**, y exponiendo el backend mediante un servicio **NodePort**.

## Arquitectura

```
Navegador --> NodePort (30080) --> backend-service --> backend-deployment
                                                              |
                                                     mongo-service (ClusterIP)
                                                              |
                                                      mongo-deployment
```

- **MongoDB**: solo accesible dentro del clúster (ClusterIP).
- **Backend**: lee la configuración desde un ConfigMap y las credenciales desde un Secret (Base64) usando `envFrom`.
- **Exposición**: el backend se expone al exterior con NodePort (puerto 30080).

## Estructura del repositorio

```
/
├── k8s/
│   ├── 01-app-configmap.yaml   # Variables no sensibles (DB_HOST, DB_NAME, APP_PORT)
│   ├── 02-db-secret.yaml       # Credenciales en Base64 (DB_USER, DB_PASS)
│   ├── 03-mongo-stack.yaml     # Deployment + Service ClusterIP de MongoDB
│   └── 04-backend-stack.yaml   # Deployment + Service NodePort del Backend
├── src/                        # Código fuente del backend
└── README.md
```

## Requisitos previos

- Docker Desktop
- Minikube
- kubectl

## Pasos de despliegue

1. Iniciar Minikube:
   ```bash
   minikube start
   ```
2. Construir la imagen del backend dentro de Minikube:
   ```bash
   minikube image build -t backend:s08 ./src
   ```
3. Crear el namespace:
   ```bash
   kubectl create namespace practica-s08
   ```
4. Aplicar los manifiestos:
   ```bash
   kubectl apply -f k8s/
   ```
5. Verificar el estado:
   ```bash
   kubectl get pods,svc,configmaps,secrets -n practica-s08
   ```
6. Verificar la inyección de variables:
   ```bash
   kubectl exec -it <nombre-pod-backend> -n practica-s08 -- env
   ```
7. Acceder a la aplicación:
   ```bash
   minikube service backend-service -n practica-s08 --url
   ```

## Variables de entorno

| Variable | Origen | Valor |
|----------|--------|-------|
| DB_HOST | ConfigMap | mongo-service |
| DB_NAME | ConfigMap | practica_db |
| APP_PORT | ConfigMap | 3000 |
| DB_USER | Secret (Base64) | admin |
| DB_PASS | Secret (Base64) | ******** |

## Resultado esperado

```json
{
  "status": "OK",
  "message": "Backend conectado correctamente a MongoDB",
  "database": "practica_db",
  "host": "mongo-service",
  "collections": []
}
```

## Autor

Nombre: **TU NOMBRE COMPLETO**
Curso: Orquestación y Automatización de Software