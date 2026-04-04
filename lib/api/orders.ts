import { createEdgeFunction } from './client';

export const processOrder = createEdgeFunction('process-order');

export const manageCart = createEdgeFunction('manage-cart');

export const sendOrderConfirmation = createEdgeFunction('send-order-confirmation');

export const sendOrderCompleted = createEdgeFunction('send-order-completed');
