# Beepr Native

App React Native com Expo + Expo Router, UI em Nativewind e setup completo de onboarding.

## 🚀 Como rodar localmente

1. Instale dependências:
   ```bash
   npm install
   ```
2. Inicie o Metro:
   ```bash
   npm run start
   ```
3. Execute em dispositivo/emulador:
   - Android:
     ```bash
     npm run android
     ```
   - iOS:
     ```bash
     npm run ios
     ```

## 🗂 Estrutura de pastas

- `app/` - páginas e rotas do Expo Router
- `app/(auth)/` - autenticação (welcome, register, login, verify)
- `app/(onboarding)/` - onboarding inicial
- `app/(setup)/` - fluxo de setup por etapas
- `app/components/` - componentes de UI reutilizáveis

## ✅ Scripts úteis

- `npm run start` - inicia Metro
- `npm run android` - roda no emulador/dispositivo Android
- `npm run ios` - roda no emulador iOS

## 🧩 Tecnologias

- React Native
- Expo
- Expo Router
- TypeScript
- Nativewind
- supabase-js (já instalado, pode ser usado para dados)

## 🧪 Validação

Executar:
```bash
npx tsc --noEmit
```


## 📌 Push para GitHub

1. `git add .`
2. `git commit -m "Add README"
3. `git push`

---

## 💡 Melhoria futura

- Adicionar testes com Jest + @testing-library/react-native
- Adicionar CI com GitHub Actions
- Configurar deploy Expo e publish
