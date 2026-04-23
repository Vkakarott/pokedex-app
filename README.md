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

- **Expo Router (file-based routing):** escolha natural por ser o padrão do Expo. Para uma navegação em abas de baixa complexidade, adicionar o React Navigation manualmente geraria overhead desnecessário sem nenhum ganho prático.
- **Axios:** preferência pessoal por ser a biblioteca mais consolidada para requisições HTTP. Como as chamadas à PokéAPI são simples, não havia necessidade de nada mais sofisticado.
- **AsyncStorage:** opção mais comum para persistência local em React Native e suficiente para o escopo do projeto — armazenar uma lista de favoritos não exige estrutura relacional nem alta performance de leitura.
- **react-native-maps + expo-location:** após avaliação, `react-native-maps` atendia todos os requisitos com menor complexidade em relação a alternativas como Mapbox. O `expo-location` foi escolha óbvia pelo suporte nativo ao Expo e simplicidade de integração.
- **react-native-image-colors + expo-blur:** decisão puramente estética, para gerar cores de destaque dinâmicas a partir da imagem de cada Pokémon e aplicar efeito glassmorphism nos cards.
- **Arquitetura por feature (`src/features/`):** escolha que surgiu organicamente ao longo do desenvolvimento, agrupando lógica, hooks e utilitários por funcionalidade em vez de por tipo de arquivo.
- **Cache do catálogo em memória:** quando busca ou filtros estão ativos, o app busca todos os Pokémon uma única vez e armazena o resultado em `useRef`. Isso evita requisições repetidas a cada mudança de filtro, ao custo de um carregamento inicial maior — trade-off intencional para garantir responsividade na filtragem.
- **`expo-image` no lugar do `Image` do React Native:** melhor cache automático, suporte a formatos modernos e performance superior no carregamento de imagens remotas.

---

## Lint

```bash
npm run lint
```
