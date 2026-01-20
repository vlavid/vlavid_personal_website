terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # Low latency generally, or pick your region
}

variable "project_name" {
  default = "vlavid-newsletter"
}

# --- DynamoDB ---
resource "aws_dynamodb_table" "subscribers" {
  name           = "${var.project_name}-subscribers"
  billing_mode   = "PAY_PER_REQUEST" # Free tier friendly
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }
}

# --- Lambda ---
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/src/index.js"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "dynamodb_access" {
  name = "dynamodb_access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "dynamodb:PutItem",
        "dynamodb:GetItem"
      ]
      Effect   = "Allow"
      Resource = aws_dynamodb_table.subscribers.arn
    }]
  })
}

resource "aws_lambda_function" "api" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project_name}-api"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.subscribers.name
    }
  }
}

# --- API Gateway v2 (HTTP) ---
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["*"] # Lock this down to https://vlavid.github.io in prod
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "subscribe" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /subscribe"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*/subscribe"
}

# --- Outputs ---
output "api_endpoint" {
  value = "${aws_apigatewayv2_api.main.api_endpoint}/subscribe"
}
