import { createEdgeFunction } from './client';

export const sendPushNotification = createEdgeFunction('send-push-notification');

export const notifyProductMatch = createEdgeFunction('notify-product-match');

export const notifyNewProduct = createEdgeFunction('notify-new-product');

export const notifyOrderUpdate = createEdgeFunction('notify-order-update');

export const notifyDealAlert = createEdgeFunction('notify-deal-alert');

export const processNotificationQueue = createEdgeFunction('process-notification-queue');

export const processNewProductQueue = createEdgeFunction('process-new-product-queue');

export const processDealAlertQueue = createEdgeFunction('process-deal-alert-queue');
