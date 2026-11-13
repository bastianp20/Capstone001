# AuraPet

**Proyecto capstone** · Equipo: Bastián Palavecino y Alan Penroz

> Nombre en evaluación: **PetAin** (posible cambio de nombre).

## ¿Qué es AuraPet?

AuraPet es una plataforma web y móvil que conecta a los dueños de mascotas con veterinarios y centros veterinarios de Chile. Reúne en un solo lugar la agenda de horas, la ficha médica de cada mascota, la comunicación entre profesionales y la adopción responsable de animales.

## El problema

Hoy pedir una hora veterinaria, encontrar atención de urgencia o revisar el historial de una mascota depende de llamadas, papeles y sistemas distintos en cada clínica. La información queda repartida, los dueños no saben qué centro puede atenderlos en una emergencia y los animales en adopción tienen poca visibilidad.

## La solución

AuraPet ofrece una plataforma única donde cada persona ve lo que necesita según su rol, con la información médica centralizada y protegida, y con herramientas públicas para urgencias y adopción que se pueden usar sin crear una cuenta.

## ¿Quiénes la usan?

- **Dueños de mascotas:** registran a sus mascotas, piden horas, revisan el historial médico y reciben avisos.
- **Veterinarios:** gestionan su agenda y horario, atienden, registran fichas, emiten recetas y derivan a otros profesionales.
- **Centros veterinarios:** administran su equipo, horario, especialidades, urgencias y el estado de su UCI.
- **Superadministrador:** aprueba cuentas, centros y refugios, y modera el contenido de la plataforma.

## Módulos principales

- **Agenda y citas:** pedir hora por especialidad, confirmar, reagendar, cancelar y bloquear horarios.
- **Ficha médica:** historial, vacunas, recetas y derivaciones, con descarga en PDF.
- **Urgencias:** página pública que muestra qué centros están abiertos y si tienen UCI disponible en tiempo real.
- **Adopción:** publicar animales, postular, elegir familia, refugios verificados y atenciones solidarias de veterinarios.
- **Suscripciones:** planes mensuales para los centros.

## Tecnologías

- **Web:** React, Vite y TypeScript.
- **App móvil:** Expo y React Native (Android).
- **Base de datos y backend:** Supabase (PostgreSQL), con reglas de seguridad en la propia base de datos.
- **Pruebas:** Vitest y Testing Library (50 archivos y 253 casos de prueba en la web).

## Organización del repositorio

- **auraPet:** aplicación web.
- **aurApp:** aplicación móvil.
- **auraPet-Backend:** base de datos, migraciones y funciones del servidor.
- **Fase 1:** evidencias académicas de la primera fase del proyecto.
Cada carpeta tiene sus propias instrucciones para instalar y ejecutar.

## Estado actual

La web y la app móvil funcionan para los cuatro roles, con agenda, fichas, urgencias y adopción. Quedan pendientes el despliegue en un hosting, los correos y notificaciones, el sistema de inteligencia artificial para priorizar urgencias y la calificación de veterinarios mediante código QR.
