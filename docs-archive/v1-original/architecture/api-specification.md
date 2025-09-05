# API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Sabron Trip Sync API
  version: 1.0.0
  description: Auto-generated PostgREST API for Trip Sync v2
servers:
  - url: https://your-project.supabase.co/rest/v1
    description: Supabase PostgREST API

paths:
  /trips:
    get:
      summary: List user's trips
      parameters:
        - name: select
          in: query
          schema:
            type: string
          example: "*,trip_members(user:users(*))"
        - name: trip_members.user_id
          in: query
          schema:
            type: string
          example: eq.{user_id}
      security:
        - BearerAuth: []
    post:
      summary: Create new trip
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TripInput'
      security:
        - BearerAuth: []
  
  /expenses:
    get:
      summary: List expenses for a trip
      parameters:
        - name: trip_id
          in: query
          required: true
          schema:
            type: string
        - name: select
          in: query
          schema:
            type: string
          example: "*,user:users(*),splits:expense_splits(*)"
      security:
        - BearerAuth: []
    post:
      summary: Create expense
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExpenseInput'
      security:
        - BearerAuth: []
  
  /rpc/calculate_trip_balances:
    post:
      summary: Calculate current balances for trip
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                p_trip_id:
                  type: string
                  format: uuid
      security:
        - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  
  schemas:
    TripInput:
      type: object
      required: [name, start_date, end_date]
      properties:
        name:
          type: string
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        settings:
          type: object
    
    ExpenseInput:
      type: object
      required: [trip_id, amount, currency, category]
      properties:
        trip_id:
          type: string
          format: uuid
        amount:
          type: number
        currency:
          type: string
        category:
          type: string
        description:
          type: string
```
