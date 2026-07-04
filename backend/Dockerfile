# Usar una imagen oficial de Node liviana
FROM node:20-slim

# Crear el directorio de trabajo de la app
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto por defecto de Cloud Run (8080)
EXPOSE 8080
ENV PORT=8080

# Comando de inicio
CMD [ "npm", "start" ]
