# Beepr Native

Aplicativo mobile em React Native (Expo) para descoberta de produtos de cannabis, onboarding de preferências, geolocalização de dispensaries próximos, favoritos, pedidos, avaliações e notificações personalizadas.

Este app é a versão nativa do Beepr e integra com o mesmo backend Supabase já utilizado no ecossistema do produto (Auth, banco, RLS, Edge Functions e filas de notificações).

## Objetivo do projeto

O projeto existe para entregar uma experiência mobile moderna, com fluxo completo de autenticação e onboarding, conectada a recomendações e conteúdo local baseado em localização do usuário.

## Status de Entrega

### ✅ WEEK 1 — Foundation & Native Infra (CONCLUÍDA)

#### 1) Ambiente nativo (Expo Bare Workflow)
- Build nativo Android gerado via `npx expo prebuild`.
- `android/` com `AndroidManifest.xml`, `build.gradle` e Hermes configurados.
- `app.json` com `newArchEnabled: true`, plugins nativos de location e notifications.
- Permissões declaradas: `ACCESS_BACKGROUND_LOCATION`, `FOREGROUND_SERVICE_LOCATION`, `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`.
- iOS: `UIBackgroundModes: ["location", "fetch", "remote-notification"]` e strings de permissão configuradas.
- Custom URL scheme `beepr://` + `router.origin` configurado para deep links universais.

#### 2) Geolocalização persistente em background
- `lib/tasks/backgroundLocation.ts` — task registrada no top-level via `TaskManager.defineTask`.
- Atualização a cada 60s ou 50m (equilíbrio bateria/precisão).
- Android: `foregroundService` com notificação persistente obrigatória pelo OS.
- iOS: `showsBackgroundLocationIndicator` (pílula azul da barra de status).
- Cache de localização persistido direto na tabela `notification_preferences` (compatível com o app Capacitor legado, sem mudança de schema).
- `setup-location.tsx` conectado ao SDK real: solicita permissão nativa, inicia background task e salva primeira posição no Supabase antes de prosseguir no onboarding.

#### 3) Push Notifications via FCM/APNs com deep-linking
- `lib/push-notifications.ts` — registro de token, canais Android (`default`, `deals`, `orders`), handler de foreground.
- Token Expo persistido em `user_push_tokens` via upsert (`user_id, token` como constraint única).
- Deep-link funcional: `handleNotificationResponse` roteia para qualquer tela via `router.push(data.screen)`.
- `AndroidManifest.xml` com meta-data FCM e intent filter para `beepr://`.
- `_layout.tsx` orquestra registro de token, listeners de notificação e importação top-level da background task.

#### 4) PostGIS — Substituição do Haversine (adiantado da Week 4)
- Migration `20260403000000_add_nearby_businesses_rpc.sql` **aplicada em produção** via SQL Editor.
- Coluna `location geography(Point, 4326)` adicionada em `business_applications`.
- Trigger `trg_sync_business_location` mantém a coluna sincronizada automaticamente.
- Índice GIST espacial para queries de proximidade em O(log n).
- RPC `nearby_businesses(p_lat, p_lon, p_limit)` disponível para o app — usa `ST_DWithin` no índice, sem full-table scan.
- App Capacitor (produção iOS) **não é afetado** — as alterações são 100% aditivas.

#### 5) Camada de API centralizada
- `lib/api/client.ts` — `createEdgeFunction`, `ApiClientError`, `ApiResponse<T>` tipado.
- Todos os 9 módulos (`auth`, `profile`, `products`, `businesses`, `favorites`, `orders`, `reviews`, `notifications`, `utils`) migrados para o padrão `createEdgeFunction`.
- `lib/supabase.ts` — `getRequiredEnv` garante fail-fast com mensagem clara se variáveis de ambiente estiverem ausentes.

#### 6) Fluxo de autenticação e onboarding completo
- Telas: Login, Registro, Verificação.
- Onboarding: nome, telefone, data de nascimento, experiência, potência, formatos, strains, flavors, efeitos, localização (SDK real), notificações, range, loading/análise, setup-complete.
- `app/admin/_layout.tsx` — estrutura da seção admin criada.

## Stack atual

- React Native 0.81
- Expo SDK 54
- Expo Router 6
- React 19
- TypeScript 5.9
- NativeWind 4 + Tailwind CSS 3
- Supabase JS 2

## Estrutura resumida

```text
app/                  # Rotas e telas (auth + onboarding)
lib/                  # Cliente Supabase, APIs e tarefas
integrations/supabase # Tipagens e integrações
supabase/functions/   # Edge Functions
supabase/migrations/  # Migrações SQL
android/              # Projeto nativo Android (prebuild)
```

## Como rodar localmente

### Pré-requisitos
- Node.js LTS
- npm
- Expo CLI (via `npx expo`)
- Android Studio (para emulador Android)

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run start
```

### Android

```bash
npm run android
```

## Scripts disponíveis

- `npm run start` - inicia o Metro/Expo
- `npm run start:tunnel` - inicia com tunnel
- `npm run android` - executa build/run Android
- `npm run ios` - executa build/run iOS (em ambiente compatível)

## Estado atual

Week 1 do roadmap 100% concluída e deployada em produção.
Próximo milestone: **Week 2–3 — Native UI & Matching Optimization**.
Veja `PROXIMOS-PASSOS.md` para instruções detalhadas.
