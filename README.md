# Timer Boss

Um timer moderno e elegante construído com React, TypeScript e Bootstrap.

## Funcionalidades

- ⏱️ Timer com contagem regressiva
- 🎵 Reprodução de som quando o timer termina
- ⏸️ Controles de play/pause/reset
- ⚙️ Tempo customizável
- 📱 Design responsivo
- 🎨 Interface moderna com Bootstrap

## Tecnologias

- React 18
- TypeScript
- Vite
- Bootstrap 5
- HTML5 Audio API

## Como usar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm run dev`
4. Acesse `http://localhost:5173`

## Deploy no Vercel

O projeto está configurado para deploy automático no Vercel:

1. Faça push para o GitHub
2. Conecte o repositório no Vercel
3. O deploy será automático

## Adicionando sons

Para adicionar um som de notificação, coloque o arquivo de áudio na pasta `public/` com um dos seguintes nomes:
- `notification.mp3`
- `notification.wav`
- `notification.ogg`

O timer tentará reproduzir o som quando a contagem regressiva terminar.