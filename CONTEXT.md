# Beepr — Contexto do Domínio

Este repositório é o frontend React Native do app Beepr. Ele se conecta ao **mesmo projeto Supabase** do app legado (Capacitor), compartilhando banco de dados, Edge Functions e usuários.

- **Supabase URL**: `https://slhubwjeofitlmywworo.supabase.co`
- **Clientes existentes**: iOS (Capacitor, App Store) + este app RN

---

## Edge Functions (51)

### Autenticação
| Função | Descrição |
|---|---|
| `auth-signup` | Cria nova conta de usuário |
| `auth-signin` | Login com e-mail/senha |
| `auth-refresh` | Renova o token de sessão |
| `auth-social` | Login social (Apple, Google) |
| `verify-age` | Verificação de idade do usuário |
| `delete-account` | Exclusão da conta autenticada |
| `delete-user-by-email` | Exclusão de usuário por e-mail (admin) |

### Perfil & Preferências
| Função | Descrição |
|---|---|
| `get-profile` | Retorna o perfil do usuário autenticado |
| `update-profile` | Atualiza dados do perfil |
| `update-preferences` | Salva preferências do onboarding (strains, flavors, effects, etc.) |

### Produtos & Catálogo
| Função | Descrição |
|---|---|
| `search-products` | Busca textual de produtos |
| `get-products-by-category` | Lista produtos por categoria |
| `get-recommendations` | Recomendações personalizadas do usuário |
| `process-daily-recommendations` | Processa recomendações diárias (cron) |
| `schedule-daily-recommendations` | Agenda processamento de recomendações |
| `get-brand-catalog` | Catálogo de produtos de uma marca |
| `get-brand-analytics` | Analytics da plataforma de marca |
| `list-brand-product` | Lista produto no catálogo da marca |
| `unlist-brand-product` | Remove produto do catálogo da marca |
| `track-interaction` | Registra interação do usuário com produto |

### Negócios & Localização
| Função | Descrição |
|---|---|
| `get-nearby-businesses` | Dispensaries próximos à localização do usuário |
| `products-nearby` | Produtos disponíveis nos negócios próximos |
| `products-nearby-simple` | Versão simplificada de products-nearby |
| `geocode-search` | Geocodificação de endereço para coordenadas |
| `get-mapbox-token` | Token de acesso ao Mapbox |
| `verify-location` | Verifica se o usuário está em jurisdição legal |
| `get-jurisdiction-tax` | Retorna taxa de imposto da jurisdição |

### Favoritos
| Função | Descrição |
|---|---|
| `get-favorites` | Lista produtos favoritos do usuário |
| `check-favorite-status` | Verifica se produto é favorito |
| `toggle-favorite` | Adiciona/remove produto dos favoritos |
| `update-favorite-notes` | Atualiza notas de um favorito |
| `check-business-favorite-status` | Verifica se negócio é favorito |
| `toggle-business-favorite` | Adiciona/remove negócio dos favoritos |

### Pedidos
| Função | Descrição |
|---|---|
| `manage-cart` | Gerencia itens do carrinho |
| `process-order` | Processa e finaliza um pedido |
| `send-order-confirmation` | Envia e-mail de confirmação do pedido |
| `send-order-completed` | Envia notificação de pedido concluído |

### Avaliações
| Função | Descrição |
|---|---|
| `submit-review` | Cria uma avaliação de produto |
| `get-product-reviews` | Lista avaliações de um produto |
| `get-my-reviews` | Lista avaliações do usuário autenticado |
| `delete-review` | Remove uma avaliação |
| `mark-review-helpful` | Marca avaliação como útil |

### Notificações
| Função | Descrição |
|---|---|
| `send-push-notification` | Envia push notification diretamente |
| `notify-product-match` | Notifica match de produto com preferências |
| `notify-new-product` | Notifica sobre novo produto disponível |
| `notify-order-update` | Notifica atualização de status de pedido |
| `notify-deal-alert` | Notifica promoção/deal ativo |
| `process-notification-queue` | Processa fila geral de notificações (cron) |
| `process-new-product-queue` | Processa fila de novos produtos (cron) |
| `process-deal-alert-queue` | Processa fila de deal alerts (cron) |

