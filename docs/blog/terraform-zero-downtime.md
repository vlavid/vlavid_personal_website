# Zero-Downtime Deployments con Terraform

<div class="date">Enero 2026</div>

---

Desplegar sin downtime parece obvio en 2026, pero sigue siendo un tema donde muchos equipos tropiezan. Aquí explico las estrategias que uso con Terraform en AWS.

## El problema del "destroy before create"

Por defecto, cuando cambias ciertos recursos en Terraform, primero destruye el antiguo y luego crea el nuevo. Esto significa downtime.

```hcl
# Esto causará downtime
resource "aws_instance" "app" {
  ami           = "ami-new-version"  # Cambio de AMI
  instance_type = "t3.medium"
}
```

## Solución 1: `create_before_destroy`

El lifecycle más básico pero efectivo:

```hcl
resource "aws_instance" "app" {
  ami           = "ami-new-version"
  instance_type = "t3.medium"
  
  lifecycle {
    create_before_destroy = true
  }
}
```

Terraform creará la nueva instancia primero, y solo destruirá la antigua cuando la nueva esté lista.

## Solución 2: Blue-Green con Target Groups

Para aplicaciones detrás de un ALB, la estrategia blue-green es más robusta:

```hcl
resource "aws_lb_target_group" "blue" {
  name     = "app-blue"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 10
  }
}

resource "aws_lb_target_group" "green" {
  name     = "app-green"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 10
  }
}

# Variable para controlar cuál está activo
variable "active_color" {
  default = "blue"
}

resource "aws_lb_listener_rule" "app" {
  listener_arn = aws_lb_listener.main.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = var.active_color == "blue" ? aws_lb_target_group.blue.arn : aws_lb_target_group.green.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
```

## Solución 3: Canary con pesos

Para despliegues graduales:

```hcl
resource "aws_lb_listener_rule" "canary" {
  listener_arn = aws_lb_listener.main.arn
  priority     = 100

  action {
    type = "forward"
    forward {
      target_group {
        arn    = aws_lb_target_group.stable.arn
        weight = 90
      }
      target_group {
        arn    = aws_lb_target_group.canary.arn
        weight = 10
      }
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
```

## Rollback real

El rollback no es "revertir el commit". Es tener la capacidad de volver al estado anterior en segundos:

1. **Infra inmutable**: Nunca modifiques, siempre recrea
2. **Versionado de AMIs/containers**: Cada deploy es una versión nueva
3. **Cambio de target group**: Rollback = cambiar `active_color`

```bash
# Rollback en 10 segundos
terraform apply -var="active_color=blue"
```

## Checklist pre-deploy

- [ ] Health checks configurados
- [ ] Draining timeout suficiente
- [ ] Rollback plan documentado
- [ ] Métricas de negocio en dashboard
- [ ] Alertas configuradas para el canary

---

*¿Preguntas? [Contacta conmigo](/about).*
