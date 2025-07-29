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

echo "Build completado exitosamente!" 