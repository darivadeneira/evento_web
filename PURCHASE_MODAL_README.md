# Modal de Compra de Entradas

## Descripción
El modal `PurchaseModal` es un componente completo para manejar la compra de entradas de eventos. Se integra con el sistema de selección de categorías de tickets existente.

## Características

### 📝 Campos del Formulario
- **Email**: Campo requerido con validación de formato
- **Nombre**: Campo requerido (mínimo 2 caracteres)
- **Apellido**: Campo requerido (mínimo 2 caracteres)
- **Cédula**: Campo requerido (8-12 dígitos)
- **Método de Pago**: Por defecto "Transacción Bancaria"
  - Transacción Bancaria
  - Tarjeta de Crédito
  - PayPal

### 🎫 Funcionalidades
- **Resumen automático**: Muestra el evento, categorías seleccionadas y total
- **Validación de formulario**: Validación en tiempo real de todos los campos
- **Integración con API**: Envía la compra al endpoint `/ticket-purchase`
- **Notificaciones**: Snackbar de éxito/error
- **Loading states**: Indicadores de carga durante el proceso

### 📊 Datos Enviados al API
```typescript
{
  eventId: number,           // ID del evento (automático)
  email: string,             // Email del comprador
  firstName: string,         // Nombre del comprador
  lastName: string,          // Apellido del comprador
  cedula: string,           // Cédula del comprador
  paymentMethod: string,     // Método de pago seleccionado
  tickets: [                // Array de categorías y cantidades
    {
      categoryId: string,    // ID de la categoría
      quantity: number       // Cantidad seleccionada
    }
  ],
  totalAmount: number,       // Total calculado
  userId: number | null      // ID del usuario logueado (opcional)
}
```

## Integración

### En TicketCategoriesPanel
El modal se integra reemplazando el `alert` anterior con el modal completo:

```tsx
// Antes
onClick={() => {
  alert(`Comprando tickets por un total de $${totalAmount.toFixed(2)}`);
}}

// Ahora
onClick={handlePurchaseClick}
```

### Props requeridos
```tsx
<PurchaseModal
  open={purchaseModalOpen}
  onClose={() => setPurchaseModalOpen(false)}
  onPurchaseComplete={handlePurchaseComplete}
  eventId={eventId}           // Se pasa desde EventDetails
  eventName={eventName}       // Se pasa desde EventDetails
  ticketCategories={ticketCategories}
  ticketQuantities={ticketQuantities}
  totalAmount={totalAmount}
/>
```

## Validaciones

### Email
- Campo requerido
- Formato de email válido

### Nombre y Apellido
- Campos requeridos
- Mínimo 2 caracteres cada uno

### Cédula
- Campo requerido
- Entre 8 y 12 dígitos numéricos

### Entradas
- Debe haber al menos una entrada seleccionada
- Validación automática de disponibilidad

## Estados del Modal

1. **Inicial**: Formulario vacío, método de pago por defecto
2. **Validación**: Errores mostrados en tiempo real
3. **Enviando**: Loading state con botón deshabilitado
4. **Éxito**: Snackbar de confirmación y cierre automático
5. **Error**: Alert con mensaje de error específico

## Archivos Creados/Modificados

### Nuevos archivos:
- `/src/components/events/payment/PurchaseModal.tsx` - Modal principal
- `/src/types/purchase.type.ts` - Tipos TypeScript
- `/src/providers/purchase.provider.ts` - Provider para API

### Archivos modificados:
- `TicketCategoriesPanel.tsx` - Integración del modal
- `EventDetails.tsx` - Pase de props adicionales

## API Endpoint Esperado

```typescript
POST /ticket-purchase
Content-Type: application/json

{
  "eventId": 123,
  "email": "usuario@email.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "cedula": "12345678",
  "paymentMethod": "transaccion_bancaria",
  "tickets": [
    { "categoryId": "cat1", "quantity": 2 },
    { "categoryId": "cat2", "quantity": 1 }
  ],
  "totalAmount": 150.00,
  "userId": 456
}
```

## Respuesta Esperada

```typescript
{
  "id": 789,
  "status": "completed",
  "transactionId": "TXN123456",
  "message": "Compra realizada exitosamente"
}
```