### Utilitários / Migração
| Função | Descrição |
|---|---|
| `migrate-potency` | Migra categorias de potência legadas |

---

## Migrations (68 arquivos)

### Roles & Usuários
- `fix_handle_new_user_default_role`
- `migrate_existing_users_to_user_role`
- `change_user_role_to_customer`
- `update_users_to_customer_role`
- `fix_user_roles_rls_for_admins`

### Produtos & Categorias
- `create_cart_items_table`
- `add_favorite_count_to_products`
- `add_brand_name_and_restructure_product_naming`
- `add_vapes_category`
- `add_product_unit_and_category_fields`
- `migrate_old_potency_categories`
- `migrate-potency`

### Pedidos & RLS
- `fix_orders_rls_policies` (3 versões)
- `fix_order_items_rls_policies`
- `add_products_rls_policies`

### Negócios & Geo
- `create_legal_boundaries`
- `add_business_service_areas`
- `add_business_logo_url`
- `create_business_logos_bucket`
- `create_private_business_documents_bucket`
- `add_subscription_plan_to_business_applications`
- `restrict_pickup_radius_to_25_miles`
- `add_user_preferred_radius`
- `deprecate_delivery_functionality`

### Notificações (sistema completo)
- `create_notifications_system`
- `atomic_notification_dedup`
- `increase_daily_notification_limit`
- `extend_notification_dedup_window`
- `create_notification_queue`
- `fix_notification_queue_rls`
- `update_daily_limit_to_20`
- `setup_notification_cron_jobs`
- `configure_notification_cron_settings`
- `update_cron_jobs_use_config_table`
- `add_location_cache_to_notification_preferences`
- `add_settling_period_to_notification_preferences`
- `update_notification_limits_and_miles`
- `create_new_product_notification_trigger`
- `fix_notification_preferences_rls`
- `simplify_notification_trigger`
- `priority_notification_fast_lane`
- `fix_fast_lane_cron_config`
- `create_deal_alert_notification_system`

### Recomendações
- `proactive_daily_recommendations`
- `notification_improvements`

### Favoritos de Negócios
- `create_business_favorites`

### Marca / Brand Platform
- `brand_platform`
- `brand_storage_buckets`
- `allow_viewing_approved_brands`
- `fix_brand_products_best_time_of_day`

### Preferências de Usuário
- `create_user_preferences_table`
- `migrate_survey_responses_to_preferences`

### Segurança & Infraestrutura
- `security_fixes`
- `account_deletion_infrastructure`

---

## Estrutura de arquivos — lib/api

```
lib/
├── supabase.ts            ← cliente Supabase (AsyncStorage auth)
└── api/
    ├── index.ts           ← re-exporta todos os módulos
    ├── auth.ts            ← auth-signup, auth-signin, auth-refresh, auth-social, verify-age, delete-account, delete-user-by-email
    ├── profile.ts         ← get-profile, update-profile, update-preferences
    ├── products.ts        ← search-products, get-products-by-category, get-recommendations, process/schedule-daily-recommendations, get-brand-catalog/analytics, list/unlist-brand-product, track-interaction
    ├── businesses.ts      ← get-nearby-businesses, products-nearby, products-nearby-simple, geocode-search, get-mapbox-token, verify-location, get-jurisdiction-tax
    ├── favorites.ts       ← get-favorites, check/toggle-favorite, update-favorite-notes, check/toggle-business-favorite
    ├── orders.ts          ← manage-cart, process-order, send-order-confirmation, send-order-completed
    ├── reviews.ts         ← submit-review, get-product-reviews, get-my-reviews, delete-review, mark-review-helpful
    ├── notifications.ts   ← send-push-notification, notify-*, process-*-queue
    └── utils.ts           ← migrate-potency
```
