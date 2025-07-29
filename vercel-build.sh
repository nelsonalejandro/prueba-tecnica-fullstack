#!/bin/bash

# Instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd backend && npm install && cd ..

# Instalar dependencias del frontend
echo "Instalando dependencias del frontend..."
cd frontend && npm install && cd ..

# Build del backend
echo "Compilando backend..."
cd backend && npm run build && cd ..

# Build del frontend
echo "Compilando frontend..."
cd frontend && npm run build && cd ..

# Crear directorio build en la raíz para Vercel
echo "Preparando directorio de salida..."
mkdir -p build
cp -r frontend/build/* build/

echo "Build completado exitosamente!" 