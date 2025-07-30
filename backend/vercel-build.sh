#!/bin/bash

# Instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd backend || exit
npm install

# Compilar el backend
echo "Compilando backend..."
npm run build

echo "Build del backend completado exitosamente!"