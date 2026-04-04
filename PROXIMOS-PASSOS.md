# Próximos Passos — Beepr Native

> **Para quem é esse documento:** Desenvolvedor que vai dar continuidade ao projeto a partir da Week 2.
> A Week 1 foi concluída pela Clariana. Este documento descreve exatamente o que falta fazer, onde está o código relevante e como proceder sem quebrar o que já está em produção.

---

## Contexto rápido

- O app React Native (este repo) compartilha o **mesmo Supabase** do app Capacitor que está na App Store.
- Toda alteração de banco deve ser **aditiva** (não renomear, não deletar colunas existentes).
- O backend (Edge Functions + banco) já está em produção em `https://slhubwjeofitlmywworo.supabase.co`.
- Variáveis de ambiente estão no arquivo `.env` na raiz — não commitar.

---

## O que já foi entregue (Week 1)

| Item | Arquivo(s) |
|---|---|
| Expo Bare Workflow nativo Android | `android/`, `app.json` |
| Geolocalização persistente em background | `lib/tasks/backgroundLocation.ts` |
| Push Notifications FCM/APNs + deep-link | `lib/push-notifications.ts`, `app/_layout.tsx` |
| PostGIS RPC `nearby_businesses` em produção | `supabase/migrations/20260403000000_add_nearby_businesses_rpc.sql` |
| Camada de API tipada e centralizada | `lib/api/client.ts` + todos os módulos em `lib/api/` |
| Onboarding completo conectado ao SDK real | `app/setup-location.tsx` e demais telas de setup |

---

## WEEK 2–3: Native UI & Matching Optimization

### Tarefa 1 — Migrar telas para NativeWind (Tailwind para React Native)

**Contexto:** As telas de onboarding usam `StyleSheet.create` nativo. O objetivo é migrar para classes NativeWind para ter paridade de design com o sistema de design do app Capacitor e facilitar manutenção.

**O que fazer:**
- NativeWind 4 já está instalado e configurado (`tailwind.config.js`, `global.css`, `nativewind-env.d.ts`).
- Migrar as telas do `app/` uma a uma substituindo `StyleSheet` por classes Tailwind (`className="..."`).
- Começar pelas telas de onboarding (`setup-*.tsx`) e depois auth (`login.tsx`, `register.tsx`).
- Criar componentes reutilizáveis em `app/components/ui/` para botões e inputs (alguns já foram criados pelo Victor no branch `victor-organizacao-e-tela`).

**Referência de mapeamento:**

| StyleSheet | NativeWind equivalente |
|---|---|
| `flex: 1, backgroundColor: '#130008'` | `className="flex-1 bg-[#130008]"` |
| `alignItems: 'center', justifyContent: 'center'` | `className="items-center justify-center"` |
| `paddingHorizontal: 24` | `className="px-6"` |
| `color: '#c4185c'` | `className="text-[#c4185c]"` |

**Arquivos a modificar:** todos em `app/`.

---

### Tarefa 2 — Migrar algoritmos de matching para RPCs no banco

**Contexto:** O relatório técnico identificou que cálculos de matching acontecem no cliente (Edge Function), gerando overhead. A Week 2-3 prevê mover isso para RPCs PostgreSQL.

**O que fazer:**

