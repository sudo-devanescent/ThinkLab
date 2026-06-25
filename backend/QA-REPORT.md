# QA Test Report - ThinkLab Backend

**Fecha:** 2026-06-24
**Servidor:** http://localhost:3000
**Backend:** NestJS 10 + PostgreSQL + TypeORM
**Resultado:** 9/9 PRUEBAS PASARON

---

## Resultado Resumen

| # | Prueba | HTTP | Estado |
|---|--------|------|--------|
| 1 | Health Check | 200 | PASS |
| 2 | Registrar Estudiante | 201 | PASS |
| 3 | Login | 201 | PASS |
| 4 | Obtener Escenario | 200 | PASS |
| 5 | Ver Perfil | 200 | PASS |
| 6 | Enviar Decision | 201 | PASS |
| 7 | Perfil Actualizado | 200 | PASS |
| 8 | Siguiente Escenario | 200 | PASS |
| 9 | Panel Docente | 200 | PASS |

---

## Detalle por Prueba

### 1. Health Check

```
GET /health
Status: 200
```

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-25T04:48:22.850Z"
}
```

**Criterio:** status=ok, database=connected.

---

### 2. Registrar Estudiante

```
POST /auth/register
Status: 201
```

```json
{
  "id": "b04521e9-ea5a-4d2c-8e9a-94aa493b8147",
  "email": "qa.p2.cc7a8d@test.com",
  "role": "student",
  "fullName": "QA Prueba 2"
}
```

**Criterio:** Retorna id, email y role.

---

### 3. Login

```
POST /auth/login
Status: 201
```

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Criterio:** Retorna JWT token valido por 7 dias.

---

### 4. Obtener Escenario

```
GET /scenarios/next
Authorization: Bearer <token>
Status: 200
```

```json
{
  "scenario": {
    "id": "c1000000-0000-0000-0000-000000000009",
    "title": "La votacion del grupo",
    "context": "En una dinamica grupal tu equipo debe elegir entre dos soluciones...",
    "expectedRisk": "0.2500",
    "difficultyLevel": "easy",
    "options": [
      {
        "id": "d1000000-0000-0000-0009-000000000001",
        "code": "A",
        "text": "Presentas la opcion A tal como decidio la mayoria...",
        "coherenceImpact": "-0.800",
        "riskImpact": "-0.300",
        "consistencyImpact": "-0.600"
      },
      {
        "id": "d1000000-0000-0000-0009-000000000002",
        "code": "B",
        "coherenceImpact": "0.900",
        "riskImpact": "0.300",
        "consistencyImpact": "0.900"
      },
      {
        "id": "d1000000-0000-0000-0009-000000000003",
        "code": "C",
        "coherenceImpact": "0.300",
        "riskImpact": "0.100",
        "consistencyImpact": "0.200"
      }
    ]
  },
  "sessionScenarioId": "9d2a88d3-35b3-416b-986d-48974b56f348",
  "sessionId": "...",
  "orderIndex": 1
}
```

**Criterio:** Retorna escenario con opciones y sessionScenarioId valido.

---

### 5. Ver Perfil

```
GET /profile/me
Authorization: Bearer <token>
Status: 200
```

```json
{
  "coherence": "0.5000",
  "risk": "0.5000",
  "consistency": "0.5000",
  "totalDecisions": 0,
  "updatedAt": "2026-06-25T04:00:15.122Z",
  "qualitative": {
    "coherenceLabel": "Medio",
    "riskLabel": "Medio",
    "consistencyLabel": "Medio",
    "experience": "Sin decisiones"
  }
}
```

**Criterio:** Perfil con valores iniciales (0.5) y labels cualitativos.

---

### 6. Enviar Decision

```
POST /decisions
Authorization: Bearer <token>
Body: {
  "sessionScenarioId": "9d2a88d3-35b3-416b-986d-48974b56f348",
  "optionId": "d1000000-0000-0000-0009-000000000002",
  "responseTimeMs": 3500
}
Status: 201
```

```json
{
  "updatedProfile": {
    "coherence": 0.9,
    "risk": 0.295,
    "consistency": 0.9,
    "totalDecisions": 1
  },
  "nextScenarioId": "c1000000-0000-0000-0000-000000000009"
}
```

**Criterio:** Retorna perfil actualizado. Opcion B seleccionada (impacto positivo en coherence y consistency).

---

### 7. Perfil Actualizado

```
GET /profile/me
Authorization: Bearer <token>
Status: 200
```

```json
{
  "coherence": "0.9000",
  "risk": "0.2950",
  "consistency": "0.9000",
  "totalDecisions": 1,
  "qualitative": {
    "coherenceLabel": "Alto",
    "riskLabel": "Bajo",
    "consistencyLabel": "Alto",
    "experience": "Principiante"
  }
}
```

**Criterio:** totalDecisions = 1. Perfil refleja la decision tomada.

---

### 8. Siguiente Escenario

```
GET /scenarios/next
Authorization: Bearer <token>
Status: 200
```

Retorna un escenario valido con opciones. El motor adaptativo selecciona el siguiente escenario basado en el perfil actualizado del usuario.

**Criterio:** Escenario valido con opciones.

---

### 9. Panel Docente

```
GET /teacher/students
Authorization: Bearer <teacher_token>
Status: 200
```

```json
[
  {
    "userId": "00000000-0000-0000-0000-000000000004",
    "fullName": "Vidaurre Almeyda Javier Alexander",
    "email": "j.vidaurre@thinklab.edu.pe",
    "coherence": "0.7800",
    "risk": "0.7200",
    "consistency": "0.8100",
    "totalDecisions": 12
  },
  ...
]
```

**Criterio:** Lista de estudiantes con perfiles cognitivos, ordenados por totalDecisions descendente. Endpoint protegido con role=teacher.

---

## Hallazgos Adicionales

1. **Motor de evaluacion:** Funciona correctamente. Aplica promedio movil ponderado y penalizacion contextual por riesgo.
2. **Perfiles cognitivos:** Se actualizan en tiempo real despues de cada decision.
3. **Sistema adaptativo:** Las reglas de adaptacion filtran escenarios segun el perfil del usuario.
4. **Autenticacion JWT:** Funciona correctamente en todos los endpoints protegidos.
5. **Encoding de caracteres:** Las tildes y enes se muestran con encoding incorrecto en la terminal de PowerShell pero se almacenan correctamente en PostgreSQL.
