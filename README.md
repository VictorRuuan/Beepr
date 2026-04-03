# Beepr Native

Aplicativo mobile em React Native (Expo) para descoberta de produtos de cannabis, onboarding de preferências, geolocalização de dispensaries próximos, favoritos, pedidos, avaliações e notificações personalizadas.

Este app é a versão nativa do Beepr e integra com o mesmo backend Supabase já utilizado no ecossistema do produto (Auth, banco, RLS, Edge Functions e filas de notificações).

## Objetivo do projeto

O projeto existe para entregar uma experiência mobile moderna, com fluxo completo de autenticação e onboarding, conectada a recomendações e conteúdo local baseado em localização do usuário.

## O que já foi feito

### 1) Base do app e infraestrutura
- Estrutura principal do app com Expo + Expo Router.
- Configuração de NativeWind/Tailwind para estilização.
- Integração com Supabase (`@supabase/supabase-js`).
- Suporte a AsyncStorage para persistência de sessão.
- Setup nativo Android (`android/`) com prebuild do Expo já executado.

### 2) Fluxo de autenticação
- Telas e navegação para:
  - Login
  - Registro
  - Verificação
- Camada de API para autenticação via Edge Functions:
  - `auth-signup`
  - `auth-signin`
  - `auth-refresh`
  - `auth-social`

### 3) Onboarding completo
- Sequência de telas de setup implementadas:
  - nome
  - telefone
  - data de nascimento
  - experiência
  - potência
  - formatos
  - strains
  - flavors
  - efeitos
  - localização
  - notificações
  - faixa/range
  - telas de loading/análise
- Fluxo de preferências preparado para persistência via backend.

### 4) Geolocalização e tarefas
- Dependências instaladas e integradas para:
  - `expo-location`
  - `expo-task-manager`
  - `expo-notifications`
  - `expo-device`
  - `expo-application`
- Base para coleta de localização e execução de tarefas em background.

### 5) APIs de domínio organizadas em módulos
Camada de API em `lib/api/` separada por contexto de negócio:
- `auth.ts`
- `profile.ts`
- `products.ts`
- `businesses.ts`
- `favorites.ts`
- `orders.ts`
- `reviews.ts`
- `notifications.ts`
- `utils.ts`

### 6) Backend Supabase conectado
- Estrutura de Edge Functions extensa em `supabase/functions/` cobrindo:
  - autenticação
  - perfil/preferências
  - busca/recomendação de produtos
  - negócios próximos e geocoding
  - favoritos
  - pedidos
  - avaliações
  - notificações e filas assíncronas
- Conjunto de migrations em `supabase/migrations/` para evolução de schema, RLS e features de negócio.

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

Projeto em fase ativa de evolução, com:
- fundação técnica concluída
- autenticação e onboarding implementados
- integrações principais com Supabase prontas
- base de localização/notificações já estabelecida

Próximas etapas típicas incluem acabamento de UX, validações finais de fluxo, testes e publicação das versões mobile.