1. Identificar a lógica de matching em `supabase/functions/get-recommendations/index.ts` (no repo legado ou nas Edge Functions deste repo).
2. Criar uma nova migration em `supabase/migrations/` com uma função SQL:

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_product_matching_rpc.sql
CREATE OR REPLACE FUNCTION match_products_for_user(p_user_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE (...) LANGUAGE sql STABLE SECURITY DEFINER AS $$
  -- lógica de matching baseada em user_preferences
$$;
```

3. **Como aplicar a migration com segurança:**
   - NÃO usar `supabase db push` (risco para produção compartilhada).
   - Copiar o SQL e rodar no **SQL Editor do Dashboard**: [https://supabase.com/dashboard/project/slhubwjeofitlmywworo/sql/new](https://supabase.com/dashboard/project/slhubwjeofitlmywworo/sql/new)

4. Atualizar a Edge Function `get-recommendations` para chamar o RPC em vez de processar no JavaScript.
5. Atualizar `lib/api/products.ts` se a assinatura da chamada mudar.

---

### Tarefa 3 — Atualizar a Edge Function `get-nearby-businesses` para usar o RPC PostGIS

**Contexto:** A migration PostGIS foi aplicada na Week 1, mas a Edge Function `get-nearby-businesses` ainda usa o loop Haversine em JavaScript. Precisa ser atualizada para chamar o RPC.

**O que fazer:**

Editar `supabase/functions/get-nearby-businesses/index.ts` (no repo do backend ou nas functions deste repo) substituindo a lógica de distância por:

```typescript
const { data, error } = await supabase.rpc('nearby_businesses', {
  p_lat: userLat,
  p_lon: userLon,
  p_limit: 6,
});
```

O RPC já está em produção e retorna: `id`, `business_name`, `business_city`, `business_state`, `business_address`, `business_phone`, `business_logo_url`, `hours_of_operation`, `pickup_radius_miles`, `retailer_type`, `distance_miles`.

---

## WEEK 4: POS-Readiness & Spatial Data

### Tarefa 4 — Integração POS (padronização de endpoints de inventário)

**Contexto:** Parceiros POS precisam enviar inventário em tempo real. A API precisa de endpoints padronizados para ingestão.

**O que fazer:**
- Criar Edge Function `ingest-pos-inventory` que aceite o formato padrão do parceiro POS.
- Definir schema de validação (Zod ou JSON Schema) na entrada da função.
- Persistir em tabela `pos_inventory` (criar migration aditiva).
- RLS: apenas `service_role` pode inserir; `authenticated` pode ler.

---

### Tarefa 5 — Substituir polígonos retangulares por jurisdições reais

**Contexto:** A tabela `legal_boundaries` tem placeholders retangulares. Para compliance, precisam ser polígonos reais.

**O que fazer:**
- Usar dados GeoJSON do governo (ex: limites estaduais dos EUA de cannabis).
- Criar migration para popular `legal_boundaries` com `POLYGON` real via PostGIS.
- Atualizar a função `verify-location` para usar `ST_Within(user_point, jurisdiction_polygon)`.
- **Aplicar via SQL Editor**, não via CLI.

---

### Tarefa 6 — Persistência offline com MMKV

**Contexto:** Se o usuário entrar em área sem sinal, eventos de localização não podem ser perdidos.

**O que fazer:**
- Instalar `react-native-mmkv`: `npx expo install react-native-mmkv`
- Criar `lib/storage/locationQueue.ts` com um buffer local de eventos.
- No `backgroundLocation.ts`, antes de fazer o `upsert` no Supabase, persistir localmente com MMKV.
- Em `_layout.tsx`, ao recuperar conexão, fazer flush da fila para o Supabase.

---

## Como rodar para testar

```bash
# Instalar dependências
npm install

# Build nativo Android (precisa Android Studio + AVD ou device físico com USB debug)
npx expo run:android

# Build na nuvem (sem precisar de Android Studio)
npx eas build --platform android --profile development
```

> Push notifications e background geolocation **não funcionam** no `expo start` (Expo Go). Sempre testar com build nativo.

---

## Regras importantes para não quebrar produção

1. **Nunca rodar `supabase db push`** — o banco é compartilhado com o app Capacitor em produção na App Store.
2. Toda migration deve ser aplicada **manualmente via SQL Editor** do Dashboard.
3. Todo SQL deve ser **idempotente** (`IF NOT EXISTS`, `CREATE OR REPLACE`, `ON CONFLICT DO NOTHING`).
4. Não alterar, renomear ou remover colunas existentes em tabelas críticas (`users`, `products`, `business_applications`, `orders`, `notification_preferences`).
5. Ao criar novas Edge Functions, testar localmente com `supabase functions serve` antes de fazer deploy.
