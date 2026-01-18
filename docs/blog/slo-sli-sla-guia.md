# SLO, SLI, SLA: Guía práctica para equipos de plataforma

<div class="date">Enero 2026</div>

---

Los términos SLO, SLI y SLA se usan mucho pero se entienden poco. Esta guía va al grano con ejemplos reales.

## Definiciones rápidas

| Término | Significado | Ejemplo |
|---------|-------------|---------|
| **SLI** | Service Level Indicator | "Latencia p99 del endpoint /api/orders" |
| **SLO** | Service Level Objective | "p99 latencia < 200ms el 99.9% del tiempo" |
| **SLA** | Service Level Agreement | "Si no cumplimos, devolvemos el 10% de la factura" |

La relación:
- **SLI** = Lo que mides
- **SLO** = El objetivo interno
- **SLA** = El contrato externo (con penalizaciones)

## Cómo elegir buenos SLIs

Un buen SLI tiene estas características:

1. **Medible**: Tiene que poder capturarse automáticamente
2. **Relevante**: Impacta la experiencia del usuario
3. **Accionable**: Si el SLI baja, sabes qué revisar

### Los 4 Golden Signals (Google SRE)

1. **Latency**: Tiempo de respuesta
2. **Traffic**: Volumen de requests
3. **Errors**: Tasa de errores
4. **Saturation**: Uso de recursos

```yaml
# Ejemplo de SLI en Prometheus
- name: api_latency_p99
  expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  
- name: error_rate
  expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```

## Definiendo SLOs realistas

El error más común: poner SLOs demasiado ambiciosos.

### La trampa del 99.99%

| SLO | Downtime permitido/mes |
|-----|------------------------|
| 99% | 7.2 horas |
| 99.9% | 43 minutos |
| 99.99% | 4.3 minutos |
| 99.999% | 26 segundos |

Pregunta: ¿Realmente necesitas 99.99%? ¿Tienes la infra, el equipo, y el presupuesto para mantenerlo?

### Recomendación práctica

1. Empieza con lo que tienes ahora (mide 2-4 semanas)
2. Define SLO alcanzable (ligeramente mejor que el baseline)
3. Itera cada trimestre

## Error budget

El error budget es lo que hace que SLOs sean accionables:

```
Error Budget = 100% - SLO

Si SLO = 99.9%
Error Budget = 0.1% del tiempo
En un mes = 43 minutos de "margen"
```

Reglas del error budget:

- **Budget > 50%**: Puedes deployar con confianza, experimentar
- **Budget 20-50%**: Precaución, prioriza estabilidad
- **Budget < 20%**: Freeze de features, solo fixes
- **Budget = 0%**: Postmortem obligatorio

## Dashboard mínimo

Un dashboard de SLO debe tener:

1. **SLI actual** (últimas 24h/7d/30d)
2. **SLO target** (línea horizontal)
3. **Error budget restante** (barra o gauge)
4. **Tendencia** (¿vamos mejorando o empeorando?)

```sql
-- Ejemplo de query para error budget
SELECT 
  1 - (
    SUM(CASE WHEN latency_p99 > 200 THEN 1 ELSE 0 END) / 
    COUNT(*)
  ) as current_slo,
  0.999 as target_slo,
  (0.999 - current_slo) / 0.001 * 100 as error_budget_pct_remaining
FROM metrics
WHERE timestamp > NOW() - INTERVAL '30 days'
```

## Checklist para empezar

- [ ] Identifica 2-3 servicios críticos
- [ ] Define 1 SLI por cada Golden Signal
- [ ] Mide 2 semanas sin SLO (baseline)
- [ ] Define SLO inicial (conservador)
- [ ] Crea dashboard con error budget
- [ ] Revisa mensualmente

---

*¿Preguntas? [Contacta conmigo](/about).*
