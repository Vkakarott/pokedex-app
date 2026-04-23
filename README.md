# PokeBox

Aplicativo mobile desenvolvido com **Expo** e **React Native** para explorar o universo Pokémon. Permite navegar pela Pokédex completa, pesquisar e filtrar Pokémon, salvar favoritos e visualizar Pokémon próximos no mapa usando a localização do dispositivo.

---

## Funcionalidades

- **Pokédex** — listagem paginada de todos os Pokémon com carregamento incremental
- **Pesquisa e Filtros** — busca por nome, filtro por tipo e geração, ordenação por nome ou ID
- **Detalhes do Pokémon** — estatísticas, habilidades, tipos, altura e peso
- **Favoritos** — marque Pokémon favoritos com persistência local via AsyncStorage
- **Mapa** — visualize Pokémon distribuídos aleatoriamente no mapa ao redor da sua localização atual
- **UI customizada** — barra de navegação com efeito curvo e glassmorphism

---

## Tecnologias

| Categoria | Biblioteca |
|---|---|
| Framework | Expo ~54 / React Native 0.81 |
| Roteamento | Expo Router ~6 (file-based) |
| HTTP | Axios ~1.15 |
| Armazenamento local | @react-native-async-storage/async-storage |
| Mapas | react-native-maps |
| Localização | expo-location |
| Animações | react-native-reanimated |
| Imagens | expo-image + react-native-image-colors |
| Efeitos visuais | expo-blur |
| Linguagem | TypeScript ~5.9 (strict) |

---

## Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**
- iOS: **Xcode** com simulador configurado
- Android: **Android Studio** com emulador configurado

---

## Instalação e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Gerar os projetos nativos

```bash
npx expo prebuild
```

> Este comando gera as pastas `ios/` e `android/` com o código nativo necessário para compilar o app.

### 3. Executar o aplicativo

```bash
# iOS (simulador)
npx expo run:ios

# Android (emulador)
npx expo run:android
```

---

## Estrutura do projeto

```
poke/
├── app/                        # Rotas (Expo Router)
│   ├── _layout.tsx             # Layout raiz com providers
│   ├── index.tsx               # Redireciona para /pokedex
│   ├── (tabs)/                 # Grupo de abas
│   │   ├── pokedex.tsx         # Tela da Pokédex
│   │   ├── favorite.tsx        # Tela de favoritos
│   │   └── map.tsx             # Tela do mapa
│   └── pokemon/
│       └── [pokemonName].tsx   # Detalhes de um Pokémon
├── src/
│   ├── api/                    # Integração com a PokéAPI v2
│   ├── components/             # Componentes reutilizáveis
│   ├── contexts/               # FavoritesContext (AsyncStorage)
│   ├── features/               # Lógica por funcionalidade (hooks)
│   ├── hooks/                  # Hooks genéricos
│   └── utils/                  # Funções utilitárias
├── assets/                     # Ícones e imagens do app
├── app.json                    # Configuração do Expo
└── tsconfig.json               # Configuração TypeScript
```

---

## API

O aplicativo consome a [PokéAPI v2](https://pokeapi.co/api/v2) — pública e sem necessidade de autenticação. Não é necessário configurar variáveis de ambiente.

---

## Decisões técnicas

> Substitua cada item abaixo pela sua justificativa real.

- **Expo Router (file-based routing):** ...
- **Axios:** ...
- **AsyncStorage para favoritos:** ...
- **react-native-maps + expo-location:** ...
- **react-native-image-colors + expo-blur:** ...
- **Arquitetura por feature (`src/features/`):** ...

---

## Lint

```bash
npm run lint
```
