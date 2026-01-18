# LLM para Triage en Grafana: Cómo automatizar el primer análisis

<div class="date">Enero 2026</div>

---

El triage de alertas es uno de los cuellos de botella más comunes en equipos de operaciones. Cuando salta una alerta a las 3AM, lo último que quieres es perder 20 minutos entendiendo qué está pasando antes de empezar a actuar.

## El problema

En un entorno con 15+ servicios generando cientos de métricas, el volumen de alertas puede ser abrumador. El contexto importa: una alerta de CPU al 90% significa cosas muy diferentes dependiendo del servicio, la hora del día, y qué más está pasando en el sistema.

## La solución: LLM para primer análisis

He estado experimentando con integrar un LLM directamente en el flujo de alertas de Grafana. La idea:

1. **Capturar contexto** cuando salta una alerta
2. **Consultar al LLM** con el contexto histórico y la alerta actual
3. **Generar propuesta de remediación** basada en patrones anteriores

```python
def generate_triage_suggestion(alert: Alert, context: AlertContext) -> str:
    prompt = f"""
    Alerta: {alert.name}
    Servicio: {alert.service}
    Métrica: {alert.metric} = {alert.value}
    Umbral: {alert.threshold}
    
    Contexto histórico:
    - Últimas 3 alertas similares: {context.similar_alerts}
    - Remediaciones anteriores: {context.past_remediations}
    - Estado actual del servicio: {context.service_status}
    
    Propón:
    1. Causa probable
    2. Pasos de verificación
    3. Remediación sugerida
    """
    
    return llm.generate(prompt)
```

## Integración con Grafana

Grafana permite webhooks de alerta. El flujo completo:

1. Alerta salta en Grafana
2. Webhook llama a un Lambda/servicio
3. El servicio enriquece con contexto (CloudWatch, logs recientes, etc.)
4. LLM genera sugerencia
5. Resultado se publica en Slack/Teams junto con la alerta original

## Resultados

Después de 3 meses en producción:

- **-40%** tiempo medio de triage
- **+25%** de alertas resueltas en <5 minutos
- Onboarding de nuevos SREs acelerado (tienen un "copiloto")

## Consideraciones

- **Determinismo**: Usa `temperature=0` y seeds fijos para reproducibilidad
- **Hallucinations**: Siempre marca las sugerencias como "propuestas" – nunca auto-ejecutes remediaciones
- **Costes**: Con batching inteligente, el coste está en ~$50/mes incluso con alto volumen

---

*¿Preguntas? [Contacta conmigo](/about).*
