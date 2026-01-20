# Construyendo Agentes con Spring AI y AWS Bedrock

<div class="date">Enero 2026</div>

---

Java ha vuelto al juego de la IA. Con **Spring AI**, el ecosistema enterprise por excelencia ahora tiene una abstracción nativa para orquestar LLMs, y cuando lo combinas con la potencia de **AWS Bedrock**, tienes una plataforma robusta para construir agentes autónomos reales.

## ¿Qué es un Agente en 2026?

Ya no hablamos solo de "chatbots". Un agente es un sistema con:
1.  **Razonamiento**: Usa un LLM para planificar.
2.  **Tools**: Puede ejecutar código, llamar APIs o consultar bases de datos.
3.  **Memoria**: Recuerda el contexto y estado.
4.  **Autonomía**: Decide los pasos para resolver una tarea compleja.

## Arquitectura de Referencia

Imagina un sistema de soporte que no solo responde, sino que *actúa*.

```mermaid
graph LR
    User[Usuario] --> API[Spring Boot API]
    subgraph Spring AI Agent
        Orchestrator[Orquestador]
        Tools[Function Calling]
        Memory[Vector Store]
    end
    API --> Orchestrator
    Orchestrator <-->|Inference| Bedrock[AWS Bedrock]
    Tools <-->|Action| AWS[AWS SDK (Lambda, DynamoDB)]
    Memory <-->|Context| OS[OpenSearch Serverless]
```

## Spring AI + AWS Bedrock: El Combo Enterprise

Spring AI nos da la interfaz estandarizada `ChatClient`, pero la magia ocurre al inyectar el modelo de Bedrock (ej. Claude 3.5 Sonnet o Titan).

### Dependencias

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-bedrock-ai-starter</artifactId>
</dependency>
```

### El Agente (Function Calling)

Lo más potente es definir "Herramientas" como simples Beans de Java. Spring AI se encarga de serializar la firma de la función y pasársela al LLM.

```java
@Configuration
public class AgentConfig {

    @Bean
    @Description("Consulta el estado de un pedido en DynamoDB")
    public Function<OrderRequest, OrderStatus> checkOrderStatus() {
        return request -> orderService.getStatus(request.id());
    }
}
```

Luego, al invocar el chat:

```java
var response = chatClient.prompt()
    .user("¿Dónde está mi pedido #12345?")
    .functions("checkOrderStatus") // El LLM decidirá si llamar a esto
    .call()
    .content();
```

## Por qué AWS para esto?

1.  **Privacidad**: Tus datos nunca salen de tu VPC si usas PrivateLink con Bedrock.
2.  **IAM Roles**: Puedes asignar permisos granulares al agente (ej. "solo puede leer DynamoDB", no escribir).
3.  **Latencia**: Al correr tu Spring Boot en ECS/EKS cerca de Bedrock (us-east-1), la latencia es mínima.

## Conclusión

Estamos moviéndonos de RAG (Retrieval Augmented Generation) a **Agentic Workflows**. Spring AI hace que integrar estos flujos en tu arquitectura Java existente sea trivial, sin tener que reescribir todo en Python.

---
*¿Quieres ver el código completo? [Revisa mis proyectos](/projects).*
